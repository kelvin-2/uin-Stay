import React, { useState } from 'react';
import { 
  Home, 
  PlusCircle, 
  Search,
  FileText,
  Settings,
  Users
} from 'lucide-react';

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Cozy Campus Apartment",
      address: "123 University Street",
      occupancy: "80%",
      amenities: ["WiFi", "Parking", "Laundry"],
      status: "Active"
    },
    {
      id: 2,
      name: "Student Shared House",
      address: "456 College Avenue",
      occupancy: "60%", 
      amenities: ["Kitchen", "Study Area", "Balcony"],
      status: "Pending"
    }
  ]);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    amenities: []
  });

  const amenitiesList = [
    "WiFi", "Parking", "Laundry", "Kitchen", 
    "Study Area", "Balcony", "Air Conditioning", 
    "Gym", "Swimming Pool"
  ];

  const handleAddProperty = () => {
    if (!newProperty.name || !newProperty.address) {
      alert('Please fill in property name and address');
      return;
    }

    const propertyToAdd = {
      id: Date.now(),
      ...newProperty,
      occupancy: "0%",
      status: "Pending"
    };

    setProperties([...properties, propertyToAdd]);
    setShowAddPropertyModal(false);
    setNewProperty({ name: '', address: '', amenities: [] });
  };

  const toggleAmenity = (amenity) => {
    setNewProperty(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
    { id: 'properties', label: 'My Properties', icon: <FileText className="w-5 h-5" /> }
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-blue-600">uinStay</h2>
          <p className="text-gray-500">Landlord Dashboard</p>
        </div>

        <div className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="ml-3">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <button 
            onClick={() => setShowAddPropertyModal(true)}
            className="w-full flex items-center justify-center bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="mr-2" />
            Add Property
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, John</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search properties" 
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
              <Search className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button>
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <Users className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold">Total Tenants</h3>
              <p className="text-3xl font-bold">24</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Home className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">Properties</h3>
              <p className="text-3xl font-bold">{properties.length}</p>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">My Properties</h2>
              <button 
                onClick={() => setShowAddPropertyModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add New Property
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">Property Name</th>
                    <th className="p-4 text-left">Address</th>
                    <th className="p-4 text-left">Occupancy</th>
                    <th className="p-4 text-left">Amenities</th>
                    <th className="p-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(property => (
                    <tr key={property.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{property.name}</td>
                      <td className="p-4">{property.address}</td>
                      <td className="p-4">{property.occupancy}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {property.amenities.map(amenity => (
                            <span 
                              key={amenity} 
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          property.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add New Property</h2>
            <input 
              type="text"
              placeholder="Property Name"
              value={newProperty.name}
              onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
              className="w-full border p-2 rounded mb-4"
            />
            <input 
              type="text"
              placeholder="Property Address"
              value={newProperty.address}
              onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
              className="w-full border p-2 rounded mb-4"
            />
            <div>
              <h3 className="font-semibold mb-2">Select Amenities</h3>
              <div className="grid grid-cols-3 gap-2">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input 
                      type="checkbox"
                      checked={newProperty.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="mr-2"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => setShowAddPropertyModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddProperty}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordDashboard;