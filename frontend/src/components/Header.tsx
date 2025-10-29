import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div className="flex items-center justify-between h-16" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center" style={{ width: '2rem', height: '2rem', backgroundColor: 'black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="text-white font-bold text-sm" style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>hd</span>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>highway delite</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Search experiences"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-64 text-sm"
              style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', width: '16rem', fontSize: '0.875rem' }}
            />
            <button 
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm" 
              style={{ backgroundColor: '#facc15', color: 'black', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
