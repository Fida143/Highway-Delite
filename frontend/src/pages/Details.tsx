import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Slot {
  date: string;
  time: string;
  capacity: number;
}

interface Experience {
  _id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  image: string;
  slots: Slot[];
}

const SlotPicker: React.FC<{
  slots: Slot[];
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
}> = ({ slots, selectedDate, selectedTime, onDateSelect, onTimeSelect }) => {
  // Get unique dates
  const dates = [...new Set(slots.map(slot => slot.date))].sort();
  
  // Get slots for selected date
  const timeSlots = slots
    .filter(slot => slot.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose date</h3>
        <div className="flex flex-wrap gap-2">
          {dates.map((date) => {
            const dateObj = new Date(date);
            const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
            const day = dateObj.getDate();
            
            return (
              <button
                key={date}
                onClick={() => onDateSelect(date)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedDate === date
                    ? 'bg-primary-400 text-black border-primary-400'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                }`}
              >
                {month} {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose time</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {timeSlots.map((slot) => {
            const isAvailable = slot.capacity > 0;
            const isSelected = selectedTime === slot.time;
            
            return (
              <button
                key={slot.time}
                onClick={() => isAvailable ? onTimeSelect(slot.time) : null}
                disabled={!isAvailable}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  !isAvailable
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : isSelected
                    ? 'bg-primary-400 text-black border-primary-400'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                }`}
              >
                <div className="font-medium">
                  {new Date(`2000-01-01T${slot.time}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
                <div className="text-xs">
                  {isAvailable ? `${slot.capacity} left` : 'Sold out'}
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          All times are in IST (GMT +5:30)
        </p>
      </div>
    </div>
  );
};

const PriceSummary: React.FC<{
  experience: Experience;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onConfirm: () => void;
}> = ({ experience, quantity, onQuantityChange, onConfirm }) => {
  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Starts at</span>
          <span className="font-semibold">₹{experience.price}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Quantity</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              -
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">₹{subtotal}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Taxes</span>
          <span className="font-semibold">₹{taxes}</span>
        </div>
        
        <hr className="border-gray-300" />
        
        <div className="flex justify-between text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-bold">₹{total}</span>
        </div>
      </div>
      
      <button
        onClick={onConfirm}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        Confirm
      </button>
    </div>
  );
};

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
  const fetchExperience = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/experiences/${id}`);
      const exp = response.data;
      setExperience(exp);
      
      // Set default date to first available date
      if (exp.slots && exp.slots.length > 0) {
        const dates = [...new Set<string>(exp.slots.map((slot: Slot) => slot.date))].sort();
        setSelectedDate(dates[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch experience details');
      console.error('Error fetching experience:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchExperience();
}, [id]);


  const handleConfirm = () => {
    if (!experience || !selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }

    // Store booking data in localStorage for checkout
    const bookingData = {
      experienceId: experience._id,
      experience: experience,
      date: selectedDate,
      time: selectedTime,
      quantity,
      price: experience.price
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="h-80 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️ {error || 'Experience not found'}</div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-gray-600 hover:text-gray-800 mb-6 flex items-center"
      >
        <span className="mr-2">←</span> Details
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {experience.title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {experience.description}
          </p>

          <SlotPicker
            slots={experience.slots}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
          />

          {/* About Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-600">
              Scenic routes, trained guides, and safety briefing. Minimum age 10.
            </p>
          </div>
        </div>

        {/* Price Summary Sidebar */}
        <div className="lg:col-span-1">
          <PriceSummary
            experience={experience}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default Details;
