import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTUwLjUgOTZDMTIzLjcgOTYgMTAyIDExNy43IDEwMiAxNDQuNUMxMDIgMTcxLjMgMTIzLjcgMTkzIDE1MC41IDE5M0MxNzcuMyAxOTMgMTk5IDE3MS4zIDE5OSAxNDQuNUMxOTkgMTE3LjcgMTc3LjMgOTYgMTUwLjUgOTZaTTE1MC41IDE4NC4zQzEyOC41IDE4NC4zIDExMC43IDE2Ni41IDExMC43IDE0NC41QzExMC43IDEyMi41IDEyOC41IDEwNC43IDE1MC41IDEwNC43QzE3Mi41IDEwNC43IDE5MC4zIDEyMi41IDE5MC4zIDE0NC41QzE5MC4zIDE2Ni41IDE3Mi41IDE4NC4zIDE1MC41IDE4NC4zWk0xNTYuMyAxNjcuNEgxNDQuOFYxNTMuMkgxMzAuNlYxNDEuN0gxNDQuOFYxMjcuNUgxNTYuM1YxNDEuN0gxNzAuNVYxNTMuMkgxNTYuM1YxNjcuNFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

  const formattedPrice = property.monthly_rent 
    ? `R${property.monthly_rent.toLocaleString()}`
    : 'Price not specified';

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
  
  let imageUrls = [];
  if (Array.isArray(property.image_url)) {
    imageUrls = property.image_url.map(url => validateImageUrl(url));
  } else if (typeof property.image_url === 'string') {
    try {
      if (property.image_url.trim().startsWith('[') || property.image_url.trim().startsWith('{')) {
        const parsedImages = JSON.parse(property.image_url);
        imageUrls = Array.isArray(parsedImages) ? 
          parsedImages.map(url => validateImageUrl(url)) : 
          [validateImageUrl(property.image_url)];
      } else {
        imageUrls = [validateImageUrl(property.image_url)];
      }
    } catch (e) {
      imageUrls = [validateImageUrl(property.image_url)];
    }
  }
  
  if (imageUrls.length === 0) {
    imageUrls = [fallbackImage];
  }

  function validateImageUrl(url) {
    if (!url) return fallbackImage;
    if (typeof url !== 'string') return fallbackImage;
    if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/')) {
      return `/${url}`;
    }
    return url;
  }

  const getPaymentMethodIcon = (method) => {
    if (!method) return <DollarSign className="w-3.5 h-3.5 text-blue-600" />;
    const methodLower = method.toLowerCase();
    if (methodLower.includes('cash')) return <Wallet className="w-3.5 h-3.5 text-blue-600" />;
    if (methodLower.includes('card') || methodLower.includes('credit') || methodLower.includes('debit')) 
      return <CreditCard className="w-3.5 h-3.5 text-blue-600" />;
    if (methodLower.includes('bursary')) 
      return <GraduationCap className="w-3.5 h-3.5 text-blue-600" />;
    if (methodLower.includes('nsfas')) 
      return <BadgeDollarSign className="w-3.5 h-3.5 text-blue-600" />;
    return <DollarSign className="w-3.5 h-3.5 text-blue-600" />;
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    setShowMenu(false);
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
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
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(false);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    setLoadingAction('Loading');
    onEdit(property);
    setShowMenu(false);
    setTimeout(() => {
      setIsLoading(false);
      setLoadingAction('');
    }, 300);
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    if (!imageError) {
      setImageError(true);
    }
  };

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
    setImageError(false);
  };

  return (
    <Link 
      to={`/property/${property.acc_id}`}
      className="block"
    >
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
        {/* Property Image */}
        <div className="relative overflow-hidden">
          {/* Status Badge - More Premium Look */}
          <div className="absolute top-4 left-4 z-10">
            <div className={`${property.status === 'booked' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-green-500'} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5`}>
              <div className={`w-2 h-2 rounded-full ${property.status === 'booked' ? 'bg-amber-200' : 'bg-emerald-200'} animate-pulse`}></div>
              {property.status === 'booked' ? 'Booked' : 'Available'}
            </div>
          </div>

          {/* Property Actions Menu - Cleaner Design */}
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={toggleMenu}
              className="p-2.5 bg-white/95 hover:bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            >
              <MoreVertical className="h-4 w-4 text-gray-700" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl z-20 w-40 py-2 border border-gray-100">
                <button 
                  onClick={handleEditClick}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                >
                  <Edit className="h-4 w-4 text-blue-600" /> 
                  <span className="font-medium">Edit</span>
                </button>
                <button 
                  onClick={handleDeleteClick}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> 
                  <span className="font-medium">Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Images with Enhanced Presentation */}
          <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {imageUrls && imageUrls.length > 0 ? (
              <>
                {imageError ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-4">
                      <ImageOff className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 font-medium">Image unavailable</p>
                    </div>
                  </div>
                ) : (
                  <img
                    key={`${property.id || 'img'}-${currentImageIndex}`}
                    src={imageUrls[currentImageIndex]}
                    alt={`${property.address || 'Property'}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={handleImageError}
                  />
                )}
                
                {imageUrls.length > 1 && !imageError && (
                  <>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      {currentImageIndex + 1} / {imageUrls.length}
                    </div>
                    
                    <button 
                      onClick={(e) => navigateImages(e, 'prev')}
                      className="absolute top-1/2 left-3 transform -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg hover:shadow-xl"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    
                    <button 
                      onClick={(e) => navigateImages(e, 'next')}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg hover:shadow-xl"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-4">
                  <ImageOff className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-medium">No image available</p>
                </div>
              </div>
            )}
            
            {!imageError && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </div>

          {/* Delete Confirmation Overlay */}
          {isDeleting && (
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-30">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-3"></div>
                  <p className="text-white font-medium">{loadingAction}...</p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-full p-3 mb-4">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-white text-center mb-2 font-semibold text-lg">Delete Property?</p>
                  <p className="text-white/80 text-center mb-6 text-sm">This action cannot be undone</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={confirmDelete}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" /> Confirm
                    </button>
                    <button 
                      onClick={cancelDelete}
                      className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg transition-colors shadow-lg flex items-center gap-2"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          
          {isLoading && !isDeleting && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-30">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-3"></div>
                <p className="text-white font-medium">{loadingAction}...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Content Section - Enhanced Layout */}
        <div className="p-5">
          {/* Location & Address */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {property.location || 'Town'}
            </h3>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
              <span className="text-sm line-clamp-2">{property.address || 'Address not specified'}</span>
            </div>
          </div>

          {/* Price Section - More Prominent */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Monthly Rent</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{formattedPrice}</span>
                  <span className="text-sm text-gray-500 font-medium">/month</span>
                </div>
              </div>
              
              {property.deposit > 0 && (
                <div className="bg-white border-2 border-amber-200 text-amber-700 text-sm font-semibold px-3 py-2 rounded-lg shadow-sm">
                  <div className="text-xs text-amber-600 font-medium">Deposit</div>
                  <div className="text-base">R{property.deposit.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>

          {/* Property Features Grid - Enhanced */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="bg-blue-100 rounded-full p-2 mb-2">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-700 font-medium text-center">{property.room_type || 'Studio'}</span>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="bg-emerald-100 rounded-full p-2 mb-2">
                {parsedAmenities && parsedAmenities.includes('Security') ? (
                  <Shield className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Clock className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <span className="text-xs text-gray-700 font-medium text-center">
                {parsedAmenities && parsedAmenities.includes('Security') ? 'Secure' : '24/7'}
              </span>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="bg-purple-100 rounded-full p-2 mb-2">
                <Wifi className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-gray-700 font-medium text-center">WiFi</span>
            </div>
          </div>

          {/* Payment Methods - Refined */}
          {parsedPaymentMethods && parsedPaymentMethods.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Options</p>
              <div className="flex flex-wrap gap-2">
                {parsedPaymentMethods.slice(0, 3).map((method, index) => (
                  <div key={`payment-${index}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">
                    {getPaymentMethodIcon(method)}
                    <span className="text-xs text-gray-700 font-medium">{method}</span>
                  </div>
                ))}
                
                {parsedPaymentMethods.length > 3 && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg">
                    <span className="text-xs text-gray-600 font-medium">+{parsedPaymentMethods.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {property.acc_details && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {property.acc_details}
              </p>
            </div>
          )}

          {/* Action Buttons - Premium Design */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleEditClick}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Edit className="w-4 h-4" /> 
              <span>Edit Property</span>
            </button>
            <button 
              onClick={handleDeleteClick}
              className="px-4 bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 hover:border-red-300 font-semibold text-sm py-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;