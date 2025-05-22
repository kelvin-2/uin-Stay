import React from 'react';
import { MapPin, Heart } from 'lucide-react';
import { ImageSection } from './property-card/ImageSection';
import { Features } from './property-card/Features';
import { PaymentOptions } from './property-card/PaymentOptions';

const PropertyCard = ({ property, currentImageIndex = 0, isFavorite, onImageChange, onFavoriteToggle, onImageError }) => {
  const handleImageNavigate = (e, dir) => {
    e.preventDefault(); e.stopPropagation();
    onImageChange?.(property.id, dir);
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault(); e.stopPropagation();
    onFavoriteToggle?.(property.id);
  };

  return (
    <div className="group relative">
      <a href={`/property/${property.id}`} className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative transform hover:-translate-y-1">
        
        {/* Status */}
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
          {property.status === 'booked' ? 'Booked' : 'Available Now'}
        </span>

        {/* Favorite */}
        <button onClick={handleFavoriteToggle} className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md">
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Image */}
        <ImageSection
          imageUrls={property.imageUrls}
          currentIndex={currentImageIndex}
          onNavigate={handleImageNavigate}
          onError={() => onImageError?.(property.id)}
        />

        {/* Details */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600">{property.location || 'Town'}</h3>
          <div className="flex items-start gap-1.5 text-gray-600 mb-3">
            <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span className="text-xs line-clamp-2">{property.address || 'Address not specified'}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-gray-900">R{property.monthly_rent?.toLocaleString() || '2,500'}</span>
            {property.deposit > 0 && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-200">R{property.deposit.toLocaleString()} deposit</span>}
          </div>

          <Features roomType={property.room_type} amenities={property.parsedAmenities} />
          <PaymentOptions methods={property.parsedPaymentMethods} />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg mt-1">View Details</button>
        </div>
      </a>
    </div>
  );
};

export default PropertyCard;
