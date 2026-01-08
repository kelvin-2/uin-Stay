import React, { useState } from 'react';
import { 
  MapPin, Wallet, Home, DollarSign, Heart, Clock, Shield, Wifi, 
  CreditCard, GraduationCap, BadgeDollarSign, ImageOff,
  ChevronLeft, ChevronRight, Trash2, Edit, MoreVertical, Check, X
} from 'lucide-react';

const PropertyCard = ({ property, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  
  // Built-in SVG fallback as base64 (guaranteed to work)
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTUwLjUgOTZDMTIzLjcgOTYgMTAyIDExNy43IDEwMiAxNDQuNUMxMDIgMTcxLjMgMTIzLjcgMTkzIDE1MC41IDE5M0MxNzcuMyAxOTMgMTk5IDE3MS4zIDE5OSAxNDQuNUMxOTkgMTE3LjcgMTc3LjMgOTYgMTUwLjUgOTZaTTE1MC41IDE4NC4zQzEyOC41IDE4NC4zIDExMC43IDE2Ni41IDExMC43IDE0NC41QzExMC43IDEyMi41IDEyOC41IDEwNC43IDE1MC41IDEwNC43QzE3Mi41IDEwNC43IDE5MC4zIDEyMi41IDE5MC4zIDE0NC41QzE5MC4zIDE2Ni41IDE3Mi41IDE4NC4zIDE1MC41IDE4NC4zWk0xNTYuMyAxNjcuNEgxNDQuOFYxNTMuMkgxMzAuNlYxNDEuN0gxNDQuOFYxMjcuNUgxNTYuM1YxNDEuN0gxNzAuNVYxNTMuMkgxNTYuM1YxNjcuNFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

  // Format the price with commas for thousands
  const formattedPrice = property.monthly_rent 
    ? `R${property.monthly_rent.toLocaleString()}`
    : 'Price not specified';

  // Process amenities
  let parsedAmenities = [];
  if (property.amenities) {
    try {
      parsedAmenities = typeof property.amenities === 'string' ? 
        JSON.parse(property.amenities) : 
        property.amenities;
    } catch (e) {
      parsedAmenities = typeof property.amenities === 'string' ?
        property.amenities.split(',').map(item => item.trim()) :
        [];
    }
  }
  
  // Process payment methods
  let parsedPaymentMethods = [];
  if (property.payment_methods) {
    try {
      parsedPaymentMethods = typeof property.payment_methods === 'string' ?
        JSON.parse(property.payment_methods) :
        property.payment_methods;
    } catch (e) {
      parsedPaymentMethods = typeof property.payment_methods === 'string' ?
        property.payment_methods.split(',').map(item => item.trim()) :
        [];
    }
  }
  
  // Process image URLs to handle arrays or strings
  let imageUrls = [];
  
  // Check if image_url is an array
  if (Array.isArray(property.image_url)) {
    imageUrls = property.image_url.map(url => validateImageUrl(url));
  }
  // Check if it's a string that might be JSON
  else if (typeof property.image_url === 'string') {
    try {
      // Try to parse as JSON if it starts with [ or {
      if (property.image_url.trim().startsWith('[') || property.image_url.trim().startsWith('{')) {
        const parsedImages = JSON.parse(property.image_url);
        imageUrls = Array.isArray(parsedImages) ? 
          parsedImages.map(url => validateImageUrl(url)) : 
          [validateImageUrl(property.image_url)];
      } else {
        // Just a regular string URL
        imageUrls = [validateImageUrl(property.image_url)];
      }
    } catch (e) {
      // If parsing fails, treat as a single URL
      imageUrls = [validateImageUrl(property.image_url)];
    }
  }
  
  // Ensure we always have at least one image (even if it's the fallback)
  if (imageUrls.length === 0) {
    imageUrls = [fallbackImage];
  }

  // Helper function to validate and format image URLs
  function validateImageUrl(url) {
    if (!url) return fallbackImage;
    
    if (typeof url !== 'string') {
      return fallbackImage;
    }
    
    // Check if image_url is a relative path that needs a prefix
    if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/')) {
      return `/${url}`;
    }
    
    return url;
  }

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

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    setShowMenu(false);
  };

  const confirmDelete = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    setLoadingAction('Deleting');
    try {
      await onDelete(property);
    } finally {
      setIsDeleting(false);
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setIsDeleting(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsLoading(true);
    setLoadingAction('Loading');
    onEdit(property);
    setShowMenu(false);
    // Reset loading after a short delay (the parent component will handle the actual loading state)
    setTimeout(() => {
      setIsLoading(false);
      setLoadingAction('');
    }, 300);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    if (!imageError) {
      setImageError(true);
    }
  };

  // Navigate through property images
  const navigateImages = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!imageUrls || imageUrls.length <= 1) return;
    
    const totalImages = imageUrls.length;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentImageIndex + 1) % totalImages;
    } else {
      newIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    }
    
    setCurrentImageIndex(newIndex);
    setImageError(false); // Reset error state when navigating
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Property Image or Placeholder */}
      <div className="relative overflow-hidden">
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {property.status === 'booked' ? 'Booked' : 'Available Now'}
          </span>
        </div>

        {/* Property Actions Menu */}
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={toggleMenu}
            className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-300"
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg z-20 w-36 py-1">
              <button 
                onClick={handleEditClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </button>
              <button 
                onClick={handleDeleteClick}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          {imageUrls && imageUrls.length > 0 ? (
            <>
              {imageError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-4">
                    <ImageOff className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Image unavailable</p>
                  </div>
                </div>
              ) : (
                <img
                  key={`${property.id || 'img'}-${currentImageIndex}`}
                  src={imageUrls[currentImageIndex]}
                  alt={`${property.address || 'Property'}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={handleImageError}
                />
              )}
              
              {/* Image navigation buttons (only if multiple images) */}
              {imageUrls.length > 1 && !imageError && (
                <>
                  {/* Image counter */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1}/{imageUrls.length}
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
          {!imageError && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>

        {/* Delete Confirmation */}
        {isDeleting && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 z-30">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-3"></div>
                <p className="text-white text-center">{loadingAction}...</p>
              </div>
            ) : (
              <>
                <p className="text-white text-center mb-4">Are you sure you want to delete this property?</p>
                <div className="flex space-x-3">
                  <button 
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                  >
                    <Check className="h-4 w-4 mr-1" /> Yes
                  </button>
                  <button 
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" /> No
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Loading Overlay for Edit */}
        {isLoading && !isDeleting && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 z-30">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-3"></div>
              <p className="text-white text-center">{loadingAction}...</p>
            </div>
          </div>
        )}
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
              {formattedPrice}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
          
          {/* Deposit Badge */}
          {property.deposit > 0 && (
            <div className="bg-amber-50 text-amber-700 text-s font-medium px-2 py-1 rounded-lg border border-amber-200">
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
          {parsedAmenities && parsedAmenities.includes('Security') ? (
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
          {parsedAmenities && parsedAmenities.includes('Wi-Fi') ? (
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
        {parsedPaymentMethods && parsedPaymentMethods.length > 0 && (
          <>
            {/* Payment Methods Header */}
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Options</span>
            </div>

            {/* Payment Methods List */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {parsedPaymentMethods.slice(0, 3).map((method, index) => (
                <div key={`payment-${index}`} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                  {getPaymentMethodIcon(method)}
                  <span className="text-xs text-gray-700">{method}</span>
                </div>
              ))}
              
              {/* Show additional payment methods count if more than 3 */}
              {parsedPaymentMethods.length > 3 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                  <span className="text-xs text-gray-700">+{parsedPaymentMethods.length - 3} more</span>
                </div>
              )}
            </div>
          </>
        )}

        {property.acc_details && (
          <div className="mb-3 text-xs text-gray-600 line-clamp-2">
            {property.acc_details}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-1">
          <button 
            onClick={handleEditClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            <Edit className="w-4 h-4 mr-1" /> Edit
          </button>
          <button 
            onClick={handleDeleteClick}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-sm py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;