import React, { useState } from 'react';
import { Plus, Building2, Trash2, Edit, Eye, X, Camera } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const LandlordPropertyPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Modern Studio Apartment",
      address: "123 Main Street, Johannesburg",
      price: "R5,500",
      type: "Studio",
      status: "Available",
      amenities: ["WiFi", "Parking", "Security"],
      imageUrl: "/api/placeholder/400/300",
      description: "Modern studio apartment with great amenities",
      views: 245
    },
    {
      id: 2,
      title: "Spacious 2-Bedroom Unit",
      address: "456 Oak Avenue, Pretoria",
      price: "R8,200",
      type: "2 Bedroom",
      status: "Occupied",
      amenities: ["WiFi", "Parking", "Security", "Pool"],
      imageUrl: "/api/placeholder/400/300",
      description: "Spacious unit in a quiet neighborhood",
      views: 187
    }
  ]);

  const [newProperty, setNewProperty] = useState({
    title: '',
    address: '',
    price: '',
    type: '',
    description: '',
    amenities: []
  });

  const propertyTypes = [
    "Studio",
    "1 Bedroom",
    "2 Bedroom",
    "3 Bedroom",
    "Shared Room"
  ];

  const amenityOptions = [
    "WiFi",
    "Parking",
    "Security",
    "Pool",
    "Gym",
    "Furnished",
    "Air Conditioning",
    "Study Area",
    "Kitchen",
    "Laundry"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setNewProperty(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    const property = {
      id: Date.now(),
      ...newProperty,
      status: "Available",
      views: 0,
      imageUrl: "/api/placeholder/400/300"
    };
    setProperties(prev => [...prev, property]);
    setNewProperty({
      title: '',
      address: '',
      price: '',
      type: '',
      description: '',
      amenities: []
    });
    setShowAddForm(false);
  };

  const handleDeleteProperty = (propertyId) => {
    setProperties(properties.filter(property => property.id !== propertyId));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-900">My Properties</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Property</span>
          </button>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium 
                  ${property.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {property.status}
                </span>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold text-blue-900">{property.title}</h3>
                <p className="text-gray-600 mt-1">{property.address}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{property.price}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {property.amenities.map(amenity => (
                    <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>{property.views} views</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {/* Handle edit */}}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Property</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this property? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProperty(property.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Property Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">Add New Property</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleAddProperty} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newProperty.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={newProperty.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={newProperty.price}
                        onChange={handleInputChange}
                        placeholder="R0,000"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type
                      </label>
                      <select
                        name="type"
                        value={newProperty.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">Select Type</option>
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newProperty.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {amenityOptions.map(amenity => (
                        <label
                          key={amenity}
                          className="flex items-center space-x-2 p-2 border-2 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={newProperty.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Property
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Listed</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first property</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordPropertyPage;