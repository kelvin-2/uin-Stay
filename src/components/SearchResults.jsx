import React from "react";
import { 
  MapPin, Wallet, Home, DollarSign, Heart, Clock, Shield, Wifi, 
  CreditCard, GraduationCap, BadgeDollarSign, ImageOff,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// Default placeholder - ensure this asset exists in your public directory
const defaultPlaceholder = '/images/placeholder.jpg'; 

// Built-in SVG fallback as base64 (guaranteed to work)
const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTUwLjUgOTZDMTIzLjcgOTYgMTAyIDExNy43IDEwMiAxNDQuNUMxMDIgMTcxLjMgMTIzLjcgMTkzIDE1MC41IDE5M0MxNzcuMyAxOTMgMTk5IDE3MS4zIDE5OSAxNDQuNUMxOTkgMTE3LjcgMTc3LjMgOTYgMTUwLjUgOTZaTTE1MC41IDE4NC4zQzEyOC41IDE4NC4zIDExMC43IDE2Ni41IDExMC43IDE0NC41QzExMC43IDEyMi41IDEyOC41IDEwNC43IDE1MC41IDEwNC43QzE3Mi41IDEwNC43IDE5MC4zIDEyMi41IDE5MC4zIDE0NC41QzE5MC4zIDE2Ni41IDE3Mi41IDE4NC4zIDE1MC41IDE4NC4zWk0xNTYuMyAxNjcuNEgxNDQuOFYxNTMuMkgxMzAuNlYxNDEuN0gxNDQuOFYxMjcuNUgxNTYuM1YxNDEuN0gxNzAuNVYxNTMuMkgxNTYuM1YxNjcuNFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

const SearchResults = ({ 
  property, 
  currentImageIndex = 0, 
  isFavorite = false, 
  onImageChange,
  onFavoriteToggle,
  onImageError 
}) => {
  // Function to handle image loading errors
  const handleImageError = (e) => {
    console.log("Image failed to load, using fallback");
    e.target.onerror = null; // Prevent infinite loop
    
    // Try the default placeholder first
    e.target.src = defaultPlaceholder;
    
    // If the placeholder also fails, use the base64 fallback
    e.target.onerror = () => {
      console.log("Placeholder also failed, using base64 fallback");
      e.target.src = fallbackImage;
    };
    
    // Call the parent component's error handler if provided
    if (onImageError) {
      onImageError(property.id);
    }
  };

  // Navigate through property images
  const navigateImages = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onImageChange) {
      onImageChange(property.id, direction);
    }
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onFavoriteToggle) {
      onFavoriteToggle(property.id);
    }
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
  
  return (
    <div className="group relative">
      <a 
        href={`/property/${property.id}`}
        className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative transform hover:-translate-y-1"
      >
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {property.status === 'booked' ? 'Booked' : 'Available Now'}
          </span>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-300"
        >
          <Heart 
            className={`w-4 h-4 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </button>

        {/* Image Container */}
        <div className="relative overflow-hidden">
          {/* Images */}
          <div className="relative w-full h-48 overflow-hidden">
            {property.imageUrls && property.imageUrls.length > 0 ? (
              <>
                <img
                  src={property.imageUrls[currentImageIndex] || property.imageUrls[0]}
                  alt={`${property.address || 'Property'}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={handleImageError}
                />
                
                {/* Image navigation buttons (only if multiple images) */}
                {property.imageUrls.length > 1 && (
                  <>
                    {/* Image counter */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {currentImageIndex + 1}/{property.imageUrls.length}
                    </div>
                    
                    {/* Previous button */}
                    <button 
                      onClick={(e) => navigateImages(e, 'prev')}
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 p-1 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    
                    {/* Next button */}
                    <button 
                      onClick={(e) => navigateImages(e, 'next')}
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

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.location || 'Town'}
          </h3>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-gray-600 mb-3">
            <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span className="text-xs line-clamp-2">{property.address || 'Address not specified'}</span>
          </div>

          {/* Price with Deposit Badge */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-bold text-gray-900">
                R{property.monthly_rent ? property.monthly_rent.toLocaleString() : '2,500'}
              </span>
              <span className="text-sm text-gray-500">/month</span>
            </div>
            
            {/* Deposit Badge */}
            {property.deposit > 0 && (
              <div className="bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-lg border border-amber-200">
                R{property.deposit.toLocaleString()} deposit
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <Home className="w-5 h-5 text-gray-700 mb-1" />
              <span className="text-xs text-gray-700">{property.room_type || 'Studio'}</span>
            </div>
            {property.parsedAmenities && property.parsedAmenities.includes('Security') ? (
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-700 mb-1" />
                <span className="text-xs text-gray-700">Secure</span>
              </div>
            ) : (
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-700 mb-1" />
                <span className="text-xs text-gray-700">24/7</span>
              </div>
            )}
            {property.parsedAmenities && property.parsedAmenities.includes('Wi-Fi') ? (
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Wifi className="w-5 h-5 text-gray-700 mb-1" />
                <span className="text-xs text-gray-700">WiFi</span>
              </div>
            ) : (
              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                <Wifi className="w-5 h-5 text-gray-700 mb-1" />
                <span className="text-xs text-gray-700">WiFi</span>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          {property.parsedPaymentMethods && property.parsedPaymentMethods.length > 0 && (
            <>
              {/* Payment Methods Header */}
              <div className="mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Options</span>
              </div>

              {/* Payment Methods List */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {property.parsedPaymentMethods.slice(0, 3).map((method, index) => (
                  <div key={`payment-${index}`} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                    {getPaymentMethodIcon(method)}
                    <span className="text-xs text-gray-700">{method}</span>
                  </div>
                ))}
                
                {/* Show additional payment methods count if more than 3 */}
                {property.parsedPaymentMethods.length > 3 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                    <span className="text-xs text-gray-700">+{property.parsedPaymentMethods.length - 3} more</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* CTA Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg transition-colors duration-300 mt-1">
            View Details
          </button>
        </div>
      </a>
    </div>
  );
};

export default SearchResults;