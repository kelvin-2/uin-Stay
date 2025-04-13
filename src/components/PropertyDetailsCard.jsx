import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  BedDouble,
  Bath,
  Home,
  Calendar,
  Wifi,
  Car,
  Utensils,
  Lock,
  ThermometerSun,
  Sofa,
  Phone,
  Camera,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Star,
  DollarSign,
  Shield,
  CreditCard,
  GraduationCap,
  BadgeDollarSign,
  Wallet,
  ArrowLeft
} from 'lucide-react';
import supabase from '../supabaseClient';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showRatingMessage, setShowRatingMessage] = useState(false);
  
  // Get the images array from the property or use a placeholder
  const images = property?.image_url 
    ? [property.image_url] 
    : ['/images/placeholder.jpg'];
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('accommodation')
          .select('*')
          .eq('acc_id', id)
          .single();
          
        if (error) throw error;
        
        // Process property data
        let parsedAmenities = [];
        if (data.amenities) {
          try {
            // Try to parse if it's a JSON string
            parsedAmenities = typeof data.amenities === 'string' ? 
              JSON.parse(data.amenities) : 
              data.amenities;
          } catch (e) {
            // If it's not JSON, split by commas
            parsedAmenities = data.amenities.split(',').map(item => item.trim());
          }
        }
        
        // Parse payment methods if available
        let parsedPaymentMethods = [];
        if (data.payment_methods) {
          try {
            parsedPaymentMethods = typeof data.payment_methods === 'string' ?
              JSON.parse(data.payment_methods) :
              data.payment_methods;
          } catch (e) {
            parsedPaymentMethods = data.payment_methods.split(',').map(item => item.trim());
          }
        }
        
        setProperty({
          ...data,
          parsedAmenities,
          parsedPaymentMethods
        });
      }
      catch(error) {
        console.error('Error fetching property details', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleWhatsAppContact = () => {
    const message = `Hey there! I saw your property "${property.location || 'Student Accommodation'}" at ${property.address || 'Address not specified'} on uinStay, and it looks perfect for me. Could you share any updates on its availability? Looking forward to your response!`;
    const whatsappUrl = `https://wa.me/${property.landlord_contact || ''}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleRating = (value) => {
    setRating(value);
    setShowRatingMessage(true);
    setTimeout(() => setShowRatingMessage(false), 3000);
  };

  const getPaymentMethodIcon = (method) => {
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
      <div className="max-w-4xl mx-auto p-4 mt-16 sm:mt-20 md:mt-24"> {/* Added responsive top margin */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
          <div className="h-64 md:h-96 bg-gray-200" /> {/* Responsive height */}
          <div className="p-4 md:p-6 space-y-4 md:space-y-6"> {/* Responsive padding */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-4 md:mb-6 gap-4">
              <div className="space-y-2 w-full md:w-auto">
                <div className="h-8 bg-gray-200 rounded-full w-full md:w-64" />
                <div className="h-4 bg-gray-200 rounded-full w-32 md:w-40" />
              </div>
              <div className="space-y-2 w-full md:w-auto mt-4 md:mt-0">
                <div className="h-8 bg-gray-200 rounded-full w-full md:w-32" />
                <div className="h-4 bg-gray-200 rounded-full w-24" />
              </div>
            </div>
            <div className="h-32 bg-gray-200 rounded-lg" />
            <div className="h-32 bg-gray-200 rounded-lg" />
            <div className="h-48 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-16 sm:mt-20 md:mt-24"> {/* Added responsive top margin */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="bg-red-50 p-4 md:p-6 rounded-2xl inline-block shadow-sm">
              <p className="text-red-600 font-medium">Error: {error}</p>
              <button 
                onClick={() => navigate('/properties')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
      <div className="max-w-4xl mx-auto p-4 mt-16 sm:mt-20 md:mt-24"> {/* Added responsive top margin */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="bg-yellow-50 p-4 md:p-6 rounded-2xl inline-block shadow-sm">
              <p className="text-yellow-700 font-medium">Property not found</p>
              <button 
                onClick={() => navigate('/properties')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pt-6 mt-16 sm:mt-20 md:mt-24"> {/* Added responsive top margin and top padding */}
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Properties
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="relative h-64 md:h-96"> {/* Responsive height */}
          <img 
            src={images[currentImageIndex]}
            alt={`Property view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder.jpg';
            }}
          />
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 p-1 md:p-2 rounded-full shadow hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 p-1 md:p-2 rounded-full shadow hover:bg-white"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-white/80 px-2 py-1 rounded-lg text-xs md:text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 md:top-4 left-2 md:left-4 z-10">
            <span className="bg-blue-600 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg">
              Available Now
            </span>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Header Information */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.location || 'Student Accommodation'}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm md:text-base">{property.address || 'Address not specified'}</span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 md:p-4 rounded-xl w-full md:w-auto mt-2 md:mt-0">
              <div className="flex items-center mb-1">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-1" />
                <span className="text-xl md:text-2xl font-bold text-blue-700">
                  R{property.monthly_rent ? property.monthly_rent.toLocaleString() : 'N/A'}
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
              <span className="font-medium text-sm md:text-base">{property.room_type || 'Room'}</span>
              <span className="text-xs md:text-sm text-gray-600">Type</span>
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
              <Bath className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mb-1 md:mb-2" />
              <span className="font-medium text-sm md:text-base">{property.bathrooms || 'Shared'}</span>
              <span className="text-xs md:text-sm text-gray-600">Bathroom</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">About this property</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {property.description || 'No description provided for this property. Please contact the landlord for more information about this accommodation.'}
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

          {/* Rating Section */}
          <div className="mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Rate this Property</h2>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-0.5 md:p-1 cursor-pointer transition-colors"
                >
                  <Star
                    className={`w-6 h-6 md:w-8 md:h-8 ${
                      (hoveredRating && value <= hoveredRating) || (!hoveredRating && value <= rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {showRatingMessage && (
                <span className="ml-2 md:ml-4 text-green-600 font-medium text-xs md:text-sm">
                  Rating updated!
                </span>
              )}
            </div>
          </div>

          {/* Landlord Information */}
          <div className="border-t pt-4 md:pt-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Contact Landlord</h2>
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-sm md:text-base">{property.landlord_name || 'Property Owner'}</h3>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Usually responds within 24 hours</div>
                {property.landlord_rating && (
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-xs md:text-sm">{property.landlord_rating}</span>
                    <span className="text-gray-600 ml-1 text-xs md:text-sm">({property.landlord_reviews || 0} reviews)</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                {property.landlord_contact && (
                  <button
                    onClick={handleWhatsAppContact}
                    className="flex items-center justify-center px-3 md:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full text-sm md:text-base"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    Contact via WhatsApp
                  </button>
                )}
                {property.landlord_email && (
                  <a
                    href={`mailto:${property.landlord_email}?subject=Inquiry about ${property.location || 'Student Accommodation'}&body=Hello, I am interested in your property at ${property.address || 'Address not specified'}. Could you please provide more information about availability?`}
                    className="flex items-center justify-center px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full text-sm md:text-base mt-2 sm:mt-0"
                  >
                    <Phone className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
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