/**
 * Product Service - Handles all data operations for the product table
 */

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get all products with optional filtering
 */
export const getProducts = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "price" } },
        { Field: { Name: "description" } },
        { Field: { Name: "image" } },
        { Field: { Name: "quantity" } }
      ],
      where: []
    };
    
    // Add filters if provided
    if (filters.name) {
      params.where.push({
        fieldName: "Name",
        Operator: "Contains",
        values: [filters.name]
      });
    }
    
    // Add sorting if needed
    if (filters.sort) {
      params.orderBy = [
        { field: filters.sort, direction: filters.direction || "asc" }
      ];
    }
    
    const response = await apperClient.fetchRecords('product', params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Get a product by ID
 */
export const getProductById = async (productId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('product', productId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

/**
 * Create a new product
 */
export const createProduct = async (productData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord('product', { records: [productData] });
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * Update a product
 */
export const updateProduct = async (productId, updates) => {
  try {
    const apperClient = getApperClient();
    const updateData = { Id: productId, ...updates };
    const response = await apperClient.updateRecord('product', { records: [updateData] });
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};