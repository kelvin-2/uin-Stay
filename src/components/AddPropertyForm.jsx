import React, { useState } from 'react';
import { X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { createAccommodationWithImages } from '../api/accommodationApi';

const AddPropertyForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    address: '',
    location: '',
    roomType: '',
    amenities: [],
    paymentMethods: [],
    images: [],
    depositAmount: '',
    monthlyRent: '',
    accDetails: '',
    maxOccupants: '1'
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const roomTypes = [
    "Studio",
    "Single",
    "Ensuite",
    "2 Shared room",
    "3 Shared room"
  ];

  const amenityOptions = [
    "WiFi",
    "Air Conditioning",
    "Washing Machine",
    "Parking",
    "Kitchen",
    "Study Area",
    "Security",
    "Furnished",
    "TV",
    "Gym"
  ];

  const paymentOptions = [
    "NSFAS", "BURSARY", "PRIVATE"
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
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage('');
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
    
    // Validate file count
    if (formData.images.length + files.length > 10) {
      setErrorMessage('Maximum 10 images allowed per property');
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrorMessage('Some files exceed 5MB limit');
      return;
    }

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    setErrorMessage('');
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewImages[index]);
    
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setErrorMessage('');
    setUploadProgress(0);
  
    try {
      // Prepare property data
      const propertyData = {
        address: formData.address.trim(),
        location: formData.location,
        roomType: formData.roomType,
        amenities: formData.amenities,
        paymentMethods: formData.paymentMethods,
        deposit: parseFloat(formData.depositAmount) || 0,
        monthlyRent: parseFloat(formData.monthlyRent),
        accDetails: formData.accDetails.trim(),
        maxOccupants: parseInt(formData.maxOccupants) || 1
      };
  
      // Upload images and create accommodation
      const response = await createAccommodationWithImages(
        propertyData,
        formData.images,
        (progress) => setUploadProgress(progress)
      );
      
      setSuccessMessage('Property added successfully!');
      setSubmitSuccess(true);
      
      // Clean up preview URLs
      previewImages.forEach(url => URL.revokeObjectURL(url));
      
      // Wait before closing to show success message
      setTimeout(() => {
        onSubmit(response.property);
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting property:', err);
      setErrorMessage(err.message || 'Failed to add property. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-blue-900">
                Property Images {formData.images.length > 0 && `(${formData.images.length}/10)`}
              </label>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <span className="text-sm text-blue-600">
                  Uploading: {uploadProgress}%
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
              {previewImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                             hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {formData.images.length < 10 && (
                <label className="w-24 h-24 flex flex-col items-center justify-center 
                               border-2 border-dashed border-blue-300 rounded-lg 
                               hover:border-blue-500 hover:bg-blue-50 transition-colors 
                               cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                  <span className="text-xs text-blue-500 mt-1">Add Image</span>
                  <input 
                    type="file" 
                    accept="image/jpeg,image/jpg,image/png,image/webp" 
                    multiple 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    disabled={isSubmitting}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Upload up to 10 images. Supported formats: JPEG, PNG, WebP (max 5MB each)
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-900">
              Property Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg 
                       focus:outline-none focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-200 transition-all"
              placeholder="e.g., 123 Main Street, Summerstrand"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-900">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg 
                       focus:outline-none focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-200 transition-all"
              required
              disabled={isSubmitting}
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
              Property Details <span className="text-red-500">*</span>
            </label>
            <textarea
              name="accDetails"
              value={formData.accDetails}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg 
                       focus:outline-none focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-200 transition-all resize-none"
              placeholder="Describe your property in detail. Include features, environment, nearby facilities, and any important information for potential tenants."
              rows={5}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Provide a detailed description to attract potential tenants
            </p>
          </div>

          {/* Room Type, Monthly Rent, and Max Occupants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900">
                Room Type <span className="text-red-500">*</span>
              </label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg 
                         focus:outline-none focus:border-blue-500 focus:ring-2 
                         focus:ring-blue-200 transition-all"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Type</option>
                {roomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900">
                Monthly Rent (R) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="monthlyRent"
                value={formData.monthlyRent}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg 
                         focus:outline-none focus:border-blue-500 focus:ring-2 
                         focus:ring-blue-200 transition-all"
                min="1"
                step="0.01"
                placeholder="3000"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900">
                Max Occupants <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxOccupants"
                value={formData.maxOccupants}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg 
                         focus:outline-none focus:border-blue-500 focus:ring-2 
                         focus:ring-blue-200 transition-all"
                min="1"
                max="10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Deposit Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-900">
              Deposit Amount (R) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="depositAmount"
              value={formData.depositAmount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg 
                       focus:outline-none focus:border-blue-500 focus:ring-2 
                       focus:ring-blue-200 transition-all"
              min="0"
              step="0.01"
              placeholder="3000"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-blue-900">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenityOptions.map(amenity => (
                <label 
                  key={amenity} 
                  className="flex items-center space-x-3 p-3 border-2 border-blue-50 
                           rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleCheckboxChange('amenities', amenity)}
                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
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
                <label 
                  key={payment} 
                  className="flex items-center space-x-3 p-3 border-2 border-blue-50 
                           rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods.includes(payment)}
                    onChange={() => handleCheckboxChange('paymentMethods', payment)}
                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-blue-900">{payment}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <span className="text-green-700 font-medium">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 border-2 border-blue-200 rounded-lg text-blue-700 
                       hover:bg-blue-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Processing...'}
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