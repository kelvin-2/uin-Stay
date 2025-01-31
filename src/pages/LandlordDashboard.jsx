import React, { useState } from 'react';
import { Building2, Plus, Eye, X } from 'lucide-react';
import AddPropertyForm from '../components/AddPropertyForm';
import PropertyDetails from '../components/PropertyDetailsCard';

const LandlordDashboard = () => {
  const [properties, setProperties] = useState([
    { 
      id: 1, 
      address: "123 Main St", 
      roomType: "Studio", 
      views: 245,
      distanceFromShuttle: "0.5",
      distanceFromSchool: "1.0",
      amenities: ["WiFi", "Parking"],
      paymentAccepted: ["NSFAS", "PRIVATE"],
      images: [],
      leaseLength: "12 months",
      depositAmount: "5000",
      houseRules: ["No Smoking", "No Pets"]
    },
    { 
      id: 2, 
      address: "456 Oak Ave", 
      roomType: "2 Bedroom", 
      views: 187,
      distanceFromShuttle: "0.3",
      distanceFromSchool: "0.8",
      amenities: ["WiFi", "Air Conditioning", "Parking"],
      paymentAccepted: ["NSFAS", "BUSARY"],
      images: [],
      leaseLength: "6 months",
      depositAmount: "4500",
      houseRules: ["No Parties", "Quiet Hours"]
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  const totalProperties = properties.length;
  const totalViews = properties.reduce((sum, property) => sum + property.views, 0);

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

  const handleUpdateProperty = (updatedProperty) => {
    const updatedProperties = properties.map(p => 
      p.id === updatedProperty.id ? { ...updatedProperty, views: p.views } : p
    );
    setProperties(updatedProperties);
    setSelectedProperty({ ...updatedProperty, views: selectedProperty.views });
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedProperty(null);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 mt-20">
      {viewMode === 'list' ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Properties</h1>
            <button 
              onClick={handleAddProperty}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Property</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Properties</p>
                  <p className="text-2xl font-bold">{totalProperties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <Eye className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Property Views</p>
                  <p className="text-2xl font-bold">{totalViews}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Properties Overview</h2>
            </div>
            <div className="p-4">
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
                        <td className="p-3">{property.roomType}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-1 text-gray-600">
                            <Eye className="h-4 w-4" />
                            <span>{property.views}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => handleViewDetails(property)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <PropertyDetails 
        property={selectedProperty}
        onBackToList={handleBackToList}
        onEditProperty={handleEditProperty}
      />
      )}

      {/* Add/Edit Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEditing ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button onClick={handleCloseModal}>
                <X className="h-6 w-6 text-gray-500 hover:text-gray-800" />
              </button>
            </div>
            <AddPropertyForm
              initialData={isEditing ? selectedProperty : null}
              onSubmit={(propertyData) => {
                if (isEditing) {
                  handleUpdateProperty({ ...propertyData, id: selectedProperty.id });
                } else {
                  setProperties([...properties, { ...propertyData, id: properties.length + 1, views: 0 }]);
                  handleCloseModal();
                }
              }}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordDashboard;