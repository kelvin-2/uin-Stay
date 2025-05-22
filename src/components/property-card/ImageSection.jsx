import React from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

const fallbackImage = '/images/placeholder.jpg';

export const ImageSection = ({ imageUrls = [], currentIndex, onNavigate, onError }) => {
  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = fallbackImage;
    onError?.();
  };

  if (imageUrls.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gray-100">
        <ImageOff className="w-10 h-10 text-gray-400" />
        <p className="text-sm text-gray-500 ml-2">No image available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 overflow-hidden">
      <img
        src={imageUrls[currentIndex]}
        alt="Property"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={handleError}
      />
      {imageUrls.length > 1 && (
        <>
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1}/{imageUrls.length}
          </div>
          <button
            onClick={(e) => onNavigate(e, 'prev')}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 p-1 bg-black/30 hover:bg-black/50 rounded-full"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={(e) => onNavigate(e, 'next')}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1 bg-black/30 hover:bg-black/50 rounded-full"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
