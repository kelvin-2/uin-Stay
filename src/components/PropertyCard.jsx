import React from 'react';
import { 
  Home, 
  Ruler, 
  Bath, 
  Bed, 
  MapPin, 
  Phone, 
  Mail, 
  DollarSign, 
  User 
} from 'lucide-react';

const PropertyCard = ({ property }) => {
  const {
    title,
    description,
    price,
    bedrooms,
    bathrooms,
    squareFootage,
    address,
    amenities,
    owner,
    images
  } = property;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="relative">
        <img 
          src={images[0]} // Use the first image from the images array
          alt={title} 
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          ${price}/month
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Bed className="h-5 w-5 text-blue-600" />
            <span>{bedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bath className="h-5 w-5 text-blue-600" />
            <span>{bathrooms} Bathrooms</span>
          </div>
          <div className="flex items-center space-x-2">
            <Ruler className="h-5 w-5 text-blue-600" />
            <span>{squareFootage} sq ft</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span className="text-gray-700">{address}</span>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <span 
                key={index} 
                className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Owner Details</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{owner.name}</h4>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{owner.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{owner.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 flex justify-between items-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Book Viewing
        </button>
        <button className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
          Contact Owner
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;