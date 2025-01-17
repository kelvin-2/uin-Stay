import React, { useState, useEffect } from 'react';
import { MapPin, Wallet, Home, DollarSign, Heart } from 'lucide-react';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/propertyData.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        return response.json();
      })
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading properties:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 p-4 rounded-lg inline-block">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {properties.map((property) => (
        <div key={property.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group mt-20 cursor-pointer">
          {/* Favorite Button */}
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-300 transition-colors opacity-0 group-hover:opacity-100">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>

          {/* Image Container */}
          <div className="relative">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
              <div className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                {property.type || 'Accommodation'}
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="p-4">
            {/* Price */}
            <div className="flex items-center gap-1 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-gray-900">R{property.price.toLocaleString()}</span>
              <span className="text-gray-600 text-sm">/month</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.name}</h3>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-500 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{property.location}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-3"></div>

            {/* Payment Methods */}
            <div className="flex items-center justify-between text-gray-600">
              {property.paymentMethods?.map((method, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Properties;