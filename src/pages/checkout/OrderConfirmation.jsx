import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutLayout from '../../components/checkout/CheckoutLayout';
import { useCart } from '../../contexts/CartContext';
import getIcon from '../../utils/iconUtils';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    shippingInfo, 
    paymentInfo,
    subtotal,
    shipping,
    tax,
    total,
    processOrder,
    clearCart 
  } = useCart();
  
  const [order, setOrder] = useState(null);
  const CheckCircleIcon = getIcon('CheckCircle');
  const TruckIcon = getIcon('Truck');
  const HomeIcon = getIcon('Home');
  const SearchIcon = getIcon('Search');

  useEffect(() => {
    // Process the order when component mounts
    if (cart.length === 0) {
      navigate('/');
      return;
    }
    
    if (!shippingInfo || !paymentInfo) {
      navigate('/checkout');
      return;
    }
    
    const orderData = processOrder();
    if (orderData) {
      setOrder(orderData);
      // Clear cart after successful order processing
      clearCart();
      toast.success("Your order has been placed successfully!");
    } else {
      toast.error("There was an error processing your order");
      navigate('/checkout');
    }
  }, [processOrder, clearCart, navigate, cart.length, shippingInfo, paymentInfo]);

  if (!order) {
    return <div className="container mx-auto px-4 py-8 text-center">Processing your order...</div>;
  }

  return (
    <CheckoutLayout activeStep={4} title="Order Confirmation">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-card p-8 text-center mb-8">
          <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Thank you for your order!</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            Your order #{order.id.toString().slice(-8)} has been placed successfully.
          </p>
          
          <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm mb-1">
              <TruckIcon className="w-4 h-4" />
              <span>Estimated delivery: 3-5 business days</span>
            </div>
            <div className="text-sm text-surface-600 dark:text-surface-400">
              A confirmation email has been sent to {order.shipping.email}
            </div>
          </div>
          
          <div className="text-left border-t border-surface-200 dark:border-surface-700 pt-6 mt-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            
            <dl className="space-y-2">
              <div className="flex justify-between"><dt>Order number:</dt><dd className="font-medium">#{order.id.toString().slice(-8)}</dd></div>
              <div className="flex justify-between"><dt>Order date:</dt><dd>{new Date(order.date).toLocaleDateString()}</dd></div>
              <div className="flex justify-between"><dt>Shipping address:</dt><dd>{order.shipping.address}, {order.shipping.city}</dd></div>
              <div className="flex justify-between"><dt>Payment method:</dt><dd>Card ending in {order.payment.cardNumber}</dd></div>
              <div className="flex justify-between font-bold pt-2 border-t border-surface-200 dark:border-surface-700 mt-2"><dt>Total amount:</dt><dd>${order.total.toFixed(2)}</dd></div>
            </dl>
          </div>
          
          <Link to="/" className="btn btn-primary mt-8 inline-flex items-center gap-2">
            <HomeIcon className="w-5 h-5" /> Continue Shopping
          </Link>
          
          <Link to={`/track-order?orderId=${order.id.toString().slice(-8)}`} className="btn btn-secondary mt-8 ml-4 inline-flex items-center gap-2">
            <SearchIcon className="w-5 h-5" /> Track Your Order
          </Link>
        </div>

      </div>
    </CheckoutLayout>
  );
};

export default OrderConfirmation;