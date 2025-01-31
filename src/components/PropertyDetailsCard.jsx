import React, { useState } from 'react';
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
  Star
} from 'lucide-react';

const PropertyDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showRatingMessage, setShowRatingMessage] = useState(false);
  
  
  const property = {
    id: 1,
    title: "Modern Studio near Campus",
    price: 750,
    location: "123 University Avenue, University District",
    type: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    size: "450 sq ft",
    furnished: true,
    description: "Modern and cozy studio apartment perfect for students. Recently renovated with new appliances and furniture. Great location with easy access to campus and public transportation.",
    availableFrom: "2025-02-15",
    leaseLength: "12 months",
    deposit: 750,
    utilities: "Water and internet included",
    images: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ],
    amenities: [
      { icon: <Wifi />, name: "High-speed WiFi" },
      { icon: <Car />, name: "Parking Available" },
      { icon: <Utensils />, name: "Furnished Kitchen" },
      { icon: <Lock />, name: "Security System" },
      { icon: <ThermometerSun />, name: "Air Conditioning" },
      { icon: <Sofa />, name: "Furnished" }
    ],
    landlord: {
      name: "John Doe",
      phone: "+1234567890",
      responseTime: "Usually responds within 1 hour",
      rating: 4.8,
      reviews: 15
    },
    rules: [
      "No smoking",
      "No pets",
      "Quiet hours after 10 PM",
      "No parties or events"
    ]
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleWhatsAppContact = () => {
    const message = `Hey there! I saw your property "${property.title}" at ${property.location} on uinStay, and it looks perfect for me. Could you share any updates on its availability? Looking forward to your response!`;
    const whatsappUrl = `https://wa.me/${property.landlord.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleRating = (value) => {
    setRating(value);
    setShowRatingMessage(true);
    setTimeout(() => setShowRatingMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="relative h-96">
          <img 
            src={property.images[currentImageIndex]}
            alt={`Property view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 right-4 bg-white/80 px-2 py-1 rounded-lg text-sm">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>

        <div className="p-6">
          {/* Header Information */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">${property.price}/mo</div>
              <div className="text-sm text-gray-600">Deposit: ${property.deposit}</div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Rate this Property</h2>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 cursor-pointer transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoveredRating && value <= hoveredRating) || (!hoveredRating && value <= rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {showRatingMessage && (
                <span className="ml-4 text-green-600 font-medium">
                  Rating updated!
                </span>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <BedDouble className="w-5 h-5 mr-2 text-gray-600" />
              <span>{property.bedrooms} Bedroom</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-5 h-5 mr-2 text-gray-600" />
              <span>{property.bathrooms} Bathroom</span>
            </div>
            <div className="flex items-center">
              <Home className="w-5 h-5 mr-2 text-gray-600" />
              <span>{property.size}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">About this property</h2>
            <p className="text-gray-600">{property.description}</p>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Availability</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                <div>
                  <div className="font-medium">Available From</div>
                  <div className="text-gray-600">{property.availableFrom}</div>
                </div>
              </div>
              <div>
                <div className="font-medium">Lease Length</div>
                <div className="text-gray-600">{property.leaseLength}</div>
              </div>
            </div>
          </div>

          {/* Rest of the components... */}
          {/* Amenities */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-2 text-gray-600">{amenity.icon}</span>
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">House Rules</h2>
            <ul className="list-disc list-inside text-gray-600">
              {property.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Landlord Information */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Contact Landlord</h2>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{property.landlord.name}</h3>
                <div className="text-sm text-gray-600 mt-1">{property.landlord.responseTime}</div>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{property.landlord.rating}</span>
                  <span className="text-gray-600 ml-1">({property.landlord.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleWhatsAppContact}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;