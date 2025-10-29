import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

interface Experience {
  _id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  image: string;
}

const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <img
        src={experience.image}
        alt={experience.title}
        className="w-full h-48 object-cover"
        style={{ width: '100%', height: '12rem', objectFit: 'cover' }}
      />
      <div className="p-4" style={{ padding: '1rem' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
          {experience.title}
        </h3>
        <div className="flex items-center justify-between mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full" style={{ fontSize: '0.875rem', backgroundColor: '#f3f4f6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
            {experience.location}
          </span>
          <span className="text-lg font-bold text-gray-900" style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>
            From ₹{experience.price}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed" style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem', lineHeight: '1.625' }}>
          {experience.description}
        </p>
        <Link
          to={`/details/${experience._id}`}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-center block"
          style={{ width: '100%', backgroundColor: '#facc15', color: 'black', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '0.5rem', textAlign: 'center', display: 'block', textDecoration: 'none' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="flex justify-between mb-3">
          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Dummy data to show proper UI
  const dummyExperiences: Experience[] = [
    {
      _id: '1',
      title: 'Kayaking',
      price: 999,
      location: 'Udupi',
      description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop'
    },
    {
      _id: '2',
      title: 'Nandi Hills Sunrise',
      price: 899,
      location: 'Bangalore',
      description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
    },
    {
      _id: '3',
      title: 'Coffee Trail',
      price: 1299,
      location: 'Coorg',
      description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop'
    },
    {
      _id: '4',
      title: 'Boat Cruise',
      price: 1599,
      location: 'Sunderban',
      description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop'
    },
    {
      _id: '5',
      title: 'Bunjee Jumping',
      price: 2499,
      location: 'Manali',
      description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop'
    },
    {
      _id: '6',
      title: 'Trekking Adventure',
      price: 1899,
      location: 'Himachal Pradesh',
      description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&h=300&fit=crop'
    },
    {
      _id: '7',
      title: 'Wildlife Safari',
      price: 2199,
      location: 'Ranthambore',
      description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
      image: 'https://images.unsplash.com/photo-1544966503-7cc4ac81b4a4?w=500&h=300&fit=crop'
    },
    {
      _id: '8',
      title: 'Desert Camping',
      price: 1799,
      location: 'Rajasthan',
      description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&h=300&fit=crop'
    }
  ];

  // Filter experiences based on search query
  const filteredExperiences = experiences.filter(experience => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      experience.title.toLowerCase().includes(query) ||
      experience.location.toLowerCase().includes(query) ||
      experience.description.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await api.get('/experiences');
        setExperiences(response.data);
      } catch (err: any) {
        // If backend is not available, use dummy data
        console.log('Backend not available, using dummy data');
        setExperiences(dummyExperiences);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <div className="mb-8" style={{ marginBottom: '2rem' }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Amazing Experiences'}
          </h1>
          <p className="text-gray-600" style={{ color: '#4b5563' }}>
            {searchQuery ? `Found ${filteredExperiences.length} experience${filteredExperiences.length !== 1 ? 's' : ''}` : 'Book curated travel experiences with certified guides and safety-first approach'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredExperiences.map((experience) => (
              <ExperienceCard key={experience._id} experience={experience} />
            ))}
          </div>
        )}

        {!loading && filteredExperiences.length === 0 && (
          <div className="text-center py-12" style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="text-gray-500 text-lg" style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              {searchQuery ? `No experiences found for "${searchQuery}"` : 'No experiences available'}
            </div>
            {searchQuery && (
              <button
                onClick={() => window.location.href = '/'}
                className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#facc15', color: 'black', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
              >
                View All Experiences
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
