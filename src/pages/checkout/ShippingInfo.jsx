import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutLayout from '../../components/checkout/CheckoutLayout';
import OrderSummary from '../../components/checkout/OrderSummary';
import { useCart } from '../../contexts/CartContext';
import getIcon from '../../utils/iconUtils';

const ShippingInfo = () => {
  const { saveShippingInfo, shippingInfo } = useCart();
  const navigate = useNavigate();
  const ArrowRightIcon = getIcon('ArrowRight');
  const ArrowLeftIcon = getIcon('ArrowLeft');

  // Initialize form with existing shipping info if available
  const [formData, setFormData] = useState({
    fullName: shippingInfo?.fullName || '',
    email: shippingInfo?.email || '',
    phone: shippingInfo?.phone || '',
    address: shippingInfo?.address || '',
    city: shippingInfo?.city || '',
    state: shippingInfo?.state || '',
    zipCode: shippingInfo?.zipCode || '',
    country: shippingInfo?.country || 'United States'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save shipping info
      saveShippingInfo(formData);
      toast.success("Shipping information saved");
      navigate('/checkout/payment');
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  return (
    <CheckoutLayout activeStep={2} title="Shipping Information">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800 rounded-lg shadow-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`input ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`input ${errors.address ? 'border-red-500' : ''}`}
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`input ${errors.city ? 'border-red-500' : ''}`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-1">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`input ${errors.state ? 'border-red-500' : ''}`}
                />
                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
              </div>
              
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={`input ${errors.zipCode ? 'border-red-500' : ''}`}
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="btn btn-outline flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="w-5 h-5" /> Back to Cart
              </button>
              
              <button
                type="submit"
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                Continue to Payment <ArrowRightIcon className="w-5 h-5" />
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

export default ShippingInfo;