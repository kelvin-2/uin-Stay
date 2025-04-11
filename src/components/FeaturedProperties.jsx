import React from "react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Wallet, Home, DollarSign, Heart, Clock, Shield, Wifi } from 'lucide-react';
import supabase from '../supabaseClient';

function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('accommodation')
          .select('*')
          .limit(4);             // Limit to 4 properties
          
        if (error) throw error;
        setProperties(data || []);
      }
      catch(error) {
        console.error('Error fetching featured properties', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProperties();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <Link 
            to="/properties" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            View all properties
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
              <div className="h-52 bg-gray-200" />
              <div className="p-5 space-y-4">
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
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <Link 
            to="/properties" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            View all properties
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="p-8 text-center">
          <div className="bg-red-50 p-6 rounded-2xl inline-block shadow-sm">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
        <Link 
          to="/properties" 
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          View all properties
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((accommodation) => (
            <Link 
              to={`/property/${accommodation.acc_id}`}
              key={accommodation.acc_id} 
              className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 relative group transform hover:-translate-y-1 cursor-pointer"
            >
              {/* Favorite Button */}
              <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 ">
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
              </button>

              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={accommodation.image_url || '/images/placeholder.jpg'}
                  alt={accommodation.name || 'Property'}
                  className="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    {accommodation.room_type || 'Accommodation'}
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-5 cursor-pointer">
                {/* Price and Features */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold text-gray-900">
                      R{accommodation.price ? accommodation.price.toLocaleString() : 'N/A'}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <div className="flex gap-2">
                    <Wifi className="w-4 h-4 text-blue-500" title="WiFi Available" />
                    <Shield className="w-4 h-4 text-blue-500" title="24/7 Security" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {accommodation.name || 'Property'}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm line-clamp-1">{accommodation.address || 'Location not specified'}</span>
                </div>

                {/* Walking Time */}
                <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {accommodation.distance_from_varsity 
                      ? `${Math.round(accommodation.distance_from_varsity * 10)} min walk to campus`
                      : 'Distance not specified'}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-4" />

                {/* Payment Methods */}
                {accommodation.paymentMethods && (
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full">
                      <Wallet className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-700 font-medium">{accommodation.paymentMethods}</span>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No featured properties available at the moment.
        </div>
      )}
    </div>
  );
}

export default FeaturedProperties;