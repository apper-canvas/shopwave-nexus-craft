import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  // Icons declaration
  const ShieldIcon = getIcon('ShieldCheck');
  const TruckIcon = getIcon('Truck');
  const CreditCardIcon = getIcon('CreditCard');
  const HeadphonesIcon = getIcon('Headphones');

  // Feature card animation variants
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-surface-800 to-primary-dark text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Shop with Confidence on <span className="text-accent">ShopWave</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-surface-200 mb-8"
            >
              Browse our curated collection of products, add them to your cart, and enjoy a seamless checkout experience.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Product Shop */}
      <MainFeature />

      {/* Features Section */}
      <div className="bg-white dark:bg-surface-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Shop With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <TruckIcon className="w-10 h-10 text-primary" />,
                title: "Free Shipping",
                description: "Free shipping on all orders over $50. Fast delivery to your doorstep."
              },
              {
                icon: <ShieldIcon className="w-10 h-10 text-primary" />,
                title: "Secure Payments",
                description: "All transactions are secure and encrypted for your peace of mind."
              },
              {
                icon: <CreditCardIcon className="w-10 h-10 text-primary" />,
                title: "Easy Returns",
                description: "30-day hassle-free return policy on all purchased items."
              },
              {
                icon: <HeadphonesIcon className="w-10 h-10 text-primary" />,
                title: "24/7 Support",
                description: "Our customer service team is available around the clock to help."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6 flex flex-col items-center text-center group hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-surface-600 dark:text-surface-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-surface-50 dark:bg-surface-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Subscribe to get updates on our latest products and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input flex-1"
              />
              <button className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;