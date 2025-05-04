import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

const PropertyImageGrid = ({ images, defaultPlaceholder, fallbackImage }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  // Function to handle image loading errors
  const handleImageError = (e) => {
    console.log("Image failed to load, using fallback");
    e.target.onerror = null; // Prevent infinite loop
    
    // Try the default placeholder first
    e.target.src = defaultPlaceholder;
    
    // If the placeholder also fails, use the base64 fallback
    e.target.onerror = () => {
      console.log("Placeholder also failed, using base64 fallback");
      e.target.src = fallbackImage;
    };
  };

  // Open lightbox with selected image
  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setShowLightbox(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setShowLightbox(false);
  };

  // Navigate to previous image in lightbox
  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Navigate to next image in lightbox
  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full">
      {/* Main Image */}
      <div 
        className="relative w-full h-64 md:h-80 cursor-pointer overflow-hidden rounded-lg"
        onClick={() => openLightbox(0)}
      >
        <img 
          src={images[0]} 
          alt="Property main view" 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          View all {images.length} photos
        </div>
        <button 
          className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-full text-gray-700 hover:bg-white shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(0);
          }}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.slice(1, 5).map((image, index) => (
            <div 
              key={index + 1} 
              className="relative h-20 md:h-28 cursor-pointer overflow-hidden rounded-lg"
              onClick={() => openLightbox(index + 1)}
            >
              <img 
                src={image} 
                alt={`Property view ${index + 2}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
              />
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-medium text-sm md:text-base">+{images.length - 5}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-4xl max-h-screen p-4">
            <img 
              src={images[selectedImageIndex]} 
              alt={`Property view ${selectedImageIndex + 1}`} 
              className="w-full h-full object-contain"
              onError={handleImageError}
            />
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 px-3 py-1 rounded-full text-white text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImageGrid;