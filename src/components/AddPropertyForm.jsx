import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import supabase  from '../supabaseClient';
import { Loader2, CheckCircle } from 'lucide-react';

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;



const AddPropertyForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    address: '',
    roomType: '',
    distanceFromShuttle: '',
    distanceFromSchool: '',
    amenities: [],
    paymentAccepted: [],
    images: [],
    houseRules: [],
    leaseLength: '',
    depositAmount: ''
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]); // Track upload status for each image
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const locationOptions = [
    "Central",
    "Town",
    "Humewood",
    "Summerstrand", 
    "Forest Hill",
    "Greenacres",
    "Cape Road",
    "Richmond Hill"
  ]

 

  const leaseLengthOptions = [
    "6 months",
    "12 months",
    "Month-to-month"
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    // Initialize upload status for new images
    const newUploadStatus = files.map(() => ({ 
      uploading: false, 
      uploaded: false, 
      error: false 
    }));

    setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    setUploadStatus(prev => [...prev, ...newUploadStatus]);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const uploadImagesToCloudinary = async (files) => {
    const uploadPromises = files.map(async (file, index) => {
      setUploadStatus(prev => {
        const newStatus = [...prev];
        newStatus[index] = { ...newStatus[index], uploading: true };
        return newStatus;
      });

      //not sure what this line does 
      const formData = new FormData();
      formData.append('file', file);//append new file 
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);//append the uploaded presets 
  
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok){
          throw new Error(response.statusText);
        }
  
        const data = await response.json();
        setUploadStatus(prev => {
          const newStatus = [...prev];
          newStatus[index] = { uploading: false, uploaded: true, error: false };
          return newStatus;
        });
  
        return data.secure_url; // return the uploaded image url
      } catch (error) {
        setUploadStatus(prev => {
          const newStatus = [...prev];
          newStatus[index] = { uploading: false, uploaded: false, error: true };
          return newStatus;
        });
        throw error;
      }
    });
  
    return Promise.all(uploadPromises);
  };

   const removeImage = (index) => {
    // Remove from preview images
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    
    // Remove from form data images
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));

    // Remove from upload status
    setUploadStatus(prev => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Upload images to Cloudinary
      const imageUrls = await uploadImagesToCloudinary(formData.images);
  
      // Prepare data for Supabase
      const propertyData = {
        address: formData.address || null,
        location: formData.location || null,
        room_type: formData.roomType || null,
        distance_from_shuttle: formData.distanceFromShuttle || null,
        amenities: formData.amenities || [],
        payment_methods: formData.paymentAccepted || [],
        image_url: imageUrls || [],
        lease_length: formData.leaseLength || null,
        deposit_amount: parseFloat(formData.depositAmount) || 0,
      };
  
      console.log('Property Data:', propertyData);
  
      let response;
      if (formData.id) {
        // Update existing property
        response = await supabase
          .from('accommodations')
          .update(propertyData)
          .eq('id', formData.id);
      } else {
        // Insert new property
        response = await supabase.from('accommodations').insert([propertyData]);
      }
  
      const { data, error } = response;
  
      if (error) {
        console.error('Supabase Error:', error);
        return;
      }
  
      if (!data) {
        console.error('Supabase returned null data. Full response:', response);
        return;
      }
  
      console.log('Property added/updated:', data);
      onSubmit(data);
    } catch (err) {
      console.error('Error submitting property:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-blue-900">
              Property Images
            </label>
            <div className="flex flex-wrap gap-4">
              {previewImages.map((url, index) => (
                <div key={index} className="relative">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  {/* Upload Status Indicators */}
                  {uploadStatus[index]?.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  )}
                  {uploadStatus[index]?.uploaded && (
                    <div className="absolute top-0 right-0 bg-green-500 rounded-full">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  )}
                  {uploadStatus[index]?.error && (
                    <div className="absolute top-0 right-0 bg-red-500 rounded-full">
                      <X className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <ImageIcon className="h-8 w-8 text-blue-500" />
                <span className="text-xs text-blue-500 mt-1">Add Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>


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
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-900">
              Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            >
              <option value="">Select Location</option>
              {locationOptions.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Room Type and Deposit Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900">
                Deposit Amount (R)
              </label>
              <input
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                min="0"
                placeholder="Enter deposit amount"
                required
              />
            </div>
          </div>

          {/* Lease Length */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-900">
              Lease Length
            </label>
            <select
              name="leaseLength"
              value={formData.leaseLength}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            >
              <option value="">Select Lease Length</option>
              {leaseLengthOptions.map(length => (
                <option key={length} value={length}>{length}</option>
              ))}
            </select>
          </div>

          {/* Distances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900">
                Distance from Shuttle Stop (km)
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
                Distance from School (km)
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

          {/* House Rules */}
          

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

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 border-2 border-blue-200 rounded-lg text-blue-700"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`px-6 py-3 rounded-lg text-white ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Adding Property...
                </div>
              ) : (
                'Add Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyForm;