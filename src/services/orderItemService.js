/**
 * Order Item Service - Handles all data operations for the order_item table
 */

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get order items for a specific order
 */
export const getOrderItems = async (orderId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "order_id" } },
        { Field: { Name: "product_id" } },
        { Field: { Name: "quantity" } },
        { Field: { Name: "price" } }
      ],
      where: [
        {
          fieldName: "order_id",
          Operator: "ExactMatch",
          values: [orderId]
        }
      ],
      expands: [
        {
          name: "product_id"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('order_item', params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching order items for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Create new order items (bulk)
 */
export const createOrderItems = async (items) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord('order_item', { records: items });
    return response.results.map(result => result.data);
  } catch (error) {
    console.error("Error creating order items:", error);
    throw error;
  }
};

/**
 * Delete all order items for an order
 */
export const deleteOrderItems = async (orderId) => {
  try {
    const apperClient = getApperClient();
    const itemsToDelete = await getOrderItems(orderId);
    
    if (itemsToDelete.length === 0) {
      return true;
    }
    
    const recordIds = itemsToDelete.map(item => item.Id);
    await apperClient.deleteRecord('order_item', { RecordIds: recordIds });
    return true;
  } catch (error) {
    console.error(`Error deleting order items for order ${orderId}:`, error);
    throw error;
  }
};