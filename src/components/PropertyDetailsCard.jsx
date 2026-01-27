import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  BedDouble,
  Bath,
  Home,
  Wifi,
  Car,
  Utensils,
  Lock,
  ThermometerSun,
  Sofa,
  MessageCircle,
  DollarSign,
  Shield,
  CreditCard,
  GraduationCap,
  BadgeDollarSign,
  Wallet,
  ArrowLeft,
  Mail,
  Loader2
} from 'lucide-react';
import { getAccommodationById } from '../api/accomodationApi';
import PropertyImageGrid from '../components/PropertyImageGrid';
import ReactGA from 'react-ga4';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  
  // Define default placeholder image
  const defaultPlaceholder = '/images/placeholder.jpg';
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTA5MDkwIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🔥 Fetching property details for ID:", id);
        
        // Fetch from backend API
        const data = await getAccommodationById(id);
        console.log("✅ Property data received:", data);
        
        if (!data || !data.property) {
          throw new Error('No property data found');
        }
        
        const propertyData = data.property;
        
        // Process amenities
        let parsedAmenities = [];
        if (propertyData.amenities) {
          parsedAmenities = Array.isArray(propertyData.amenities) 
            ? propertyData.amenities 
            : [];
        }
        
        // Process payment methods
        let parsedPaymentMethods = [];
        if (propertyData.paymentMethods) {
          parsedPaymentMethods = Array.isArray(propertyData.paymentMethods)
            ? propertyData.paymentMethods
            : [];
        }
        
        // Process and validate image URLs
        const processedImages = processPropertyImages(propertyData);
        setImages(processedImages);
        
        // Set property data with mapped fields
        setProperty({
          ...propertyData,
          parsedAmenities,
          parsedPaymentMethods,
          // Map backend fields to frontend fields
          acc_id: propertyData.id,
          monthly_rent: propertyData.monthlyRent,
          acc_details: propertyData.accDetails,
          room_type: propertyData.roomType,
          max_occupants: propertyData.maxOccupants,
          payment_methods: propertyData.paymentMethods,
          is_verified: propertyData.isVerified
        });
        
      } catch(error) {
        console.error('❌ Error fetching property details:', error);
        setError(error.message || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  // Helper function to process property images
  const processPropertyImages = (propertyData) => {
    if (!propertyData || !propertyData.images) {
      return [defaultPlaceholder];
    }
    
    let imageUrls = [];
    
    // Handle array of image URLs from backend
    if (Array.isArray(propertyData.images)) {
      imageUrls = propertyData.images.map(url => validateImageUrl(url));
    } else if (typeof propertyData.images === 'string') {
      imageUrls = [validateImageUrl(propertyData.images)];
    }
    
    // If no valid images, use placeholder
    if (imageUrls.length === 0) {
      imageUrls = [defaultPlaceholder];
    }
    
    return imageUrls;
  };

  const validateImageUrl = (url) => {
    if (!url) return defaultPlaceholder;
    
    if (typeof url !== 'string') {
      console.warn(`Invalid image URL (not a string):`, url);
      return defaultPlaceholder;
    }
    
    // Check if image_url is a relative path that needs a prefix
    if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/')) {
      return `/${url}`;
    }
    
    return url;
  };

  const handleWhatsAppContact = () => {
    // Get phone number from property.users object
    const phoneNumber = property?.users?.phone_number || '';
    
    console.log('📞 Original phone number:', phoneNumber);
    
    // Remove all non-digit characters
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    
    console.log('📞 Formatted phone number:', formattedPhone);
    
    if (!formattedPhone) {
      alert("Sorry, landlord contact information is not available.");
      return;
    }
    
    // If the number doesn't start with country code, add South African code (27)
    if (!formattedPhone.startsWith('27') && formattedPhone.startsWith('0')) {
      formattedPhone = '27' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('27') && !formattedPhone.startsWith('0')) {
      formattedPhone = '27' + formattedPhone;
    }
    
    console.log('📞 Final WhatsApp number:', formattedPhone);
    
    // Track WhatsApp button click with Google Analytics
    ReactGA.event({
      action: 'whatsapp_contact_click',
      category: 'Property Interaction',
      label: `Property ID: ${property.acc_id || property.id}`,
      custom_dimension_1: property.acc_id || property.id,
      custom_dimension_2: property.location || 'Unknown Location',
      value: property.monthly_rent || property.monthlyRent || 0
    });
    
    // Also track as conversion
    ReactGA.event({
      action: 'contact_landlord',
      category: 'Conversion',
      label: `WhatsApp - ${property.location}`,
      custom_dimension_1: property.acc_id || property.id,
      custom_dimension_2: property.location || 'Unknown Location'
    });
    
    const message = `Hi there,

I came across your property in ${property.location || property.title || 'Student Accommodation'} at ${property.address || 'Address not specified'} on UniStay, and it looks like a great fit for me. I'd love to know if it's still available.

If possible, I'd also like to arrange a viewing at your convenience. Looking forward to your response!`;
    
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    console.log('🔗 WhatsApp URL:', whatsappUrl);
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  const getPaymentMethodIcon = (method) => {
    if (!method) return <DollarSign className="w-4 h-4 text-gray-600" />;
    
    const methodLower = method.toLowerCase();
    if (methodLower.includes('cash')) return <Wallet className="w-4 h-4 text-gray-600" />;
    if (methodLower.includes('card') || methodLower.includes('credit') || methodLower.includes('debit')) 
      return <CreditCard className="w-4 h-4 text-gray-600" />;
    if (methodLower.includes('bursary')) 
      return <GraduationCap className="w-4 h-4 text-gray-600" />;
    if (methodLower.includes('nsfas')) 
      return <BadgeDollarSign className="w-4 h-4 text-gray-600" />;
    return <DollarSign className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-16 sm:mt-20 md:mt-24">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 text-lg">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-16 sm:mt-20 md:mt-24">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="bg-red-50 p-4 md:p-6 rounded-2xl inline-block shadow-sm">
              <p className="text-red-600 font-medium mb-4">Error: {error}</p>
              <button 
                onClick={() => navigate('/landlord-properties')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-16 sm:mt-20 md:mt-24">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="bg-yellow-50 p-4 md:p-6 rounded-2xl inline-block shadow-sm">
              <p className="text-yellow-700 font-medium mb-4">Property not found</p>
              <button 
                onClick={() => navigate('/landlord-properties')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Combine first name and last name for landlord's full name
  const landlordName = property.users?.first_name && property.users?.last_name
    ? `${property.users.first_name} ${property.users.last_name}`
    : property.users?.first_name || property.users?.last_name || 'Property Owner';
  
  const landlordContact = property.users?.phone_number;
  const landlordEmail = property.users?.email;

  console.log('👤 Landlord Name:', landlordName);
  console.log('📞 Landlord Contact:', landlordContact);
  console.log('📧 Landlord Email:', landlordEmail);

  return (
    <div className="max-w-4xl mx-auto p-4 pt-6 mt-16 sm:mt-20 md:mt-24">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Properties
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Gallery using PropertyImageGrid */}
        <div className="relative">
          {/* Status Badge */}
          <div className="absolute top-2 md:top-4 left-2 md:left-4 z-10">
            <span className="bg-blue-600 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg">
              {property.is_verified ? 'Available Now' : 'Pending Verification'}
            </span>
          </div>
          
          <PropertyImageGrid 
            images={images} 
            defaultPlaceholder={defaultPlaceholder}
            fallbackImage={fallbackImage}
          />
        </div>

        <div className="p-4 md:p-6">
          {/* Header Information */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {property.location || property.title || 'Student Accommodation'}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm md:text-base">{property.address || 'Address not specified'}</span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 md:p-4 rounded-xl w-full md:w-auto mt-2 md:mt-0">
              <div className="flex items-center mb-1">
                <span className="text-xl md:text-2xl font-bold text-blue-700">
                  R{property.monthly_rent ? property.monthly_rent.toLocaleString() : 
                    property.monthlyRent ? property.monthlyRent.toLocaleString() : 'N/A'}
                </span>
                <span className="text-xs md:text-sm text-gray-600 ml-1">/month</span>
              </div>
              {property.deposit > 0 && (
                <div className="text-xs md:text-sm text-gray-700">
                  Deposit: R{property.deposit.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center p-2 md:p-3 bg-white rounded-lg shadow-sm">
              <Home className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mb-1 md:mb-2" />
              <span className="font-medium text-sm md:text-base">
                {property.room_type || property.roomType || 'Room'}
              </span>
              <span className="text-xs md:text-sm text-gray-600">Room</span>
            </div>
            <div className="flex flex-col items-center p-2 md:p-3 bg-white rounded-lg shadow-sm">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mb-1 md:mb-2" />
              <span className="font-medium text-sm md:text-base">Secure</span>
              <span className="text-xs md:text-sm text-gray-600">Property</span>
            </div>
            <div className="flex flex-col items-center p-2 md:p-3 bg-white rounded-lg shadow-sm">
              <Wifi className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mb-1 md:mb-2" />
              <span className="font-medium text-sm md:text-base">WiFi</span>
              <span className="text-xs md:text-sm text-gray-600">Included</span>
            </div>
            <div className="flex flex-col items-center p-2 md:p-3 bg-white rounded-lg shadow-sm">
              <BedDouble className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mb-1 md:mb-2" />
              <span className="font-medium text-sm md:text-base">
                {property.max_occupants || property.maxOccupants || 1}
              </span>
              <span className="text-xs md:text-sm text-gray-600">Max Occupants</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">About this property</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {property.acc_details || property.accDetails || 
               'No description provided for this property. Please contact the landlord for more information about this accommodation.'}
            </p>
          </div>

          {/* Amenities */}
          {property.parsedAmenities && property.parsedAmenities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {property.parsedAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-2 md:p-3 bg-gray-50 rounded-lg">
                    <div className="p-1.5 md:p-2 bg-blue-100 rounded-full mr-2 md:mr-3">
                      {amenity.toLowerCase().includes('wifi') ? (
                        <Wifi className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      ) : amenity.toLowerCase().includes('security') || amenity.toLowerCase().includes('safe') ? (
                        <Lock className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      ) : amenity.toLowerCase().includes('parking') || amenity.toLowerCase().includes('car') ? (
                        <Car className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      ) : amenity.toLowerCase().includes('kitchen') || amenity.toLowerCase().includes('cook') ? (
                        <Utensils className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      ) : amenity.toLowerCase().includes('air') || amenity.toLowerCase().includes('heat') ? (
                        <ThermometerSun className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      ) : amenity.toLowerCase().includes('furniture') || amenity.toLowerCase().includes('furnished') ? (
                        <Sofa className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      ) : (
                        <Home className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      )}
                    </div>
                    <span className="text-xs md:text-sm text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {property.parsedPaymentMethods && property.parsedPaymentMethods.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Payment Options</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {property.parsedPaymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center p-2 md:p-3 bg-gray-50 rounded-lg">
                    <div className="p-1.5 md:p-2 bg-green-100 rounded-full mr-2 md:mr-3">
                      {getPaymentMethodIcon(method)}
                    </div>
                    <span className="text-xs md:text-sm text-gray-700">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Landlord Information */}
          <div className="border-t pt-4 md:pt-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Contact Landlord</h2>
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-sm md:text-base">{landlordName}</h3>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Usually responds within 24 hours</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                {/* WhatsApp button */}
                <button
                  onClick={handleWhatsAppContact}
                  disabled={!landlordContact}
                  className={`flex items-center justify-center px-3 md:px-4 py-2 ${
                    landlordContact 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-green-300 cursor-not-allowed'
                  } text-white rounded-lg w-full text-sm md:text-base transition-colors`}
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  Contact via WhatsApp
                </button>
                
                {/* Email button */}
                {landlordEmail && (
                  
                  <a href={`mailto:${landlordEmail}?subject=Inquiry about ${property.location || property.title || 'Student Accommodation'}&body=Hello, I am interested in your property at ${property.address || 'Address not specified'}. Could you please provide more information about availability?`}
                    className="flex items-center justify-center px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full text-sm md:text-base mt-2 sm:mt-0 transition-colors"
                  >
                    <Mail className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    Email Landlord
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PropertyDetail;