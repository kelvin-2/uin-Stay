import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import supabase from '../supabaseClient';
import { Loader2, CheckCircle } from 'lucide-react';

const EditPropertyForm = ({ property, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    address: property.address || '',
    location: property.location || '',
    roomType: property.room_type || '',
    amenities: property.amenities || [],
    paymentAccepted: property.payment_methods || [],
    images: [],
    depositAmount: property.deposit || '',
    monthlyRent: property.monthly_rent || '',
    accDetails: property.acc_details || ''
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize preview images from existing property images
  useEffect(() => {
    if (property.image_url && Array.isArray(property.image_url) && property.image_url.length > 0) {
      setPreviewImages(property.image_url);
      // Initialize upload status for existing images as already uploaded
      setUploadStatus(property.image_url.map(() => ({ 
        uploading: false, 
        uploaded: true, 
        error: false 
      })));
    }
  }, [property]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValue = Array.isArray(prev[field]) ? prev[field] : [];
      
      return {
        ...prev,
        [field]: currentValue.includes(value)
          ? currentValue.filter(item => item !== value)
          : [...currentValue, value]
      };
    });
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

  // Function to upload images to Supabase storage
  const uploadImagesToSupabase = async (files, userId) => {
    const uploadPromises = files.map(async (file, index) => {
      // Calculate the actual index in the uploadStatus array
      const statusIndex = previewImages.length - files.length + index;
      
      setUploadStatus(prev => {
        const newStatus = [...prev];
        newStatus[statusIndex] = { ...newStatus[statusIndex], uploading: true };
        return newStatus;
      });

      try {
        // Create a unique file name to avoid collisions
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload the file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (error) {
          throw error;
        }

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        setUploadStatus(prev => {
          const newStatus = [...prev];
          newStatus[statusIndex] = { uploading: false, uploaded: true, error: false };
          return newStatus;
        });

        return publicUrl;
      } catch (error) {
        console.error('Image upload error:', error);
        setUploadStatus(prev => {
          const newStatus = [...prev];
          newStatus[statusIndex] = { uploading: false, uploaded: false, error: true };
          return newStatus;
        });
        // Return an empty string on error
        return '';
      }
    });
  
    return Promise.all(uploadPromises);
  };

  const removeImage = (index) => {
    const isExistingImage = index < (property.image_url?.length || 0);
    
    // Remove from preview images
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    
    // Remove from upload status
    setUploadStatus(prev => prev.filter((_, i) => i !== index));
    
    // If it's a new image (not from the existing property.image_url)
    if (!isExistingImage) {
      // Calculate the adjusted index for the formData.images array
      const adjustedIndex = index - (property.image_url?.length || 0);
      if (adjustedIndex >= 0) {
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== adjustedIndex)
        }));
      }
    } else {
      // For existing images, we'll filter them out when submitting
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
  
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
  
      if (authError || !user) {
        console.error("Error fetching user:", authError);
        setIsSubmitting(false);
        return;
      }
  
      // Start with any existing image URLs
      let imageUrls = [...(property.image_url || [])];
  
      // Filter out removed existing images
      imageUrls = imageUrls.filter((_, i) =>
        i < previewImages.length && previewImages[i] === imageUrls[i]
      );
  
      // Upload new images to Supabase if there are any
      if (formData.images.length > 0) {
        const newImageUrls = await uploadImagesToSupabase(formData.images, user.id);
        const validNewUrls = newImageUrls.filter(url => url);
        imageUrls = [...imageUrls, ...validNewUrls];
      }
      
      const propertyData = {
        address: formData.address,
        location: formData.location,
        room_type: formData.roomType,
        amenities: formData.amenities,
        payment_methods: formData.paymentAccepted,
        deposit: formData.depositAmount,
        monthly_rent: formData.monthlyRent,
        acc_details: formData.accDetails,
        image_url: imageUrls
      };
  
      const { data, error: supabaseError } = await supabase
        .from('accommodation')
        .update(propertyData)
        .eq('acc_id', property.acc_id)
        .select();
  
      if (supabaseError) {
        console.error('Supabase Error:', supabaseError.message);
        setSuccessMessage('There was an issue updating your property. Please try again.');
      } else {
        setSuccessMessage('Property updated successfully!');
        setSubmitSuccess(true);
        onSubmit(property, data ? data[0] : { ...property, ...propertyData });
      }
    } catch (err) {
      console.error('Error updating property:', err);
      setSuccessMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-900">Edit Property</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

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

          {/* Property Details */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-900">
              Property Details
            </label>
            <textarea
              name="accDetails"
              value={formData.accDetails}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Describe your property, including features, environment, nearby facilities, and any important information for potential tenants."
              rows={5}
              required
            />
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
                  Updating Property...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyForm;