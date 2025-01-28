import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddPropertyForm from '../components/AddPropertyForm';

const MyPropertiesPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [properties, setProperties] = useState([]);

  const handleAddProperty = (propertyData) => {
    // Here you would typically make an API call to save the property
    setProperties(prev => [...prev, propertyData]);
    setShowAddForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">My Properties</h1>
        {/*add property  button*/}
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </button>
      </div>
      {/*this display form*/}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl">
            <AddPropertyForm
              onSubmit={handleAddProperty}
              onClose={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* Display existing properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <div
            key={index}
            className="border-2 border-blue-100 rounded-lg p-4 space-y-4"
          >
            {/* Property images carousel/grid */}
            <div className="flex gap-2 overflow-x-auto">
              {property.images.map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={URL.createObjectURL(image)}
                  alt={`Property ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900">{property.address}</h3>
              <p className="text-sm text-gray-600">{property.roomType}</p>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, amenityIndex) => (
                  <span
                    key={amenityIndex}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPropertiesPage;