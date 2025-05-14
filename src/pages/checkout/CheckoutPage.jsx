import { Link } from 'react-router-dom';
import CheckoutLayout from '../../components/checkout/CheckoutLayout';
import OrderSummary from '../../components/checkout/OrderSummary';
import getIcon from '../../utils/iconUtils';

const CheckoutPage = () => {
  const ArrowRightIcon = getIcon('ArrowRight');

  return (
    <CheckoutLayout activeStep={1} title="Shopping Cart">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <OrderSummary isEditable={true} />
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
            <Link to="/" className="btn btn-outline">
              Continue Shopping
            </Link>
            
            <Link 
              to="/checkout/shipping" 
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              Proceed to Shipping <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default CheckoutPage;