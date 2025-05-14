import React, { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import supabase from "../supabaseClient";
import { Home, AlertCircle } from 'lucide-react';

function SearchResults({ searchParams }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);

  const defaultPlaceholder = '/images/placeholder.jpg';
  const fallbackImage = 'data:image/svg+xml;base64,...'; // shortened for readability

  useEffect(() => {
    if (searchParams) {
      handleSearch(searchParams);
    } else {
      loadAllProperties(); // default
    }
  }, [searchParams]);
  
  const loadAllProperties = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('accommodation')
        .select('*')
        .limit(50);

      if (error) throw error;

      const processedData = (data || []).map(processPropertyData);

      setSearchResults(processedData);
      setCurrentImageIndex(initializeImageIndices(processedData));
    } catch (err) {
      console.error("Error loading properties:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchParams) => {
    setIsLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      let query = supabase.from('accommodation').select('*');

      if (searchParams.location?.trim()) {
        query = query.ilike('location', `%${searchParams.location.trim()}%`);
      }
      if (searchParams.paymentMethod?.trim()) {
        query = query.ilike('payment_methods', `%${searchParams.paymentMethod.trim()}%`);
      }
      if (
        Array.isArray(searchParams.priceRange) &&
        (searchParams.priceRange[0] != null || searchParams.priceRange[1] != null)
      ) {
        if (searchParams.priceRange[0] != null) {
          query = query.gte('monthly_rent', searchParams.priceRange[0]);
        }
        if (searchParams.priceRange[1] != null) {
          query = query.lte('monthly_rent', searchParams.priceRange[1]);
        }
      }

      const { data, error: queryError } = await query;
      if (queryError) throw new Error(`Search error: ${queryError.message}`);

      const processedData = (data || []).map(processPropertyData);
      setSearchResults(processedData);
      setCurrentImageIndex(initializeImageIndices(processedData));
    } catch (err) {
      console.error("Error searching properties:", err);
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeImageIndices = (properties) => {
    const indices = {};
    properties.forEach((prop) => {
      indices[prop.id] = 0;
    });
    return indices;
  };

  const validateImageUrl = (url) => {
    if (!url) return defaultPlaceholder;
    if (typeof url !== 'string') return defaultPlaceholder;
    if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/')) {
      return `/${url}`;
    }
    return url;
  };

  const processPropertyData = (rawProp) => {
    let parsedAmenities = [];
    if (rawProp.amenities) {
      try {
        parsedAmenities = typeof rawProp.amenities === 'string'
          ? JSON.parse(rawProp.amenities)
          : rawProp.amenities;
      } catch {
        parsedAmenities = rawProp.amenities.split(',').map((a) => a.trim());
      }
    }

    let parsedPaymentMethods = [];
    if (rawProp.payment_methods) {
      try {
        parsedPaymentMethods = typeof rawProp.payment_methods === 'string'
          ? JSON.parse(rawProp.payment_methods)
          : rawProp.payment_methods;
      } catch {
        parsedPaymentMethods = rawProp.payment_methods.split(',').map((p) => p.trim());
      }
    }

    let imageUrls = [];
    if (Array.isArray(rawProp.image_url)) {
      imageUrls = rawProp.image_url.map(validateImageUrl);
    } else if (typeof rawProp.image_url === 'string') {
      try {
        const parsed = JSON.parse(rawProp.image_url);
        imageUrls = Array.isArray(parsed)
          ? parsed.map(validateImageUrl)
          : [validateImageUrl(rawProp.image_url)];
      } catch {
        imageUrls = rawProp.image_url.includes(',')
          ? rawProp.image_url.split(',').map((url) => validateImageUrl(url.trim()))
          : [validateImageUrl(rawProp.image_url)];
      }
    }

    if (imageUrls.length === 0) {
      imageUrls = [defaultPlaceholder];
    }

    return {
      ...rawProp,
      id: rawProp.acc_id,
      parsedAmenities,
      parsedPaymentMethods,
      imageUrls,
    };
  };

  const handleImageChange = (propertyId, direction) => {
    setCurrentImageIndex((prev) => {
      const property = searchResults.find((p) => p.id === propertyId);
      if (!property?.imageUrls || property.imageUrls.length <= 1) return prev;

      const currentIndex = prev[propertyId] || 0;
      const totalImages = property.imageUrls.length;
      const newIndex = direction === 'next'
        ? (currentIndex + 1) % totalImages
        : (currentIndex - 1 + totalImages) % totalImages;

      return { ...prev, [propertyId]: newIndex };
    });
  };

  const handleImageError = (propertyId) => {
    setCurrentImageIndex((prev) => ({ ...prev, [propertyId]: 0 }));
    setSearchResults((prev) =>
      prev.map((prop) =>
        prop.id === propertyId
          ? { ...prop, imageUrls: [fallbackImage] }
          : prop
      )
    );
  };

  const toggleFavorite = (propertyId) => {
    setFavorites((prev) => ({ ...prev, [propertyId]: !prev[propertyId] }));
  };

  return (
    <div className="relative -mt-10 mb-10">
      <div className="mx-auto max-w-6xl px-4">
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent" />
            <p className="mt-2 text-gray-600">Loading properties...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Error searching properties</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && searchResults.length === 0 && searchPerformed && (
          <div className="text-center py-8 text-gray-500">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Properties Found</h3>
            <p>Try adjusting your search criteria.</p>
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
                onImageError={() => handleImageError(property.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
