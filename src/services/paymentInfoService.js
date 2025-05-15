/**
 * Payment Info Service - Handles all data operations for the payment_info table
 */

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get payment info for a specific order
 */
export const getPaymentInfo = async (orderId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "order_id" } },
        { Field: { Name: "card_number" } },
        { Field: { Name: "card_type" } },
        { Field: { Name: "expiry_date" } }
        // Note: We intentionally don't fetch CVV for security reasons
      ],
      where: [
        {
          fieldName: "order_id",
          Operator: "ExactMatch",
          values: [orderId]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('payment_info', params);
    
    if (response.data && response.data.length > 0) {
      // Mask card number for security (only show last 4 digits)
      const paymentInfo = response.data[0];
      if (paymentInfo.card_number) {
        paymentInfo.card_number = `xxxx-xxxx-xxxx-${paymentInfo.card_number.slice(-4)}`;
      }
      return paymentInfo;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching payment info for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Create payment info for an order
 */
export const createPaymentInfo = async (paymentData) => {
  try {
    const apperClient = getApperClient();
    
    // Store only masked card numbers in the database for security
    const securePaymentData = { ...paymentData };
    if (securePaymentData.card_number) {
      // Store last 4 digits only
      securePaymentData.card_number = securePaymentData.card_number.slice(-4);
    }
    
    const response = await apperClient.createRecord('payment_info', { records: [securePaymentData] });
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating payment info:", error);
    throw error;
  }
};

/**
 * Update payment info (generally not recommended for security reasons)
 */
export const updatePaymentInfo = async (paymentId, updates) => {
  try {
    const apperClient = getApperClient();
    
    // Store only masked card numbers in the database for security
    const secureUpdates = { ...updates };
    if (secureUpdates.card_number) {
      // Store last 4 digits only
      secureUpdates.card_number = secureUpdates.card_number.slice(-4);
    }
    
    const updateData = { Id: paymentId, ...secureUpdates };
    const response = await apperClient.updateRecord('payment_info', { records: [updateData] });
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating payment info ${paymentId}:`, error);
    throw error;
  }
};