import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import PropertyCard from './PropertyCard';
import AddPropertyForm from './AddPropertyForm';
import { Plus } from 'lucide-react';

const LandlordProperties = ({ landlord_Id }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch properties for the specific landlord
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Query properties table for items with matching landlordId
        const { data, error } = await supabase
          .from('accommodation')
          .select('*')
          .eq('landlord_Id', landlord_Id);
        
        if (error) throw error;
        
        setProperties(data || []);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (landlord_Id) {
      fetchProperties();
    }
  }, [landlordId]);

  // Handle property deletion
  const handleDeleteProperty = async (property) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);
      
      if (error) throw error;
      
      // Update state to remove the deleted property
      setProperties(properties.filter(p => p.id !== property.id));
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property. Please try again.');
    }
  };

  // Handle property update
  const handleUpdateProperty = async (property, updatedData) => {
    try {
      const { error } = await supabase
        .from('accomodation')
        .update(updatedData)
        .eq('acc_id', property.id);
      
      if (error) throw error;
      
      // Update state with the updated property
      setProperties(properties.map(p => 
        p.id === property.id ? { ...p, ...updatedData } : p
      ));
    } catch (err) {
      console.error('Error updating property:', err);
      alert('Failed to update property. Please try again.');
    }
  };

  // Handle adding a new property
  const handleAddProperty = async (newPropertyData) => {
    try {
      // Add landlordId to the new property data
      const propertyWithLandlord = {
        ...newPropertyData,
        landlordId: landlordId
      };
      
      const { data, error } = await supabase
        .from('accomodation')
        .insert(propertyWithLandlord)
        .select();
      
      if (error) throw error;
      
      // Update state with the new property
      setProperties([...properties, data[0]]);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding property:', err);
      alert('Failed to add property. Please try again.');
    }
  };

  if (loading) return <div className="text-center p-4">Loading properties...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Your Properties</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center p-8 bg-blue-50 rounded-lg">
          <p className="text-lg text-blue-800">You haven't added any properties yet.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onDelete={handleDeleteProperty}
              onUpdate={handleUpdateProperty}
            />
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Add New Property</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AddPropertyForm
              onSubmit={handleAddProperty}
              onClose={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordProperties;