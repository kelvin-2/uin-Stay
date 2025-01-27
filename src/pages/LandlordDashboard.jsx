import React from 'react';
import { Building2, Plus, Eye } from 'lucide-react';

const LandlordDashboard = () => {
  // Sample data - would normally come from props or API
  const properties = [
    { id: 1, address: "123 Main St", roomType: "Studio", views: 245 },
    { id: 2, address: "456 Oak Ave", roomType: "2 Bedroom", views: 187 },
    { id: 3, address: "789 Pine Rd", roomType: "1 Bedroom", views: 329 }
  ];

  const totalProperties = properties.length;
  const totalViews = properties.reduce((sum, property) => sum + property.views, 0);

  const handleAddProperty = () => {
    navigate('/add-property');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 mt-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <button 
          onClick={handleAddProperty}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Add Property</span>
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Properties Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total Properties</p>
              <p className="text-2xl font-bold">{totalProperties}</p>
            </div>
          </div>
        </div>

        {/* Views Card */}
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

      {/* Property List */}
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
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
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
    </div>
  );
};

export default LandlordDashboard;