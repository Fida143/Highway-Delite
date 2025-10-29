import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface BookingData {
  experienceId: string;
  experience: {
    title: string;
    price: number;
  };
  date: string;
  time: string;
  quantity: number;
  price: number;
}

interface PromoCode {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('bookingData');
    if (!storedData) {
      navigate('/');
      return;
    }
    setBookingData(JSON.parse(storedData));
  }, [navigate]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!agreedToTerms) {
      errors.terms = 'You must agree to the terms and safety policy';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePromoApply = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setPromoLoading(true);
    setPromoError('');

    try {
      const response = await api.post('/promo/validate', { code: promoCode });
      
      if (response.data.valid) {
        setAppliedPromo(response.data.promo);
        setPromoError('');
      } else {
        setPromoError(response.data.message || 'Invalid promo code');
        setAppliedPromo(null);
      }
    } catch (error: any) {
      setPromoError(error.response?.data?.message || 'Failed to validate promo code');
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!bookingData) return { subtotal: 0, taxes: 0, total: 0 };

    const subtotal = bookingData.price * bookingData.quantity;
    const taxes = Math.round(subtotal * 0.06);
    let total = subtotal + taxes;

    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        const discount = Math.round(subtotal * (appliedPromo.value / 100));
        total = Math.max(0, total - discount);
      } else {
        total = Math.max(0, total - appliedPromo.value);
      }
    }

    return { subtotal, taxes, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !bookingData) return;

    setIsSubmitting(true);

    try {
      const bookingPayload = {
        experienceId: bookingData.experienceId,
        date: bookingData.date,
        time: bookingData.time,
        qty: bookingData.quantity,
        name: formData.name,
        email: formData.email,
        promo: appliedPromo
      };

      const response = await api.post('/bookings', bookingPayload);
      
      if (response.data.success) {
        // Store booking result for result page
        localStorage.setItem('bookingResult', JSON.stringify(response.data.booking));
        localStorage.removeItem('bookingData');
        navigate('/result');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">No booking data found</div>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { subtotal, taxes, total } = calculateTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-gray-600 hover:text-gray-800 mb-6 flex items-center"
      >
        <span className="mr-2">←</span> Checkout
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`input-field ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promo code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={handlePromoApply}
                  disabled={promoLoading}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {promoLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {promoError && (
                <p className="text-red-500 text-sm mt-1">{promoError}</p>
              )}
              {appliedPromo && (
                <p className="text-green-600 text-sm mt-1">
                  ✅ Promo code applied! {appliedPromo.type === 'percentage' 
                    ? `${appliedPromo.value}% off` 
                    : `₹${appliedPromo.value} off`}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the terms and safety policy
              </label>
            </div>
            {formErrors.terms && (
              <p className="text-red-500 text-sm">{formErrors.terms}</p>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Experience:</span>
              <span className="font-medium">{bookingData.experience.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{bookingData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {new Date(`2000-01-01T${bookingData.time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Qty:</span>
              <span className="font-medium">{bookingData.quantity}</span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes:</span>
              <span className="font-medium">₹{taxes}</span>
            </div>
            {appliedPromo && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedPromo.code}):</span>
                <span>-₹{appliedPromo.type === 'percentage' 
                  ? Math.round(subtotal * (appliedPromo.value / 100))
                  : appliedPromo.value}</span>
              </div>
            )}
          </div>

          <hr className="border-gray-300 mb-4" />

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Pay and Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
