import { useCart } from '../../contexts/CartContext';
import getIcon from '../../utils/iconUtils';

const OrderSummary = ({ isEditable = false }) => {
  const { 
    cart, 
    subtotal, 
    shipping, 
    tax, 
    total,
    updateQuantity, 
    removeFromCart 
  } = useCart();

  const PlusIcon = getIcon('Plus');
  const MinusIcon = getIcon('Minus');
  const TrashIcon = getIcon('Trash2');

  return (
    <div className="bg-white dark:bg-surface-800 rounded-lg shadow-card p-6">
      <h3 className="text-lg font-bold mb-4">Order Summary</h3>
      
      {/* Items */}
      <div className="divide-y divide-surface-200 dark:divide-surface-700">
        {cart.map(item => (
          <div key={item.id} className="py-4 flex gap-3">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">{item.name}</h4>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              
              <div className="text-sm text-surface-500 dark:text-surface-400 mb-2">
                ${item.price.toFixed(2)} each
              </div>
              
              {isEditable && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600"
                  >
                    <MinusIcon className="w-3 h-3" />
                  </button>
                  
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600"
                  >
                    <PlusIcon className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-auto p-1 text-surface-500 hover:text-secondary"
                    aria-label="Remove item"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Totals */}
      <div className="border-t border-surface-200 dark:border-surface-700 pt-4 mt-4 space-y-2">
        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-surface-200 dark:border-surface-700"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>
    </div>
  );
};

export default OrderSummary;