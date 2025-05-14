import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Mock products data
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Modern Ergonomic Chair",
    price: 259.99,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "A comfortable ergonomic chair perfect for home offices with adjustable height and lumbar support."
  },
  {
    id: 2,
    name: "Premium Bluetooth Headphones",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Noise-cancelling wireless headphones with 40-hour battery life and premium sound quality."
  },
  {
    id: 3,
    name: "Minimalist Desk Lamp",
    price: 89.99,
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1534241069535-022830560e64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Adjustable LED desk lamp with multiple brightness levels and a modern design."
  },
  {
    id: 4,
    name: "Ultra-thin Smart Watch",
    price: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Feature-packed smartwatch with health monitoring, notifications and 7-day battery life."
  },
  {
    id: 5,
    name: "Handcrafted Ceramic Mug",
    price: 28.99,
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1577937927133-66ef8448d035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Artisan-made ceramic mug with unique glaze pattern, perfect for your morning coffee."
  },
  {
    id: 6,
    name: "Organic Cotton T-Shirt",
    price: 34.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Sustainably sourced 100% organic cotton t-shirt with a comfortable relaxed fit."
  }
];

const MainFeature = () => {
  // Icon declarations
  const ShoppingCartIcon = getIcon('ShoppingCart');
  const FilterIcon = getIcon('SlidersHorizontal');
  const SearchIcon = getIcon('Search');
  const PlusIcon = getIcon('Plus');
  const MinusIcon = getIcon('Minus');
  const TrashIcon = getIcon('Trash2');
  const XIcon = getIcon('X');
  const ArrowRightIcon = getIcon('ArrowRight');
  const HeartIcon = getIcon('Heart');
  const TagIcon = getIcon('Tag');

  // State management
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleProduct, setVisibleProduct] = useState(null);

  // Derived values
  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Functions
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

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.info("Item removed from cart");
  };
  
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
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    
    toast.success("Thank you for your order!");
    setCart([]);
    setCartOpen(false);
  };
  
  const showProductDetails = (product) => {
    setVisibleProduct(product);
  };

  // Animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="relative">
      {/* Search and Filter */}
      <div className="bg-gradient-to-r from-primary to-secondary py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="flex-1 max-w-xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Find Your Perfect Products
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 px-5 pr-12 rounded-full border-0 focus:ring-2 focus:ring-white text-surface-800 shadow-lg"
                />
                <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              </div>
            </div>
            
            <div className="relative flex-none">
              <button 
                onClick={() => setCartOpen(true)}
                className="bg-white text-primary px-4 py-3 rounded-full font-medium flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Cart ({totalItems})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Filters */}
      <div className="bg-white dark:bg-surface-800 shadow-sm sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
            <div className="flex-none flex items-center text-surface-500 pr-3">
              <FilterIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-none px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white' 
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="container mx-auto px-4 py-10">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-4 text-surface-600 dark:text-surface-300">
              No products found
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="btn btn-primary"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map(product => (
              <motion.div 
                key={product.id} 
                variants={cardVariants}
                className="relative group overflow-hidden rounded-2xl bg-white dark:bg-surface-800 shadow-card dark:shadow-none hover:shadow-lg dark:hover:shadow-none transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={product.image}
                    alt={product.name} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <button 
                    onClick={() => addToCart(product)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-primary text-white opacity-0 group-hover:opacity-100 hover:bg-primary-dark transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                    aria-label="Add to cart"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center text-sm text-surface-500 mb-2">
                        <TagIcon className="w-4 h-4 mr-1" />
                        <span>{product.category}</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary-dark">${product.price.toFixed(2)}</div>
                  </div>
                  
                  <p className="text-surface-600 dark:text-surface-400 text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => showProductDetails(product)}
                      className="text-primary font-medium text-sm flex items-center hover:underline"
                    >
                      View Details
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </button>
                    
                    <button
                      onClick={() => addToCart(product)}
                      className="btn btn-primary py-1.5 flex items-center gap-1"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Shopping Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setCartOpen(false)}
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
                onClick={() => setCartOpen(false)}
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
                  onClick={() => setCartOpen(false)}
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
      )}
      
      {/* Product Detail Modal */}
      {visibleProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setVisibleProduct(null)}
          ></div>
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white dark:bg-surface-800 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-xl"
          >
            <button 
              onClick={() => setVisibleProduct(null)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 dark:bg-surface-800/80 hover:bg-white dark:hover:bg-surface-700 transition-colors"
              aria-label="Close modal"
            >
              <XIcon className="w-5 h-5" />
            </button>
            
            <div className="w-full md:w-1/2">
              <div className="aspect-square">
                <img 
                  src={visibleProduct.image} 
                  alt={visibleProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 p-6 overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold">{visibleProduct.name}</h3>
                <div className="text-xl font-bold text-primary-dark">
                  ${visibleProduct.price.toFixed(2)}
                </div>
              </div>
              
              <div className="flex items-center text-sm text-surface-500 dark:text-surface-400 mb-6">
                <TagIcon className="w-4 h-4 mr-1" />
                <span>{visibleProduct.category}</span>
              </div>
              
              <p className="text-surface-600 dark:text-surface-300 mb-6">
                {visibleProduct.description}
              </p>
              
              <div className="flex flex-wrap gap-4 items-center mb-8">
                <button
                  onClick={() => {
                    addToCart(visibleProduct);
                    setVisibleProduct(null);
                  }}
                  className="btn btn-primary py-3 px-6 flex items-center gap-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  className="btn btn-outline py-3 px-6 flex items-center gap-2"
                >
                  <HeartIcon className="w-5 h-5" />
                  <span>Add to Wishlist</span>
                </button>
              </div>
              
              <div className="bg-surface-50 dark:bg-surface-700/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Product Details</h4>
                <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-300">
                  <li>Free shipping on orders over $50</li>
                  <li>30-day return policy</li>
                  <li>1-year warranty</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MainFeature;