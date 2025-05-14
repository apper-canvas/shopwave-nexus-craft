import { Link } from 'react-router-dom';
import getIcon from '../../utils/iconUtils';

// This component provides a consistent layout for all checkout pages
const CheckoutLayout = ({ children, activeStep = 1, title }) => {
  const steps = [
    { id: 1, name: 'Shopping Cart', path: '/checkout' },
    { id: 2, name: 'Shipping', path: '/checkout/shipping' },
    { id: 3, name: 'Payment', path: '/checkout/payment' },
    { id: 4, name: 'Confirmation', path: '/checkout/confirmation' }
  ];

  const HomeIcon = getIcon('Home');
  const CheckIcon = getIcon('Check');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center text-sm">
          <li className="flex items-center">
            <Link to="/" className="text-primary flex items-center hover:underline">
              <HomeIcon className="w-4 h-4 mr-1" />
              Home
            </Link>
          </li>
          <li className="mx-2 text-surface-400">/</li>
          <li className="text-surface-700 dark:text-surface-300">Checkout</li>
        </ol>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">{title || 'Checkout'}</h1>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step indicator */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step.id < activeStep ? 'bg-green-500 text-white' : 
                step.id === activeStep ? 'bg-primary text-white' : 
                'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
              }`}>
                {step.id < activeStep ? <CheckIcon className="w-5 h-5" /> : step.id}
              </div>
              
              {/* Step name */}
              <span className={`hidden sm:inline-block ml-2 ${step.id === activeStep ? 'font-medium' : 'text-surface-500'}`}>{step.name}</span>
              
              {/* Connector line (except after last step) */}
              {index < steps.length - 1 && <div className="w-10 sm:w-20 h-1 mx-1 sm:mx-2 bg-surface-200 dark:bg-surface-700"></div>}
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
};

export default CheckoutLayout;