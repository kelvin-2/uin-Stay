import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Wallet, Home, DollarSign, Heart, Clock, Shield, Wifi } from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams(); // Get the property ID from the URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/propertyData.json`) // Replace with your API endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }
        return response.json();
      })
      .then(data => {
        const selectedProperty = data.find(property => property.id === parseInt(id));
        if (selectedProperty) {
          setProperty(selectedProperty);
        } else {
          throw new Error('Property not found');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading property details:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading property details...</div>;
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 shadow-lg">
            <div className="flex items-center gap-1.5">
              <Home className="w-4 h-4" />
              {property.type || 'Accommodation'}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6">
          {/* Price and Features */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold text-gray-900">R{property.price.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
            <div className="flex gap-2">
              <Wifi className="w-5 h-5 text-blue-500" title="WiFi Available" />
              <Shield className="w-5 h-5 text-blue-500" title="24/7 Security" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.name}</h1>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-500 mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{property.location}</span>
          </div>

          {/* Walking Time */}
          <div className="flex items-center gap-1.5 text-gray-500 mb-6">
            <Clock className="w-5 h-5" />
            <span className="text-lg">10 min walk to campus</span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* Payment Methods */}
          <div className="flex flex-wrap gap-3 mb-6">
            {property.paymentMethods?.map((method, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full"
              >
                <Wallet className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-blue-700 font-medium">{method}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="text-gray-700 mb-6">
            <p>{property.description}</p>
          </div>

          {/* Contact Button */}
          <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;