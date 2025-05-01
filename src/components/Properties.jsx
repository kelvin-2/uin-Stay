import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Wallet, Home, DollarSign, Shield, Wifi, CreditCard, GraduationCap, BadgeDollarSign } from 'lucide-react';
import supabase from '../supabaseClient'; 

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('accommodation')
          .select('*');
          
        if (error) throw error;
        setProperties(data || []);
      }
      catch(error) {
        console.error('Error fetching properties', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  const getPaymentMethodIcon = (method) => {
    const methodLower = method.toLowerCase();
    if (methodLower.includes('cash')) return <Wallet className="w-3 h-3 text-gray-600" />;
    if (methodLower.includes('card') || methodLower.includes('credit') || methodLower.includes('debit')) 
      return <CreditCard className="w-3 h-3 text-gray-600" />;
    if (methodLower.includes('bursary')) 
      return <GraduationCap className="w-3 h-3 text-gray-600" />;
    if (methodLower.includes('nsfas')) 
      return <BadgeDollarSign className="w-3 h-3 text-gray-600" />;
    return <DollarSign className="w-3 h-3 text-gray-600" />;
  };

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="w-full px-4 md:px-0">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Properties</h2>
          <Link 
            to="/properties" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden animate-pulse shadow-md">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded-full w-3/4" />
                <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                <div className="h-4 bg-gray-200 rounded-full w-full" />
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded-full w-1/3" />
                  <div className="h-8 bg-gray-200 rounded-full w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 md:px-0">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Properties</h2>
          <Link 
            to="/properties" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="p-4 md:p-8 text-center">
          <div className="bg-red-50 p-6 rounded-lg inline-block shadow-sm">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
        <Link 
          to="/properties" 
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          View all
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((accommodation) => (
            <div key={accommodation.acc_id} className="bg-white rounded-lg overflow-hidden shadow-md">
              {/* Status Badge */}
              <div className="relative">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Available Now
                  </span>
                </div>

                {/* Property Image */}
                <img
                  src={accommodation.image_url || '/placeholder.jpg'}
                  alt={accommodation.location || 'Property'}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {accommodation.location || 'Town'}
                </h3>

                {/* Address */}
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{accommodation.address || 'Address not specified'}</span>
                </div>

                {/* Price with Deposit Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      R{accommodation.monthly_rent ? accommodation.monthly_rent.toLocaleString() : '2,500'}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  
                  {/* Deposit Badge */}
                  {accommodation.deposit > 0 && (
                    <div className="bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-lg border border-amber-200">
                      R{accommodation.deposit.toLocaleString()} deposit
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <Home className="w-5 h-5 text-gray-700 mb-1" />
                    <span className="text-xs text-gray-700">{accommodation.room_type || 'Studio'}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-gray-700 mb-1" />
                    <span className="text-xs text-gray-700">Secure</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <Wifi className="w-5 h-5 text-gray-700 mb-1" />
                    <span className="text-xs text-gray-700">WiFi</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link 
                  to={`/property/${accommodation.acc_id}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-center py-2 rounded-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-lg bg-gray-50 shadow-sm">
          <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Properties Available</h3>
          <p className="text-gray-500">We don't have any featured properties at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Properties;