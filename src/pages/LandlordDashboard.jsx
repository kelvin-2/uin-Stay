import React, { useState, useEffect } from 'react';
import { Building2, Plus, Eye, X, Edit, Trash2, ArrowLeft } from 'lucide-react';
// import AddPropertyForm from '../components/AddPropertyForm';
import PropertyDetails from '../components/PropertyDetailsCard';
import supabase from '../supabaseClient';

const LandlordDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    // Get the authenticated user's ID
    const { data: user, error: userError } = await supabase.auth.getUser();
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec delay
  
    if (userError) {
      console.error("Error getting user:", userError.message);
      return;
    }
  
    const landlordId = user?.user?.id; // User's unique ID from Supabase Auth
  
    console.log("Fetching properties for landlord ID:", landlordId);
  
    // Fetch properties where landlord_id matches the authenticated user ID
    const { data, error } = await supabase
      .from("accommodation")
      .select("*")
      .eq("landlord_id", landlordId); // Ensure landlord_id exists in the table
  
    if (error) {
      console.error("Error fetching properties:", error.message);
    } else {
      console.log("Properties fetched:", data);
      setProperties(data);
    }
  };

  const handleAddProperty = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setSelectedProperty(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setViewMode('detail');
  };

  const handleEditProperty = () => {
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleUpdateProperty = async (updatedProperty) => {
    const { data, error } = await supabase
      .from('accommodation')
      .update(updatedProperty)
      .eq('acc_id', updatedProperty.id)
      .select()
      .single(); // Ensures a single updated record is returned
  
    if (error) {
      console.error('Error updating property:', error.message);
    } else {
      console.log('Property updated:', data);
      await fetchProperties(); // Ensure the state updates after a successful update
      setIsModalOpen(false);
      setIsEditing(false);
    }
  };
  
  const handleDeleteProperty = async (id) => {
    const { error } = await supabase
      .from('accommodation')
      .delete()
      .eq('acc_id', id);
    if (error) {
      console.error('Error deleting property:', error);
    } else {
      fetchProperties();
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedProperty(null);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const totalProperties = properties.length;
  const totalViews = properties.reduce((sum, property) => sum + (property.views || 0), 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6 mt-16 md:mt-20">
      {viewMode === 'list' ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">My Properties</h1>
            {/* <button 
              onClick={handleAddProperty}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>Add Property</span>
            </button> */}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex items-center space-x-3 md:space-x-4">
                <Building2 className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Total Properties</p>
                  <p className="text-xl md:text-2xl font-bold">{totalProperties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex items-center space-x-3 md:space-x-4">
                <Eye className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Total Property Views</p>
                  <p className="text-xl md:text-2xl font-bold">{totalViews}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-3 md:p-4 border-b">
              <h2 className="text-lg md:text-xl font-semibold">Properties Overview</h2>
            </div>
            
            {/* Desktop table view - hidden on mobile */}
            <div className="hidden md:block p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Address</th>
                      <th className="text-left p-3">Room Type</th>
                      <th className="text-center p-3">Views</th>
                      <th className="text-right p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{property.address}</td>
                        <td className="p-3">{property.room_type}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-1 text-gray-600">
                            <Eye className="h-4 w-4" />
                            <span>{property.views || 0}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => handleViewDetails(property)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-600 hover:text-red-800 font-medium ml-3"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Mobile card view - shown only on mobile */}
            <div className="md:hidden">
              {properties.length > 0 ? (
                <div className="divide-y">
                  {properties.map(property => (
                    <div key={property.id} className="p-4 hover:bg-gray-50">
                      <p className="font-medium truncate">{property.address}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">{property.room_type}</span>
                        <div className="flex items-center text-sm text-gray-600">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{property.views || 0}</span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-3 pt-2 border-t">
                        <button 
                          onClick={() => handleViewDetails(property)}
                          className="flex items-center text-blue-600 text-sm font-medium"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                        <button 
                          onClick={() => handleDeleteProperty(property.id)}
                          className="flex items-center text-red-600 text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No properties found. Add your first property!
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <button 
            onClick={handleBackToList}
            className="flex items-center text-blue-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Properties
          </button>
          <PropertyDetails 
            property={selectedProperty}
            onBackToList={handleBackToList}
            onEditProperty={handleEditProperty}
          />
        </div>
      )}

      {/* Add/Edit Property Modal - With responsive adjustments */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold">
                {isEditing ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {/* <div className="p-4">
              <AddPropertyForm
                initialData={isEditing ? selectedProperty : null}
                onSubmit={async (propertyData) => {
                  if (isEditing) {
                    await handleUpdateProperty(propertyData);
                  } else {
                    const { data, error } = await supabase
                      .from('accommodations')
                      .insert([propertyData]);
                    if (error) {
                      console.error('Error adding property:', error);
                    } else {
                      fetchProperties();
                      handleCloseModal();
                    }
                  }
                }}
                onClose={handleCloseModal}
              />
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordDashboard;