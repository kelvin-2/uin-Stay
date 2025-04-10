import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import supabase from '../supabaseClient';
import { Loader2, CheckCircle } from 'lucide-react';

const AddPropertyForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    address: '',
    location: '', // Added this field which was missing initialization
    roomType: '',
    distanceFromShuttle: '',
    distanceFromSchool: '',
    amenities: [],
    paymentAccepted: [],
    images: [],
    houseRules: [],
    leaseLength: '',
    depositAmount: '',
    monthlyRent: ''
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false); // Added missing state
  const [successMessage, setSuccessMessage] = useState('');

  // Rest of the component remains the same...
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
  ];

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
    // Check if there are environment variables
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    
    if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
      console.error('Cloudinary environment variables are not set');
      // Return placeholder URLs for testing
      return files.map(() => 'https://placeholder.com/image.jpg');
    }
    
    const uploadPromises = files.map(async (file, index) => {
      setUploadStatus(prev => {
        const newStatus = [...prev];
        newStatus[index] = { ...newStatus[index], uploading: true };
        return newStatus;
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(response.statusText);
        }
  
        const data = await response.json();
        setUploadStatus(prev => {
          const newStatus = [...prev];
          newStatus[index] = { uploading: false, uploaded: true, error: false };
          return newStatus;
        });
  
        return data.secure_url;
      } catch (error) {
        console.error('Image upload error:', error);
        setUploadStatus(prev => {
          const newStatus = [...prev];
          newStatus[index] = { uploading: false, uploaded: false, error: true };
          return newStatus;
        });
        // Return a placeholder URL on error so the form can still submit
        return 'https://placeholder.com/error-image.jpg';
      }
    });
  
    return Promise.all(uploadPromises);
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setUploadStatus(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
  
    try {
      // Fetch the authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
  
      if (authError || !user) {
        console.error("Error fetching user:", authError);
        setIsSubmitting(false);
        return;
      }
  
      // Upload images to Cloudinary if there are any
      let imageUrls = [];
      if (formData.images.length > 0) {
        imageUrls = await uploadImagesToCloudinary(formData.images);
      }
  
      // Prepare data for Supabase
      const propertyData = {
        address: formData.address || null,
        location: formData.location || null,
        room_type: formData.roomType || null,
        amenities: formData.amenities || [],
        payment_methods: formData.paymentAccepted || [],
        image_url: imageUrls || [],
        deposit: parseFloat(formData.depositAmount) || 0,
        monthly_rent: parseFloat(formData.monthlyRent) || 0,
        landlord_id: user.id
      };
  
      const { data: existingProperty } = await supabase
      .from('accommodation')
      .select('acc_id')
      .eq('address', formData.address)
      .eq('landlord_id', user.id)
      .single();

      let response;
      if (existingProperty) {
        // Update existing property
        response = await supabase
          .from('accommodation')
          .update(propertyData)
          .eq('acc_id', existingProperty.acc_id);
      } else {
        // Insert new property
        response = await supabase
          .from('accommodation')
          .insert([propertyData])
          .select();
      }
  
      const { data, error: supabaseError } = response;
  
      if (supabaseError) {
        console.error('Supabase Error:', supabaseError.message);
        setSuccessMessage('There was an issue saving your property. Please try again.');
      } else {
        setSuccessMessage('Property saved successfully!');
        setSubmitSuccess(true);
        
        // Call onSubmit with the saved data
        onSubmit(data ? data[0] : propertyData);
      }
    } catch (err) {
      console.error('Error submitting property:', err);
      setSuccessMessage('An unexpected error occurred. Please try again.');
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
          
          {/* Location */}
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

          {/* Room Type and Monthly Rent */}
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
                Monthly Rent (R)
              </label>
              <input
                type="number"
                name="monthlyRent"
                value={formData.monthlyRent}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                min="0"
                placeholder="Enter monthly rent"
                required
              />
            </div>
          </div>

          {/* Deposit Amount */}
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
          
          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-4 rounded-md flex items-center">
              <CheckCircle className="h-6 w-6 mr-2" />
              <span>{successMessage}</span>
            </div>
          )}

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