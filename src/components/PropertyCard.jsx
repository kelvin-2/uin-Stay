import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch property details from the Mock API
    fetch(`https://mockapi.io/properties/${id}`) // Replace with your Mock API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }
        return response.json();
      })
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading property details:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-pulse bg-gray-200 h-96 w-full rounded-2xl mb-6"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 p-6 rounded-2xl inline-block shadow-sm">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Emoji-based amenities map
  const amenitiesMap = {
    wifi: { symbol: '📶', label: 'WiFi' },
    security: { symbol: '🛡️', label: '24/7 Security' },
    parking: { symbol: '🚗', label: 'Parking' },
    kitchen: { symbol: '🍳', label: 'Fully Equipped Kitchen' },
    livingRoom: { symbol: '🛋️', label: 'Living Room' },
    heating: { symbol: '🔥', label: 'Heating' },
    airConditioning: { symbol: '❄️', label: 'Air Conditioning' },
    tv: { symbol: '📺', label: 'TV' },
    washer: { symbol: '🧺', label: 'Washing Machine' },
    pool: { symbol: '🏊‍♂️', label: 'Swimming Pool' },
  };

  const landlord = {
    name: 'John Smith',
    phone: '+27 (123) 456-7890',
    email: 'john.smith@properties.com',
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-lg">
            <div>{property.type || 'Accommodation'}</div>
          </div>
        </div>

        {/* Content Container */}
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Left Column - Basic Details */}
          <div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-3">
                R{property.price.toLocaleString()} /month
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {property.name}
              </h1>
              <div className="text-lg text-gray-600 mb-3">📍 {property.location}</div>
              <div className="text-lg text-gray-600 mb-6">⏱️ 10 min walk to campus</div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                🛏️ <div>Bedrooms: {property.bedrooms}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                🛁 <div>Bathrooms: {property.bathrooms}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                📐 <div>Size: {property.size} m²</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                📅 <div>Available: {property.availableFrom}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Amenities and Contact */}
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities?.map((amenity, index) => {
                  const amenityDetails = amenitiesMap[amenity];
                  return (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <span>{amenityDetails?.symbol || '❔'}</span>
                      <span>{amenityDetails?.label || amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Contact Landlord</h3>
              <div className="space-y-3">
                <div>📞 {landlord.phone}</div>
                <div>📧 {landlord.email}</div>
                <div>👤 {landlord.name}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100">
          <button className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
            Contact Property Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
