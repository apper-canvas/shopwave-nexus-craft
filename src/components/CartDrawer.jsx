import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import getIcon from '../utils/iconUtils';

const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    totalItems, 
    subtotal, 
    removeFromCart, 
    updateQuantity
  } = useCart();
  
  const navigate = useNavigate();

  // Icons
  const XIcon = getIcon('X');
  const ShoppingCartIcon = getIcon('ShoppingCart');
  const PlusIcon = getIcon('Plus');
  const MinusIcon = getIcon('Minus');
  const TrashIcon = getIcon('Trash2');
  const ArrowRightIcon = getIcon('ArrowRight');

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    
    setIsCartOpen(false);
    navigate('/checkout');
    toast.info("Proceed to checkout");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsCartOpen(false)}
      ></div>
      
      {/* Cart panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative w-full sm:w-96 md:w-[450px] bg-white dark:bg-surface-800 h-full flex flex-col shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-700 p-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingCartIcon className="w-16 h-16 text-surface-300 dark:text-surface-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.map(item => (
                <div 
                  key={item.id} 
                  className="flex gap-4 py-4 border-b border-surface-200 dark:border-surface-700 last:border-b-0"
                >
                  <div className="w-20 h-20 flex-none rounded-lg overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{item.name}</h4>
                    <div className="text-surface-600 dark:text-surface-400 text-sm mb-2">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto p-1 text-surface-500 hover:text-secondary"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-surface-200 dark:border-surface-700 p-4">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="text-xs text-surface-500 dark:text-surface-400 mb-4">
                Shipping and taxes calculated at checkout
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full btn bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              > 
                Checkout <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CartDrawer;