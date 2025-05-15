import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import getIcon from '../utils/iconUtils';
import OrderTracking from '../components/OrderTracking';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const { isProcessing } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(() => searchParams.get('orderId') || '');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [searchCompleted, setSearchCompleted] = useState(false);

  const SearchIcon = getIcon('Search');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const HomeIcon = getIcon('Home');

  useEffect(() => {
    // If order ID is provided in URL and we have a valid email, auto-track
    const urlOrderId = searchParams.get('orderId');
    if (urlOrderId) {
      setOrderId(urlOrderId);
      
      // If we have a pre-filled email from the context
      if (email) {
        handleTrackOrder();
      }
    }
  }, [searchParams]);

  const trackOrder = async (orderId, email) => {
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
      
      // If we find a match, return the order details
      if (shippingResponse.data && shippingResponse.data.length > 0) {
        return orderResponse.data;
      }
      
      return null;
    } catch (error) {
      console.error(`Error tracking order ${orderId}:`, error);
      return null;
    }
  };

  const handleTrackOrder = async (e) => {
    if (e) e.preventDefault();
    
    // Validate inputs
    if (!orderId.trim()) {
      setOrder(null);
      return;
    }
    
    if (!email.trim()) {
      setOrder(null);
      return;
    }
    
    try {
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setOrder(null);
        return;
      }
      
      setIsLoading(true);
      setSearchCompleted(false);
      
      // Call the actual API
      const result = await trackOrder(orderId, email);
      
      if (result) {
        setOrder(result);
      } else {
        setOrder(null);
      }
      
      setSearchCompleted(true);
    } catch (error) {
      console.error("Error tracking order:", error);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <ol className="flex items-center text-sm">
          <li className="flex items-center">
            <Link to="/" className="text-primary flex items-center hover:underline">
              <HomeIcon className="w-4 h-4 mr-1" />
              Home
            </Link>
          </li>
          <li className="mx-2 text-surface-400">/</li>
          <li className="text-surface-700 dark:text-surface-300">Track Order</li>
        </ol>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Track Your Order</h1>

      <div className="max-w-3xl mx-auto bg-white dark:bg-surface-800 rounded-lg shadow-card p-6 mb-8">
        <form onSubmit={handleTrackOrder} className="mb-6">
          <div className="mb-4">
            <label htmlFor="orderId" className="block mb-1 font-medium">Order ID</label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="form-input w-full"
              placeholder="Enter your order ID (e.g., 12345678)"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input w-full"
              placeholder="Enter the email used for the order"
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2" disabled={isLoading}>
            {isLoading ? 'Searching...' : <><SearchIcon className="w-5 h-5" /> Track Order</>}
          </button>
        </form>

        {searchCompleted && !order && !isLoading && (
          <div className="text-center py-8 border-t border-surface-200 dark:border-surface-700">
            <p className="text-surface-600 dark:text-surface-400 mb-4">No order found with the provided information.</p>
            <p>Please check your order ID and email address and try again.</p>
          </div>
        )}

        {order && <OrderTracking order={order} />}
      </div>
    </div>
  );
};

export default TrackOrder;