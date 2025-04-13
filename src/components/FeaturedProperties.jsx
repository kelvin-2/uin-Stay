import React from "react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Wallet, Home, DollarSign, Heart, Clock, Shield, Wifi, Star, Bath, BedDouble, ChevronLeft, ChevronRight, CreditCard, GraduationCap, BadgeDollarSign } from 'lucide-react';
import supabase from '../supabaseClient';

function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('accommodation')
          .select('*')
          .limit(4);
          
        if (error) throw error;
        console.log(data);
        // Initialize the current image index for each property
        const initialImageIndices = {};
        data.forEach(prop => {
          initialImageIndices[prop.acc_id] = 0;
        });
        setCurrentImageIndex(initialImageIndices);
        
        // Process property data
        const processedData = data.map(prop => {
          // Parse amenities if it's a string
          let parsedAmenities = [];
          if (prop.amenities) {
            try {
              // Try to parse if it's a JSON string
              parsedAmenities = typeof prop.amenities === 'string' ? 
                JSON.parse(prop.amenities) : 
                prop.amenities;
            } catch (e) {
              // If it's not JSON, split by commas
              parsedAmenities = prop.amenities.split(',').map(item => item.trim());
            }
          }
          
          // Parse payment methods if available
          let parsedPaymentMethods = [];
          if (prop.payment_methods) {
            try {
              parsedPaymentMethods = typeof prop.payment_methods === 'string' ?
                JSON.parse(prop.payment_methods) :
                prop.payment_methods;
            } catch (e) {
              parsedPaymentMethods = prop.payment_methods.split(',').map(item => item.trim());
            }
          }
          
          return {
            ...prop,
            parsedAmenities,
            parsedPaymentMethods,
            // If there's no image_url, use a placeholder
            image_url: prop.image_url || '/images/placeholder.jpg'
          };
        });
        
        setProperties(processedData || []);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-md">
              <div className="h-48 sm:h-56 md:h-64 bg-gray-200" />
              <div className="p-4 md:p-5 space-y-4">
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
          <div className="bg-red-50 p-6 rounded-2xl inline-block shadow-sm">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-0">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Properties</h2>
        <Link 
          to="/properties" 
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-all duration-300 hover:gap-3"
        >
          <span className="hidden sm:inline">View all properties</span>
          <span className="sm:hidden">View all</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {properties.map((accommodation) => (
            <div key={accommodation.acc_id} className="group relative">
              <Link 
                to={`/property/${accommodation.acc_id}`}
                className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative transform hover:-translate-y-1"
              >
                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg">
                    Available Now
                  </span>
                </div>

                {/* Image Container */}
                <div className="relative overflow-hidden">
                  {/* Images */}
                  <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={accommodation.image_url}
                      alt={`${accommodation.address || 'Property'}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-4 md:p-6">
                  {/* Title/Location */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {accommodation.location || 'Student Accommodation'}
                  </h3>

                  {/* Address */}
                  <div className="flex items-center gap-1.5 md:gap-2 text-gray-600 mb-3 md:mb-4">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="text-xs md:text-sm line-clamp-1">{accommodation.address || 'Address not specified'}</span>
                  </div>

                  {/* Price with Deposit Badge */}
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="text-base md:text-lg font-bold text-gray-900">
                          R{accommodation.monthly_rent ? accommodation.monthly_rent.toLocaleString() : 'N/A'}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 ml-1">/month</span>
                      </div>
                    </div>
                    
                    {/* Deposit Badge */}
                    {accommodation.deposit > 0 && (
                      <div className="bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-lg border border-amber-200">
                        R{accommodation.deposit.toLocaleString()} deposit
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-1 md:gap-2 mb-3 md:mb-4">
                    <div className="flex flex-col items-center p-1 md:p-2 bg-gray-50 rounded-lg">
                      <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-700 mb-0.5 md:mb-1" />
                      <span className="text-xs text-gray-700">{accommodation.room_type || 'Room'}</span>
                    </div>
                    <div className="flex flex-col items-center p-1 md:p-2 bg-gray-50 rounded-lg">
                      <Shield className="w-4 h-4 md:w-5 md:h-5 text-gray-700 mb-0.5 md:mb-1" />
                      <span className="text-xs text-gray-700">Secure</span>
                    </div>
                    <div className="flex flex-col items-center p-1 md:p-2 bg-gray-50 rounded-lg">
                      <Wifi className="w-4 h-4 md:w-5 md:h-5 text-gray-700 mb-0.5 md:mb-1" />
                      <span className="text-xs text-gray-700">WiFi</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  {accommodation.parsedPaymentMethods && accommodation.parsedPaymentMethods.length > 0 && (
                    <>
                      {/* Payment Methods Header */}
                      <div className="mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Options</span>
                      </div>

                      {/* Payment Methods List */}
                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                        {accommodation.parsedPaymentMethods.slice(0, 3).map((method, index) => (
                          <div key={`payment-${index}`} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                            {getPaymentMethodIcon(method)}
                            <span className="text-xs text-gray-700">{method}</span>
                          </div>
                        ))}
                        
                        {/* Show additional payment methods count if more than 3 */}
                        {accommodation.parsedPaymentMethods.length > 3 && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                            <span className="text-xs text-gray-700">+{accommodation.parsedPaymentMethods.length - 3} more</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* CTA Button */}
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm md:text-base py-2 md:py-3 rounded-xl transition-colors duration-300 mt-1 md:mt-2">
                    View Details
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 md:py-12 rounded-2xl bg-gray-50 shadow-sm">
          <Home className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
          <h3 className="text-base md:text-lg font-medium text-gray-700 mb-1 md:mb-2">No Properties Available</h3>
          <p className="text-sm md:text-base text-gray-500">We don't have any featured properties at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default FeaturedProperties;