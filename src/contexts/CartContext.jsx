import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

// Import services
import { createOrder, updateOrderStatus } from '../services/orderService';
import { createOrderItems } from '../services/orderItemService';
import { createShippingInfo } from '../services/shippingInfoService';
import { createPaymentInfo } from '../services/paymentInfoService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Get auth state from Redux
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderHistory, setOrderHistory] = useState(() => {
    const savedHistory = localStorage.getItem('orderHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Save order history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }, [orderHistory]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Derived values
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Add item to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedCart = prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    console.log(`${product.name} added to cart!`);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    console.log("Item removed from cart");
  };

  // Update item quantity
  const updateQuantity = (productId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // Save shipping information
  const saveShippingInfo = (info) => {
    setShippingInfo(info);
    return true;
  };

  // Save payment information
  const savePaymentInfo = (info) => {
    setPaymentInfo(info);
    return true;
  };

  // Process order
  const processOrder = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        if (cart.length === 0) {
          console.error("Your cart is empty!");
          reject("Cart is empty");
          return;
        }
        
        if (!shippingInfo || !paymentInfo) {
          console.error("Missing shipping or payment information!");
          reject("Missing information");
          return;
        }

        if (!isAuthenticated) {
          console.error("You must be logged in to complete an order!");
          reject("Not authenticated");
          return;
        }
        
        setIsProcessing(true);
        
        // 1. Create the order record
        const orderData = {
          Name: `Order-${Date.now()}`,
          status: 'Processing',
          date: new Date().toISOString(),
          subtotal,
          shipping,
          tax,
          total,
          Owner: user.emailAddress
        };
        
        const createdOrder = await createOrder(orderData);
        
        // 2. Create order items
        const orderItems = cart.map(item => ({
          Name: `Item-${item.name}`,
          order_id: createdOrder.Id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }));
        
        await createOrderItems(orderItems);
        
        // 3. Create shipping info
        const shippingData = {
          Name: `Shipping-${createdOrder.Id}`,
          order_id: createdOrder.Id,
          ...shippingInfo
        };
        
        await createShippingInfo(shippingData);
        
        // 4. Create payment info (with security in mind)
        const paymentData = {
          Name: `Payment-${createdOrder.Id}`,
          order_id: createdOrder.Id,
          card_number: paymentInfo.cardNumber,
          card_type: paymentInfo.cardType,
          expiry_date: paymentInfo.expiryDate,
          cvv: '***' // Don't store the actual CVV
        };
        
        await createPaymentInfo(paymentData);
        
        // Add to order history for local tracking
        const order = { id: createdOrder.Id, items: [...cart], shipping: shippingInfo, payment: { ...paymentInfo, cardNumber: paymentInfo.cardNumber.slice(-4) }, total, subtotal, tax, shipping, date: new Date().toISOString() };
        setOrderHistory(prev => [...prev, order]);
        
        setIsProcessing(false);
        resolve(order);
      } catch (error) {
        setIsProcessing(false);
        console.error("Error processing order:", error);
        console.error("Failed to process order. Please try again.");
        reject(error);
      }
    });
  }, [cart, shippingInfo, paymentInfo, total, subtotal, tax, shipping, isAuthenticated, user]);

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Track order
  const trackOrder = useCallback(async (orderId, email) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // First get the order
      const orderResponse = await apperClient.getRecordById('order', orderId);
      
      if (!orderResponse.data) {
        return null;
      }
      
      // Then get the shipping info to match with email
      const shippingParams = {
        where: [
          { fieldName: "order_id", Operator: "ExactMatch", values: [orderId] },
          { fieldName: "email", Operator: "ExactMatch", values: [email] }
        ]
      };
      
      const shippingResponse = await apperClient.fetchRecords('shipping_info', shippingParams);
      
      // If we find a match, fetch all related data for the order
      if (shippingResponse.data && shippingResponse.data.length > 0) {
        const orderItemsParams = {
          where: [{ fieldName: "order_id", Operator: "ExactMatch", values: [orderId] }]
        };
        
        const itemsResponse = await apperClient.fetchRecords('order_item', orderItemsParams);
        const paymentResponse = await apperClient.fetchRecords('payment_info', { where: [{ fieldName: "order_id", Operator: "ExactMatch", values: [orderId] }] });
        
        // Combine all data
        return { ...orderResponse.data, shipping: shippingResponse.data[0], items: itemsResponse.data || [], payment: paymentResponse.data[0] || {} };
      }
      
      return null;
    } catch (error) {
      console.error(`Error tracking order ${orderId}:`, error);
      return null;
    }
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      totalItems,
      isProcessing,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      // Checkout related
      shipping,
      tax,
      total,
      shippingInfo,
      saveShippingInfo,
      paymentInfo,
      savePaymentInfo,
      processOrder,
      orderHistory,
      trackOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;