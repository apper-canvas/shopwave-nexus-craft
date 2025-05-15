import { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCart } from './contexts/CartContext';
import CartDrawer from './components/CartDrawer';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ShippingInfo from './pages/checkout/ShippingInfo';
import PaymentInfo from './pages/checkout/PaymentInfo';
import OrderConfirmation from './pages/checkout/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import { setUser, clearUser } from './store/userSlice';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
                '/callback') || currentPath.includes('/error');
        if (user) {
            // User is authenticated
            if (redirectPath) {
                navigate(redirectPath);
            } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                    navigate(currentPath);
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
            // Store user information in Redux
            dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
            // User is not authenticated
            if (!isAuthPage) {
                navigate(
                    currentPath.includes('/signup')
                     ? `/signup?redirect=${currentPath}`
                     : currentPath.includes('/login')
                     ? `/login?redirect=${currentPath}`
                     : '/login');
            } else if (redirectPath) {
                if (
                    ![
                        'error',
                        'signup',
                        'login',
                        'callback'
                    ].some((path) => currentPath.includes(path)))
                    navigate(`/login?redirect=${redirectPath}`);
                else {
                    navigate(currentPath);
                }
            } else if (isAuthPage) {
                navigate(currentPath);
            } else {
                navigate('/login');
            }
            dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
    
    setIsInitialized(true);
  }, [dispatch, navigate]);
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const ShoppingBagIcon = getIcon('ShoppingBag');
  const ShoppingCartIcon = getIcon('ShoppingCart');
  const LogOutIcon = getIcon('LogOut');
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
    if (!isAuthenticated) return <Navigate to={`/login?redirect=${window.location.pathname}`} replace />;
    if (cart.length === 0) return <Navigate to="/" replace />;
    return children;
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Initializing application...</div>
    </div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <header className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBagIcon className="text-primary w-6 h-6" />
              <span className="text-xl font-bold">ShopWave</span>
            </div>
            
            <div className="hidden sm:flex items-center space-x-6">
              <Link to="/" className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/track-order" className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">Track Order</Link>
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="text-surface-700 dark:text-surface-300">
                    {userState.user?.firstName || 'User'}
                  </div>
                  <button
                    onClick={authMethods.logout}
                    className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOutIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary transition-colors">Login</Link>
                  <Link to="/signup" className="btn btn-primary py-1">Sign Up</Link>
                </div>
              )}
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
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
            <Route path="/track-order" element={<TrackOrder />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-surface-800 py-6 border-t border-surface-200 dark:border-surface-700 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-surface-600 dark:text-surface-400">
                © {new Date().getFullYear()} ShopWave. All rights reserved.
              </p>
            </div>
          </div>
        </footer>


        {/* Cart Drawer */}
        <CartDrawer />
      </div>
    </AuthContext.Provider>
  );
}

export default App;