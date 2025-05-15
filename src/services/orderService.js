/**
 * Order Service - Handles all data operations for the order table
 */

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get orders with optional filtering
 */
export const getOrders = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "date" } },
        { Field: { Name: "status" } },
        { Field: { Name: "subtotal" } },
        { Field: { Name: "shipping" } },
        { Field: { Name: "tax" } },
        { Field: { Name: "total" } },
        { Field: { Name: "Owner" } }
      ],
      where: []
    };
    
    // Add user filter if provided
    if (filters.userId) {
      params.where.push({
        fieldName: "Owner",
        Operator: "ExactMatch",
        values: [filters.userId]
      });
    }
    
    // Add status filter if provided
    if (filters.status) {
      params.where.push({
        fieldName: "status",
        Operator: "ExactMatch",
        values: [filters.status]
      });
    }
    
    const response = await apperClient.fetchRecords('order', params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

/**
 * Get an order by ID
 */
export const getOrderById = async (orderId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('order', orderId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Track an order by ID and email
 */
export const trackOrder = async (orderId, email) => {
  try {
    const apperClient = getApperClient();
    
    // First get the order
    const orderResponse = await apperClient.getRecordById('order', orderId);
    
    if (!orderResponse.data) {
      return null;
    }
    
    // Then get the shipping info to match with email
    const shippingParams = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "order_id" } },
        { Field: { Name: "email" } }
      ],
      where: [
        { fieldName: "order_id", Operator: "ExactMatch", values: [orderId] },
        { fieldName: "email", Operator: "ExactMatch", values: [email] }
      ]
    };
    
    const shippingResponse = await apperClient.fetchRecords('shipping_info', shippingParams);
    
    // If we find a match, return the order details
    if (shippingResponse.data && shippingResponse.data.length > 0) {
      // Get related data for this order (items, shipping details, payment info)
      // We'll implement this in the UI component for now.
      return orderResponse.data;
    }
    
    return null;
  } catch (error) {
    console.error(`Error tracking order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord('order', { records: [orderData] });
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const apperClient = getApperClient();
    const updateData = { Id: orderId, status };
    const response = await apperClient.updateRecord('order', { records: [updateData] });
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
};