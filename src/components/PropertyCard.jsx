import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import supabase from '../supabaseClient';
import PropertyCard from './PropertyCard';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  
  // Default placeholder - ensure this asset exists in your public directory
  const defaultPlaceholder = '/images/placeholder.jpg'; 
  
  // Built-in SVG fallback as base64 (guaranteed to work)
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTUwLjUgOTZDMTIzLjcgOTYgMTAyIDExNy43IDEwMiAxNDQuNUMxMDIgMTcxLjMgMTIzLjcgMTkzIDE1MC41IDE5M0MxNzcuMyAxOTMgMTk5IDE3MS4zIDE5OSAxNDQuNUMxOTkgMTE3LjcgMTc3LjMgOTYgMTUwLjUgOTZaTTE1MC41IDE4NC4zQzEyOC41IDE4NC4zIDExMC43IDE2Ni41IDExMC43IDE0NC41QzExMC43IDEyMi41IDEyOC41IDEwNC43IDE1MC41IDEwNC43QzE3Mi41IDEwNC43IDE5MC4zIDEyMi41IDE5MC4zIDE0NC41QzE5MC4zIDE2Ni41IDE3Mi41IDE4NC4zIDE1MC41IDE4NC4zWk0xNTYuMyAxNjcuNEgxNDQuOFYxNTMuMkgxMzAuNlYxNDEuN0gxNDQuOFYxMjcuNUgxNTYuM1YxNDEuN0gxNzAuNVYxNTMuMkgxNTYuM1YxNjcuNFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('accommodation')
          .select('*');
          
        if (error) throw error;
        
        // Initialize the current image index for each property
        const initialImageIndices = {};
        data.forEach(prop => {
          initialImageIndices[prop.acc_id] = 0;
        });
        setCurrentImageIndex(initialImageIndices);
        
        // Process property data and validate image URLs
        const processedData = data.map(prop => {
          // Process amenities
          let parsedAmenities = [];
          if (prop.amenities) {
            try {
              parsedAmenities = typeof prop.amenities === 'string' ? 
                JSON.parse(prop.amenities) : 
                prop.amenities;
            } catch (e) {
              parsedAmenities = typeof prop.amenities === 'string' ?
                prop.amenities.split(',').map(item => item.trim()) :
                [];
            }
          }
          
          // Process payment methods
          let parsedPaymentMethods = [];
          if (prop.payment_methods) {
            try {
              parsedPaymentMethods = typeof prop.payment_methods === 'string' ?
                JSON.parse(prop.payment_methods) :
                prop.payment_methods;
            } catch (e) {
              parsedPaymentMethods = typeof prop.payment_methods === 'string' ?
                prop.payment_methods.split(',').map(item => item.trim()) :
                [];
            }
          }
          
          // Process image URLs to handle arrays or strings
          let imageUrls = [];
          
          // Check if image_url is an array
          if (Array.isArray(prop.image_url)) {
            imageUrls = prop.image_url.map(url => validateImageUrl(url));
          }
          // Check if it's a string that might be JSON
          else if (typeof prop.image_url === 'string') {
            try {
              // Try to parse as JSON if it starts with [ or {
              if (prop.image_url.trim().startsWith('[') || prop.image_url.trim().startsWith('{')) {
                const parsedImages = JSON.parse(prop.image_url);
                imageUrls = Array.isArray(parsedImages) ? 
                  parsedImages.map(url => validateImageUrl(url)) : 
                  [validateImageUrl(prop.image_url)];
              } else {
                // Just a regular string URL
                imageUrls = [validateImageUrl(prop.image_url)];
              }
            } catch (e) {
              // If parsing fails, treat as a single URL
              imageUrls = [validateImageUrl(prop.image_url)];
            }
          }
          
          // Ensure we always have at least one image (even if it's the fallback)
          if (imageUrls.length === 0) {
            imageUrls = [defaultPlaceholder];
          }
          
          return {
            ...prop,
            id: prop.acc_id, // Map acc_id to id for PropertyCard compatibility
            parsedAmenities,
            parsedPaymentMethods,
            imageUrls
          };
        });
        
        setProperties(processedData || []);
      }
      catch(error) {
        console.error('Error fetching properties', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  // Helper function to validate and format image URLs
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

  // Handle favorite toggle
  const handleFavoriteToggle = (propertyId) => {
    setFavorites(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  // Handle image navigation
  const handleImageChange = (propertyId, direction) => {
    setCurrentImageIndex(prev => {
      const property = properties.find(p => p.id === propertyId);
      if (!property || !property.imageUrls || property.imageUrls.length <= 1) return prev;
      
      const currentIndex = prev[propertyId] || 0;
      const totalImages = property.imageUrls.length;
      
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % totalImages;
      } else {
        newIndex = (currentIndex - 1 + totalImages) % totalImages;
      }
      
      return {
        ...prev,
        [propertyId]: newIndex
      };
    });
  };

  // Handle image loading errors
  const handleImageError = (propertyId) => {
    console.log("Image failed to load, using fallback");
    
    // Reset the current image index for this property
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: 0
    }));
    
    // Update the property's image URLs to just use the fallback
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId 
          ? { ...prop, imageUrls: [fallbackImage] } 
          : prop
      )
    );
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden animate-pulse shadow-md">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded-full w-3/4" />
            <div className="h-4 bg-gray-200 rounded-full w-1/2" />
            <div className="h-4 bg-gray-200 rounded-full w-full" />
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded-full w-1/3" />
              <div className="h-8 bg-gray-200 rounded-full w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="p-4 md:p-8 text-center">
      <div className="bg-red-50 p-6 rounded-lg inline-block shadow-sm">
        <p className="text-red-600 font-medium">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-12 rounded-lg bg-gray-50 shadow-sm">
      <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">No Properties Available</h3>
      <p className="text-gray-500">We don't have any featured properties at the moment.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors inline-flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>
  );

  return (
    <div className="w-full px-4 md:px-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
        <Link 
          to="/properties" 
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          View all
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {/* Content */}
      {loading && <LoadingSkeleton />}
      
      {error && <ErrorState />}
      
      {!loading && !error && properties.length === 0 && <EmptyState />}
      
      {!loading && !error && properties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              currentImageIndex={currentImageIndex[property.id] || 0}
              isFavorite={favorites[property.id] || false}
              onImageChange={handleImageChange}
              onFavoriteToggle={handleFavoriteToggle}
              onImageError={handleImageError}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;