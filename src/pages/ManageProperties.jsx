import React, { useState } from 'react';
import { 
  Pencil, 
  Trash2, 
  X, 
  Save,
  Image as ImageIcon,
  MapPin,
  Home,
  Wifi,
  DollarSign,
  Bus
} from 'lucide-react';

const ManageProperties = ({ property, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState(property);
  const [previewImages, setPreviewImages] = useState(property.images || []);

  const roomTypes = [
    "Studio",
    "Single",
    "ensuite",
    "2 Shared room",
    "3 Shared room"
  ];

  const amenityOptions = [
    "WiFi",
    "Air Conditioning",
    "Washin Machine",
    "Parking",
    "Kitchen",
    "Study Area",
    "Security",
    "Furnished",
    "TV",
    "Gym"
  ];

  const paymentOptions = [
    "NSFAS", "BUSARY", "PRIVATE"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setEditedProperty(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    setEditedProperty(prev => ({
      ...prev,
      images: [...(prev.images || []), ...files]
    }));
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setEditedProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(editedProperty);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProperty(property);
    setPreviewImages(property.images || []);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Property Details</h2>
        <div className="flex space-x-4">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(property.id)}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Images Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Property Images
          </h3>
          <div className="flex flex-wrap gap-4">
            {previewImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Property ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                {isEditing && (
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <ImageIcon className="h-8 w-8 text-blue-500" />
                <span className="text-xs text-blue-500 mt-1">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedProperty.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{property.address}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Distance from Shuttle
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="distanceFromShuttle"
                    value={editedProperty.distanceFromShuttle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{property.distanceFromShuttle}m</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Distance from School
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="distanceFromSchool"
                    value={editedProperty.distanceFromSchool}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{property.distanceFromSchool}m</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
              <Home className="h-5 w-5" />
              Room Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Room Type
              </label>
              {isEditing ? (
                <select
                  name="roomType"
                  value={editedProperty.roomType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-800">{property.roomType}</p>
              )}
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Amenities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenityOptions.map(amenity => (
              <label
                key={amenity}
                className={`flex items-center space-x-3 p-3 border-2 rounded-lg transition-colors
                  ${isEditing 
                    ? 'cursor-pointer border-blue-100 hover:bg-blue-50' 
                    : editedProperty.amenities?.includes(amenity)
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-100'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={editedProperty.amenities?.includes(amenity)}
                  onChange={() => handleCheckboxChange('amenities', amenity)}
                  disabled={!isEditing}
                  className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Methods
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {paymentOptions.map(payment => (
              <label
                key={payment}
                className={`flex items-center space-x-3 p-3 border-2 rounded-lg transition-colors
                  ${isEditing 
                    ? 'cursor-pointer border-blue-100 hover:bg-blue-50' 
                    : editedProperty.paymentAccepted?.includes(payment)
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-100'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={editedProperty.paymentAccepted?.includes(payment)}
                  onChange={() => handleCheckboxChange('paymentAccepted', payment)}
                  disabled={!isEditing}
                  className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{payment}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProperties;