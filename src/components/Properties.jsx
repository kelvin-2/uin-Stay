import React, { useState, useEffect } from 'react';
import { MapPin, Wallet, Home, DollarSign, Heart, Clock, Shield, Wifi } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6 mt-11">
      {properties.map((property) => (
        <div key={property.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 relative group transform hover:-translate-y-1 cursor-pointer">
          {/* Favorite Button */}
          <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 ">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
          </button>

          {/* Image Container */}
          <div className="relative overflow-hidden">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-300 cursor-pointer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 shadow-lg">
              <div className="flex items-center gap-1.5">
                <Home className="w-4 h-4" />
                {property.type || 'Accommodation'}
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="p-5 cursor-pointer">
            {/* Price and Features */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-gray-900">R{property.price.toLocaleString()}</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <div className="flex gap-2">
                <Wifi className="w-4 h-4 text-blue-500" title="WiFi Available" />
                <Shield className="w-4 h-4 text-blue-500" title="24/7 Security" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{property.name}</h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-gray-500 mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm line-clamp-1">{property.location}</span>
            </div>

            {/* Walking Time */}
            <div className="flex items-center gap-1.5 text-gray-500 mb-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm">10 min walk to campus</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-4" />

            {/* Payment Methods */}
            <div className="flex flex-wrap gap-3">
              {property.paymentMethods?.map((method, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full"
                >
                  <Wallet className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-700 font-medium">{method}</span>
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