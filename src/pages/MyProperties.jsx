import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddPropertyForm from '../components/AddPropertyForm';
import PropertyCard from '../components/LandlordPropertyCard';

const MyPropertiesPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [properties, setProperties] = useState([]);

  const handleAddProperty = (propertyData) => {
    // Here you would typically make an API call to save the property
    setProperties(prev => [...prev, propertyData]);
    setShowAddForm(false);
  };

  const handleDeleteProperty = (propertyToDelete) => {
    // Here you would typically make an API call to delete the property
    setProperties(prev => 
      prev.filter(property => property !== propertyToDelete)
    );
  };

  const handleUpdateProperty = (oldProperty, updatedProperty) => {
    // Here you would typically make an API call to update the property
    setProperties(prev =>
      prev.map(property =>
        property === oldProperty ? updatedProperty : property
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">My Properties</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <PropertyCard
            key={index}
            property={property}
            onDelete={handleDeleteProperty}
            onUpdate={handleUpdateProperty}
          />
        ))}
      </div>
    </div>
  );
};

export default MyPropertiesPage;