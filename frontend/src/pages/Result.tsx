import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface BookingResult {
  refId: string;
  total: number;
  experience: string;
  date: string;
  time: string;
  qty: number;
}

const Result: React.FC = () => {
  const navigate = useNavigate();
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedResult = localStorage.getItem('bookingResult');
    if (!storedResult) {
      navigate('/');
      return;
    }
    
    try {
      setBookingResult(JSON.parse(storedResult));
    } catch (error) {
      console.error('Error parsing booking result:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleBackToHome = () => {
    localStorage.removeItem('bookingResult');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
        </div>
      </div>
    );
  }

  if (!bookingResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">No booking found</div>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Booking Confirmed
        </h1>

        {/* Reference ID */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-600 mb-1">Reference ID</p>
          <p className="text-lg font-mono font-semibold text-blue-800">
            {bookingResult.refId}
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Experience:</span>
              <span className="font-medium">{bookingResult.experience}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{bookingResult.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {new Date(`2000-01-01T${bookingResult.time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-medium">{bookingResult.qty}</span>
            </div>
            <hr className="border-gray-300 my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Paid:</span>
              <span>₹{bookingResult.total}</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-green-800">
            🎉 Your booking has been successfully confirmed! You will receive a confirmation email shortly.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleBackToHome}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Back to Home
          </button>
          
          <p className="text-sm text-gray-500">
            Need help? Contact our support team with your reference ID.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Result;
