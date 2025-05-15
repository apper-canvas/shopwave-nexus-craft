import { useState } from 'react';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

const OrderTracking = ({ order }) => {
  const [activeTab, setActiveTab] = useState('status');
  
  const TruckIcon = getIcon('Truck');
  const BoxIcon = getIcon('Package');
  const CheckIcon = getIcon('CheckCircle');
  const ClockIcon = getIcon('Clock');
  const MapPinIcon = getIcon('MapPin');
  const ShoppingBagIcon = getIcon('ShoppingBag');
  
  const orderDate = new Date(order.date);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  
  // Determine progress based on status
  const getProgressPercentage = () => {
    switch (order.status) {
      case 'Processing': return 25;
      case 'Shipped': return 50;
      case 'Out for Delivery': return 75;
      case 'Delivered': return 100;
      default: return 0;
    }
  };
  
  // For the tracking steps
  const steps = [
    { id: 1, name: 'Order Placed', date: format(orderDate, 'MMM d, yyyy'), icon: ShoppingBagIcon, complete: true },
    { id: 2, name: 'Processing', icon: ClockIcon, complete: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) },
    { id: 3, name: 'Shipped', icon: BoxIcon, complete: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) },
    { id: 4, name: 'Out for Delivery', icon: TruckIcon, complete: ['Out for Delivery', 'Delivered'].includes(order.status) },
    { id: 5, name: 'Delivered', icon: CheckIcon, complete: ['Delivered'].includes(order.status) }
  ];

  return (
    <div className="border-t border-surface-200 dark:border-surface-700 pt-6 mt-6">
      <div className="flex border-b border-surface-200 dark:border-surface-700 mb-6">
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'status' ? 'text-primary border-b-2 border-primary' : 'text-surface-600 dark:text-surface-400'}`}
          onClick={() => setActiveTab('status')}
        >
          Tracking Status
        </button>
        <button
          className={`pb-2 px-4 font-medium ${activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-surface-600 dark:text-surface-400'}`}
          onClick={() => setActiveTab('details')}
        >
          Order Details
        </button>
      </div>
      
      {activeTab === 'status' && (
        <div>
          <div className="flex justify-between mb-4">
            <div>
              <div className="text-lg font-bold">{order.status}</div>
              <div className="text-surface-600 dark:text-surface-400 text-sm">Last Updated: {format(new Date(), 'MMM d, yyyy')}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-sm">
                <TruckIcon className="w-4 h-4 text-primary" />
                <span>Estimated Delivery: {format(estimatedDelivery, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center justify-end gap-1 text-sm text-surface-600 dark:text-surface-400">
                <MapPinIcon className="w-4 h-4" />
                <span>{order.shipping.address}, {order.shipping.city}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 mb-6">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${getProgressPercentage()}%` }} 
            />
          </div>
          
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${step.complete ? 'bg-green-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{step.name}</div>
                  {step.date && <div className="text-sm text-surface-600 dark:text-surface-400">{step.date}</div>}
                </div>
                {step.complete && <CheckIcon className="w-5 h-5 text-green-500 ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'details' && (
        <div>
          <h3 className="font-semibold mb-4">Order Summary</h3>
          
          <dl className="space-y-2 mb-6">
            <div className="flex justify-between"><dt>Order number:</dt><dd className="font-medium">#{order.id.toString().slice(-8)}</dd></div>
            <div className="flex justify-between"><dt>Order date:</dt><dd>{format(new Date(order.date), 'MMM d, yyyy')}</dd></div>
            <div className="flex justify-between"><dt>Payment method:</dt><dd>Card ending in {order.payment.cardNumber}</dd></div>
            <div className="flex justify-between font-bold pt-2 border-t border-surface-200 dark:border-surface-700 mt-2"><dt>Total amount:</dt><dd>${order.total.toFixed(2)}</dd></div>
          </dl>
          
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="mb-6">
            {order.shipping.firstName} {order.shipping.lastName}<br />
            {order.shipping.address}<br />
            {order.shipping.city}, {order.shipping.state} {order.shipping.zip}<br />
            {order.shipping.email}
          </p>
          
          <h3 className="font-semibold mb-2">Order Items</h3>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between"><span>{item.quantity}x {item.name}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;