import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

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
    
    toast.success(`${product.name} added to cart!`);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.info("Item removed from cart");
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
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return false;
    }
    
    if (!shippingInfo || !paymentInfo) {
      toast.error("Missing shipping or payment information!");
      return false;
    }
    
    const order = { 
      id: Date.now(), 
      items: [...cart], 
      shipping: shippingInfo, 
      payment: { ...paymentInfo, cardNumber: paymentInfo.cardNumber.slice(-4) }, // Only store last 4 digits
      total, subtotal, tax, shipping, date: new Date().toISOString() 
    };
    
    setOrderHistory(prev => [...prev, order]);
    return order;
  }, [cart, shippingInfo, paymentInfo, total, subtotal, tax, shipping]);

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      totalItems,
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
      orderHistory
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;