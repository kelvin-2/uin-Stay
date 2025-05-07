import React, { useState } from "react";
import { SearchBox } from "./SearchBox";
import PropertyCard from "./PropertyCard";
import { createClient } from "@supabase/supabase-js";
import { Home } from 'lucide-react';

// Initialize Supabase client
// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Default placeholder - ensure this asset exists in your public directory
  const defaultPlaceholder = '/images/placeholder.jpg'; 
  
  // Built-in SVG fallback as base64 (guaranteed to work)
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTUwLjUgOTZDMTIzLjcgOTYgMTAyIDExNy43IDEwMiAxNDQuNUMxMDIgMTcxLjMgMTIzLjcgMTkzIDE1MC41IDE5M0MxNzcuMyAxOTMgMTk5IDE3MS4zIDE5OSAxNDQuNUMxOTkgMTE3LjcgMTc3LjMgOTYgMTUwLjUgOTZaTTE1MC41IDE4NC4zQzEyOC41IDE4NC4zIDExMC43IDE2Ni41IDExMC43IDE0NC41QzExMC43IDEyMi41IDEyOC41IDEwNC43IDE1MC41IDEwNC43QzE3Mi41IDEwNC43IDE5MC4zIDEyMi41IDE5MC4zIDE0NC41QzE5MC4zIDE2Ni41IDE3Mi41IDE4NC4zIDE1MC41IDE4NC4zWk0xNTYuMyAxNjcuNEgxNDQuOFYxNTMuMkgxMzAuNlYxNDEuN0gxNDQuOFYxMjcuNUgxNTYuM1YxNDEuN0gxNzAuNVYxNTMuMkgxNTYuM1YxNjcuNFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

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

  // Function to handle image errors
  const handleImageError = (propertyId) => {
    console.log(`Image error for property ${propertyId}, using fallback`);
    
    // Reset the current image index for this property
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: 0
    }));
    
    // Update the property's image URLs to just use the fallback
    setSearchResults(prev => 
      prev.map(prop => 
        prop.id === propertyId 
          ? { ...prop, imageUrls: [fallbackImage] } 
          : prop
      )
    );
  };

  // Navigate through property images
  const handleImageChange = (propertyId, direction) => {
    setCurrentImageIndex(prev => {
      const property = searchResults.find(p => p.id === propertyId);
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

  // Toggle favorite status
  const toggleFavorite = (propertyId) => {
    setFavorites(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  const handleSearch = async (searchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Start with a base query
      let query = supabase
        .from('accommodation')
        .select('*');
      
      // Add filters based on search parameters
      if (searchParams.location) {
        query = query.ilike('location', `%${searchParams.location}%`);
      }
      
      if (searchParams.paymentMethod) {
        query = query.ilike('payment_methods', `%${searchParams.paymentMethod}%`);
      }
      
      if (searchParams.priceRange && searchParams.priceRange.length === 2) {
        query = query
          .gte('monthly_rent', searchParams.priceRange[0])
          .lte('monthly_rent', searchParams.priceRange[1]);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Process the results
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

        // Initialize current image indices
        setCurrentImageIndex(prev => ({
          ...prev,
          [prop.acc_id]: 0
        }));
        
        return {
          ...prop,
          id: prop.acc_id, // Map acc_id to id for consistency
          parsedAmenities,
          parsedPaymentMethods,
          imageUrls
        };
      });
      
      setSearchResults(processedData || []);
    } catch (err) {
      console.error("Error searching properties:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative -mt-10 mb-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <SearchBox onSearch={handleSearch} />
          
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Searching properties...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-4">
              <p className="font-medium">Error searching properties</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {!isLoading && !error && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Properties Found</h3>
              <p>No properties found matching your criteria. Try adjusting your search.</p>
            </div>
          )}
          
          {!isLoading && searchResults.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((property) => (
                <PropertyCard 
                  key={property.id}
                  property={property}
                  currentImageIndex={currentImageIndex[property.id] || 0}
                  isFavorite={favorites[property.id] || false}
                  onImageChange={handleImageChange}
                  onFavoriteToggle={toggleFavorite}
                  onImageError={handleImageError}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;