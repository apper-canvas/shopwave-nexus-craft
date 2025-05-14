import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutLayout from '../../components/checkout/CheckoutLayout';
import OrderSummary from '../../components/checkout/OrderSummary';
import { useCart } from '../../contexts/CartContext';
import getIcon from '../../utils/iconUtils';

const PaymentInfo = () => {
  const { savePaymentInfo, paymentInfo } = useCart();
  const navigate = useNavigate();
  const ArrowRightIcon = getIcon('ArrowRight');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const CreditCardIcon = getIcon('CreditCard');
  const LockIcon = getIcon('Lock');

  // Initialize form with existing payment info if available
  const [formData, setFormData] = useState({
    cardholderName: paymentInfo?.cardholderName || '',
    cardNumber: paymentInfo?.cardNumber || '',
    expiryMonth: paymentInfo?.expiryMonth || '',
    expiryYear: paymentInfo?.expiryYear || '',
    cvv: paymentInfo?.cvv || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number as user types (add spaces every 4 digits)
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const formatted = cleaned.length > 0 
        ? cleaned.match(/.{1,4}/g).join(' ') 
        : '';
      setFormData(prev => ({ ...prev, [name]: formatted.slice(0, 19) })); // limit to 16 digits + 3 spaces
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of year
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else {
      const digits = formData.cardNumber.replace(/\s+/g, '');
      if (digits.length !== 16) newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    }
    
    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    } else if (Number(formData.expiryYear) < currentYear) {
      newErrors.expiryYear = 'Card has expired';
    } else if (Number(formData.expiryYear) === currentYear && Number(formData.expiryMonth) < currentMonth) {
      newErrors.expiryYear = 'Card has expired';
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save payment info
      savePaymentInfo(formData);
      toast.success("Payment information saved");
      navigate('/checkout/confirmation');
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  return (
    <CheckoutLayout activeStep={3} title="Payment Information">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800 rounded-lg shadow-card p-6">
            <div className="flex items-center gap-2 mb-6 p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
              <LockIcon className="w-5 h-5 text-green-500" />
              <span className="text-sm">Your payment information is secure and encrypted</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="cardholderName" className="block text-sm font-medium mb-1">Cardholder Name</label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  placeholder="As it appears on your card"
                  className={`input ${errors.cardholderName ? 'border-red-500' : ''}`}
                />
                {errors.cardholderName && <p className="mt-1 text-sm text-red-500">{errors.cardholderName}</p>}
              </div>
              
              <div className="md:col-span-2 relative">
                <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="0000 0000 0000 0000"
                    className={`input pl-11 ${errors.cardNumber ? 'border-red-500' : ''}`}
                    maxLength="19" // 16 digits + 3 spaces
                  />
                  <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                </div>
                {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
              </div>
              
              <div>
                <label htmlFor="expiryMonth" className="block text-sm font-medium mb-1">Expiry Month</label>
                <select
                  id="expiryMonth"
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleChange}
                  className={`input ${errors.expiryMonth ? 'border-red-500' : ''}`}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    return <option key={month} value={month}>{month.toString().padStart(2, '0')}</option>;
                  })}
                </select>
                {errors.expiryMonth && <p className="mt-1 text-sm text-red-500">{errors.expiryMonth}</p>}
              </div>
              
              <div>
                <label htmlFor="expiryYear" className="block text-sm font-medium mb-1">Expiry Year</label>
                <select
                  id="expiryYear"
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleChange}
                  className={`input ${errors.expiryYear ? 'border-red-500' : ''}`}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() % 100 + i; // Last 2 digits of current year + offset
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
                {errors.expiryYear && <p className="mt-1 text-sm text-red-500">{errors.expiryYear}</p>}
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="000"
                  maxLength="3"
                  className={`input w-24 ${errors.cvv ? 'border-red-500' : ''}`}
                />
                {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
              <button
                type="button"
                onClick={() => navigate('/checkout/shipping')}
                className="btn btn-outline flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="w-5 h-5" /> Back to Shipping
              </button>
              
              <button
                type="submit"
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                Complete Order <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default PaymentInfo;