import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AddPropertyForm from '../components/AddPropertyForm';
import PropertyCard from '../components/LandlordPropertyCard';
import supabase from '../supabaseClient'; // Make sure this import path is correct

const MyPropertiesPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties when component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('accommodation')
            .select('*')
            .eq('landlord_id', user.id);
            
          if (error) throw error;
          setProperties(data || []);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleAddProperty = (propertyData) => {
    // Add the new property to the state
    setProperties(prev => [...prev, propertyData]);
    setShowAddForm(false);
  };

  const handleDeleteProperty = async (propertyToDelete) => {
    try {
      const { error } = await supabase
        .from('accommodation')
        .delete()
        .eq('acc_id', propertyToDelete.acc_id);
        
      if (error) throw error;
      
      // Update local state after successful deletion
      setProperties(prev => 
        prev.filter(property => property.acc_id !== propertyToDelete.acc_id)
      );
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleUpdateProperty = (oldProperty, updatedProperty) => {
    // Update local state after successful update
    setProperties(prev =>
      prev.map(property =>
        property.acc_id === oldProperty.acc_id ? updatedProperty : property
      )
    );
  };

  return (
    <div className="container mx-auto px-4 pt-16 pb-8">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl">
            <AddPropertyForm
              onSubmit={handleAddProperty}
              onClose={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading properties...</div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.acc_id}
              property={property}
              onDelete={handleDeleteProperty}
              onUpdate={handleUpdateProperty}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          You haven't added any properties yet. Click "Add Property" to get started.
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage;