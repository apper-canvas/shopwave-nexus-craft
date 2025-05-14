import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CartProvider, useCart } from './contexts/CartContext';
import CartDrawer from './components/CartDrawer';
import 'react-toastify/dist/ReactToastify.css';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ShippingInfo from './pages/checkout/ShippingInfo';
import PaymentInfo from './pages/checkout/PaymentInfo';
import OrderConfirmation from './pages/checkout/OrderConfirmation';

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const ShoppingBagIcon = getIcon('ShoppingBag');
  const ShoppingCartIcon = getIcon('ShoppingCart');
  const { totalItems, setIsCartOpen, cart } = useCart();

  // Update dark mode in localStorage and body class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Protected route for checkout - redirects to home if cart is empty
  const ProtectedCheckoutRoute = ({ children }) => {
    if (cart.length === 0) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="text-primary w-6 h-6" />
            <span className="text-xl font-bold">ShopWave</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 relative transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:opacity-80 transition-opacity"
              aria-label="Toggle dark mode"
            >
              {darkMode ? 
                <SunIcon className="w-5 h-5 text-yellow-400" /> : 
                <MoonIcon className="w-5 h-5 text-surface-600" />
              }
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedCheckoutRoute>
                <CheckoutPage />
              </ProtectedCheckoutRoute>
            } 
          />
          <Route path="/checkout/shipping" element={<ProtectedCheckoutRoute><ShippingInfo /></ProtectedCheckoutRoute>} />
          <Route path="/checkout/payment" element={<ProtectedCheckoutRoute><PaymentInfo /></ProtectedCheckoutRoute>} />
          <Route path="/checkout/confirmation" element={<ProtectedCheckoutRoute><OrderConfirmation /></ProtectedCheckoutRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-surface-800 py-6 border-t border-surface-200 dark:border-surface-700 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-surface-600 dark:text-surface-400">
            © {new Date().getFullYear()} ShopWave. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;

// This provides a global cart state and drawer that can be accessed
// from anywhere in the application.