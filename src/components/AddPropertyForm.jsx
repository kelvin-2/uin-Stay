import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddPropertyForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    address: '',
    roomType: '',
    distanceFromShuttle: '',
    distanceFromSchool: '',
    amenities: [],
    paymentAccepted: []
  });

  const roomTypes = [
    "Studio",
    "Single",
    "ensuite",
    "2 Shared room",
    "3 Shared room"
  ];

  const amenityOptions = [
    "WiFi",
    "Pool",
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col h-[80vh]">
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-6">
        <form id="propertyForm" onSubmit={handleSubmit} className="space-y-8 py-6">
          {/* Address */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-900">
              Property Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            />
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-900">
              Room Type
            </label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            >
              <option value="">Select Room Type</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Distances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900">
                Distance from Shuttle Stop (meters)
              </label>
              <input
                type="number"
                name="distanceFromShuttle"
                value={formData.distanceFromShuttle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900">
                Distance from School (meters)
              </label>
              <input
                type="number"
                name="distanceFromSchool"
                value={formData.distanceFromSchool}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                min="0"
                required
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-blue-900">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenityOptions.map(amenity => (
                <label key={amenity} className="flex items-center space-x-3 p-3 border-2 border-blue-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleCheckboxChange('amenities', amenity)}
                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-900">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-blue-900">
              Payment Methods Accepted
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {paymentOptions.map(payment => (
                <label key={payment} className="flex items-center space-x-3 p-3 border-2 border-blue-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.paymentAccepted.includes(payment)}
                    onChange={() => handleCheckboxChange('paymentAccepted', payment)}
                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-900">{payment}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Fixed Button Container */}
      <div className="border-t bg-white px-6 py-4 mt-4">
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border-2 border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="propertyForm"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyForm;