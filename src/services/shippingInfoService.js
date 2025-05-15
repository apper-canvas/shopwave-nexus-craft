/**
 * Shipping Info Service - Handles all data operations for the shipping_info table
 */

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get shipping info for a specific order
 */
export const getShippingInfo = async (orderId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "order_id" } },
        { Field: { Name: "first_name" } },
        { Field: { Name: "last_name" } },
        { Field: { Name: "address" } },
        { Field: { Name: "city" } },
        { Field: { Name: "state" } },
        { Field: { Name: "zip" } },
        { Field: { Name: "email" } }
      ],
      where: [
        {
          fieldName: "order_id",
          Operator: "ExactMatch",
          values: [orderId]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('shipping_info', params);
    return response.data && response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`Error fetching shipping info for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Create shipping info for an order
 */
export const createShippingInfo = async (shippingData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord('shipping_info', { records: [shippingData] });
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating shipping info:", error);
    throw error;
  }
};

/**
 * Update shipping info
 */
export const updateShippingInfo = async (shippingId, updates) => {
  try {
    const apperClient = getApperClient();
    const updateData = { Id: shippingId, ...updates };
    const response = await apperClient.updateRecord('shipping_info', { records: [updateData] });
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating shipping info ${shippingId}:`, error);
    throw error;
  }
};