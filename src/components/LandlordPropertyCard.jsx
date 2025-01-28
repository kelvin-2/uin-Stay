import React, { useState } from 'react';
import { Pencil, Trash2, MoreVertical, X } from 'lucide-react';
import AddPropertyForm from './AddPropertyForm';

const PropertyCard = ({ property, onDelete, onUpdate }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      onDelete(property);
    }
    setShowMenu(false);
  };

  const handleUpdate = (updatedData) => {
    onUpdate(property, updatedData);
    setShowEditForm(false);
  };

  return (
    <>
      <div className="border-2 border-blue-100 rounded-lg p-4 space-y-4 relative">
        {/* Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-2 right-2 p-1 hover:bg-blue-50 rounded-full"
        >
          <MoreVertical className="h-5 w-5 text-blue-600" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-10 right-2 bg-white border border-blue-100 rounded-lg shadow-lg z-10">
            <button
              onClick={() => {
                setShowEditForm(true);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 w-full text-left"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}

        {/* Images Carousel/Grid */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto">
            {property.images.map((image, imgIndex) => (
              <div key={imgIndex} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Property ${imgIndex + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-2">
          <h3 className="font-semibold text-blue-900">{property.address}</h3>
          <p className="text-sm text-gray-600">{property.roomType}</p>
          
          {/* Distance Information */}
          <div className="text-sm text-gray-600">
            <p>Distance from shuttle: {property.distanceFromShuttle}m</p>
            <p>Distance from school: {property.distanceFromSchool}m</p>
          </div>

          {/* Amenities */}
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

          {/* Payment Methods */}
          <div className="flex flex-wrap gap-2 mt-2">
            {property.paymentAccepted.map((payment, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
              >
                {payment}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Property</h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AddPropertyForm
              initialData={property}
              onSubmit={handleUpdate}
              onClose={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;