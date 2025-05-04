import React from "react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  MapPin, Wallet, Home, DollarSign, Heart, Clock, Shield, Wifi, 
  Star, Bath, BedDouble, ChevronLeft, ChevronRight, CreditCard, 
  GraduationCap, BadgeDollarSign, ImageOff 
} from 'lucide-react';
import supabase from '../supabaseClient';

function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  
  // Default placeholder - ensure this asset exists in your public directory
  const defaultPlaceholder = '/images/placeholder.jpg'; 
  
  // Built-in SVG fallback as base64 (guaranteed to work)
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTUwLjUgOTZDMTIzLjcgOTYgMTAyIDExNy43IDEwMiAxNDQuNUMxMDIgMTcxLjMgMTIzLjcgMTkzIDE1MC41IDE5M0MxNzcuMyAxOTMgMTk5IDE3MS4zIDE5OSAxNDQuNUMxOTkgMTE3LjcgMTc3LjMgOTYgMTUwLjUgOTZaTTE1MC41IDE4NC4zQzEyOC41IDE4NC4zIDExMC43IDE2Ni41IDExMC43IDE0NC41QzExMC43IDEyMi41IDEyOC41IDEwNC43IDE1MC41IDEwNC43QzE3Mi41IDEwNC43IDE5MC4zIDEyMi41IDE5MC4zIDE0NC41QzE5MC4zIDE2Ni41IDE3Mi41IDE4NC4zIDE1MC41IDE4NC4zWk0xNTYuMyAxNjcuNEgxNDQuOFYxNTMuMkgxMzAuNlYxNDEuN0gxNDQuOFYxMjcuNUgxNTYuM1YxNDEuN0gxNzAuNVYxNTMuMkgxNTYuM1YxNjcuNFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('accommodation')
          .select('*')
          .limit(4);
          
        if (error) throw error;
        
        // Initialize the current image index for each property
        const initialImageIndices = {};
        data.forEach(prop => {
          initialImageIndices[prop.acc_id] = 0;
        });
        setCurrentImageIndex(initialImageIndices);
        
        // Process property data and validate image URLs
        const processedData = data.map(prop => {
          // Process amenities
          let parsedAmenities = [];
          if (prop.amenities) {
            try {
              parsedAmenities = typeof prop.amenities === 'string' ? 
                JSON.parse(prop.amenities) : 
                prop.amenities;
            } catch (e) {
              parsedAmenities = typeof prop.amenities === 'string' ?
                prop.amenities.split(',').map(item => item.trim()) :
                [];
            }
          }
          
          // Process payment methods
          let parsedPaymentMethods = [];
          if (prop.payment_methods) {
            try {
              parsedPaymentMethods = typeof prop.payment_methods === 'string' ?
                JSON.parse(prop.payment_methods) :
                prop.payment_methods;
            } catch (e) {
              parsedPaymentMethods = typeof prop.payment_methods === 'string' ?
                prop.payment_methods.split(',').map(item => item.trim()) :
                [];
            }
          }
          
          // Process image URLs to handle arrays or strings
          let imageUrls = [];
          
          // Check if image_url is an array
          if (Array.isArray(prop.image_url)) {
            imageUrls = prop.image_url.map(url => validateImageUrl(url));
          }
          // Check if it's a string that might be JSON
          else if (typeof prop.image_url === 'string') {
            try {
              // Try to parse as JSON if it starts with [ or {
              if (prop.image_url.trim().startsWith('[') || prop.image_url.trim().startsWith('{')) {
                const parsedImages = JSON.parse(prop.image_url);
                imageUrls = Array.isArray(parsedImages) ? 
                  parsedImages.map(url => validateImageUrl(url)) : 
                  [validateImageUrl(prop.image_url)];
              } else {
                // Just a regular string URL
                imageUrls = [validateImageUrl(prop.image_url)];
              }
            } catch (e) {
              // If parsing fails, treat as a single URL
              imageUrls = [validateImageUrl(prop.image_url)];
            }
          }
          
          // Ensure we always have at least one image (even if it's the fallback)
          if (imageUrls.length === 0) {
            imageUrls = [defaultPlaceholder];
          }
          
          return {
            ...prop,
            parsedAmenities,
            parsedPaymentMethods,
            imageUrls
          };
        });
        
        setProperties(processedData || []);
      }
      catch(error) {
        console.error('Error fetching featured properties:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProperties();
  }, []);
  
  // Helper function to validate and format image URLs
  const validateImageUrl = (url) => {
    if (!url) return defaultPlaceholder;
    
    if (typeof url !== 'string') {
      console.warn(`Invalid image URL (not a string):`, url);
      return defaultPlaceholder;
    }
    
    // Check if image_url is a relative path that needs a prefix
    if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/')) {
      return `/${url}`;
    }
    
    return url;
  };
  
  const getPaymentMethodIcon = (method) => {
    if (!method) return <DollarSign className="w-3 h-3 text-gray-600" />;
    
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

  // Navigate through property images
  const navigateImages = (e, propertyId, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    setCurrentImageIndex(prev => {
      const property = properties.find(p => p.acc_id === propertyId);
      if (!property || !property.imageUrls || property.imageUrls.length <= 1) return prev;
      
      const currentIndex = prev[propertyId] || 0;
      const totalImages = property.imageUrls.length;
      
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % totalImages;
      } else {
        newIndex = (currentIndex - 1 + totalImages) % totalImages;
      }
      
      return {
        ...prev,
        [propertyId]: newIndex
      };
    });
  };

  // Function to handle image loading errors
  const handleImageError = (e, propertyId) => {
    console.log("Image failed to load, using fallback");
    e.target.onerror = null; // Prevent infinite loop
    
    // Try the default placeholder first
    e.target.src = defaultPlaceholder;
    
    // If the placeholder also fails, use the base64 fallback
    e.target.onerror = () => {
      console.log("Placeholder also failed, using base64 fallback");
      e.target.src = fallbackImage;
    };
    
    // Reset the current image index for this property
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: 0
    }));
    
    // Update the property's image URLs to just use the fallback
    setProperties(prev => 
      prev.map(prop => 
        prop.acc_id === propertyId 
          ? { ...prop, imageUrls: [fallbackImage] } 
          : prop
      )
    );
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
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
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
                    {accommodation.status === 'booked' ? 'Booked' : 'Available Now'}
                  </span>
                </div>

                {/* Favorite Button */}
                <button 
                  onClick={(e) => toggleFavorite(e, accommodation.acc_id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-300"
                >
                  <Heart 
                    className={`w-4 h-4 md:w-5 md:h-5 ${
                      favorites[accommodation.acc_id] ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`} 
                  />
                </button>

                {/* Image Container */}
                <div className="relative overflow-hidden">
                  {/* Images */}
                  <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                    {accommodation.imageUrls && accommodation.imageUrls.length > 0 ? (
                      <>
                        <img
                          src={accommodation.imageUrls[currentImageIndex[accommodation.acc_id] || 0]}
                          alt={`${accommodation.address || 'Property'}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => handleImageError(e, accommodation.acc_id)}
                        />
                        
                        {/* Image navigation buttons (only if multiple images) */}
                        {accommodation.imageUrls.length > 1 && (
                          <>
                            {/* Image counter */}
                            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                              {(currentImageIndex[accommodation.acc_id] || 0) + 1}/{accommodation.imageUrls.length}
                            </div>
                            
                            {/* Previous button */}
                            <button 
                              onClick={(e) => navigateImages(e, accommodation.acc_id, 'prev')}
                              className="absolute top-1/2 left-2 transform -translate-y-1/2 p-1 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4 text-white" />
                            </button>
                            
                            {/* Next button */}
                            <button 
                              onClick={(e) => navigateImages(e, accommodation.acc_id, 'next')}
                              className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                            >
                              <ChevronRight className="w-4 h-4 text-white" />
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center p-4">
                          <ImageOff className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No image available</p>
                        </div>
                      </div>
                    )}
                    
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
                  <div className="flex items-start gap-1.5 md:gap-2 text-gray-600 mb-3 md:mb-4">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm line-clamp-2">{accommodation.address || 'Address not specified'}</span>
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
                    {accommodation.parsedAmenities && accommodation.parsedAmenities.includes('Security') ? (
                      <div className="flex flex-col items-center p-1 md:p-2 bg-gray-50 rounded-lg">
                        <Shield className="w-4 h-4 md:w-5 md:h-5 text-gray-700 mb-0.5 md:mb-1" />
                        <span className="text-xs text-gray-700">Secure</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center p-1 md:p-2 bg-gray-50 rounded-lg">
                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-700 mb-0.5 md:mb-1" />
                        <span className="text-xs text-gray-700">24/7</span>
                      </div>
                    )}
                    {accommodation.parsedAmenities && accommodation.parsedAmenities.includes('Wi-Fi') ? (
                      <div className="flex flex-col items-center p-1 md:p-2 bg-gray-50 rounded-lg">
                        <Wifi className="w-4 h-4 md:w-5 md:h-5 text-gray-700 mb-0.5 md:mb-1" />
                        <span className="text-xs text-gray-700">WiFi</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center p-1 md:p-2 bg-gray-50 rounded-lg">
                        <Star className="w-4 h-4 md:w-5 md:h-5 text-gray-700 mb-0.5 md:mb-1" />
                        <span className="text-xs text-gray-700">Featured</span>
                      </div>
                    )}
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
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default FeaturedProperties;