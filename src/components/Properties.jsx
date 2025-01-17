import React, { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Home, DollarSign, Heart } from 'lucide-react';

const Properties = () =>{
    const [properties, setProperties] = useState([]);

    //fecthing data 
    useEffect( ()=> {
        fetch('/propertyData.json').then(response=>response.json())
        .then(data=>setProperties(data))
        .catch(error => console.error('Error loading properties:', error))
    },[]);
    return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {properties.map((property) => (
        <div key={property.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
          {/* Favorite Button */}
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
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
                {property.type}
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="p-4">
            {/* Price */}
            <div className="flex items-center gap-1 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-gray-900">{property.price}</span>
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

            {/* Features */}
            <div className="flex items-center justify-between text-gray-600">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span className="text-sm">{property.beds} Beds</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span className="text-sm">{property.baths} Bath</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    );
}

export default Properties;