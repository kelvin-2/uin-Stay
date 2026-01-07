import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import AddPropertyForm from '../components/AddPropertyForm';
import PropertyCard from '../components/LandlordPropertyCard';
import EditPropertyForm from '../components/EditPropertyForm';
import { getMyProperties } from '../api/accomodationApi';

const MyPropertiesPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Cache mechanism for properties
  const [propertyCache, setPropertyCache] = useState(null);
 
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        console.log("🔥 Fetching properties from API");
        const data = await getMyProperties(); // returns { properties: [...] }
        console.log("✅ Properties fetched:", data);

        // Extract the properties array from the response
        const propertiesArray = data.properties || [];

        // Map backend fields (already in camelCase from our mapping function) to PropertyCard fields
        const mappedProperties = propertiesArray.map(p => ({
          acc_id: p.id,                    // PropertyCard expects acc_id
          monthly_rent: p.monthlyRent,     // Now camelCase from our mapping
          location: p.title || 'Town',
          address: p.address || 'Address not specified',
          deposit: p.deposit || 0,
          room_type: p.roomType,           // Now camelCase from our mapping
          amenities: p.amenities || [],
          payment_methods: p.paymentMethods, // Now camelCase from our mapping
          image_url: p.images?.[0] || null,  // Get first image from images array
          status: p.isVerified ? 'available' : 'pending', // Now camelCase
          acc_details: p.accDetails || '',   // Now camelCase from our mapping
          max_occupants: p.maxOccupants || 1, // Include this if PropertyCard needs it
        }));

        setProperties(mappedProperties);
        setPropertyCache(mappedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleAddProperty = (propertyData) => {
    // Add the new property to the state
    const updatedProperties = [...properties, propertyData];
    setProperties(updatedProperties);
    setPropertyCache(updatedProperties);
    setShowAddForm(false);
  };

  const handleDeleteProperty = async (propertyToDelete) => {
    try {
      const { error } = await supabase
        .from('accommodation')
        .delete()
        .eq('acc_id', propertyToDelete.acc_id);
        
      if (error) throw error;
  
      const updatedProperties = properties.filter(
        property => property.acc_id !== propertyToDelete.acc_id
      );
      
      setProperties(updatedProperties);
      setPropertyCache(updatedProperties);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleEditClick = (property) => {
    setSelectedProperty(property);
    setShowEditForm(true);
  };

  const handleUpdateProperty = (oldProperty, updatedProperty) => {
    const updatedProperties = properties.map(property =>
      property.acc_id === oldProperty.acc_id ? updatedProperty : property
    );
    
    setProperties(updatedProperties);
    setPropertyCache(updatedProperties);
    setShowEditForm(false);
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

      {/* Modal for Add Property Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <AddPropertyForm
              onSubmit={handleAddProperty}
              onClose={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* Modal for Edit Property Form */}
      {showEditForm && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <EditPropertyForm
              property={selectedProperty}
              onSubmit={handleUpdateProperty}
              onClose={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}

      {/* Properties display */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-gray-600">Loading your properties...</p>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.acc_id}
              property={property}
              onDelete={handleDeleteProperty}
              onEdit={() => handleEditClick(property)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg mb-2">You haven't added any properties yet</p>
          <p className="text-gray-400 mb-4">Click "Add Property" to get started.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Your First Property
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage;