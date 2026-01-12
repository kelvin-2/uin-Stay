import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Home, Heart, Clock, Shield, Wifi, 
  ImageOff, ChevronLeft, ChevronRight
} from 'lucide-react';
import { get_all_accomodation } from '../api/accomodationApi';
import SearchBox from './SearchBox';
import SearchFilter from './SearchFilter';
import { PaymentOptions } from './property-card/PaymentOptions';
import { ImageSection } from './property-card/ImageSection';
import SEOHead from './SEOHead';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [activeFilters, setActiveFilters] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Show 9 items per page (3x3 grid)
  
  // Default placeholder
  const defaultPlaceholder = '/images/placeholder.jpg'; 
  
  // Built-in SVG fallback as base64
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTUwLjUgOTZDMTIzLjcgOTYgMTAyIDExNy43IDEwMiAxNDQuNUMxMDIgMTcxLjMgMTIzLjcgMTkzIDE1MC41IDE5M0MxNzcuMyAxOTMgMTk5IDE3MS4zIDE5OSAxNDQuNUMxOTkgMTE3LjcgMTc3LjMgOTYgMTUwLjUgOTZaTTE1MC41IDE4NC4zQzEyOC41IDE4NC4zIDExMC43IDE2Ni41IDExMC43IDE0NC41QzExMC43IDEyMi41IDEyOC41IDEwNC43IDE1MC41IDEwNC43QzE3Mi41IDEwNC43IDE5MC4zIDEyMi41IDE5MC4zIDE0NC41QzE5MC4zIDE2Ni41IDE3Mi41IDE4NC4zIDE1MC41IDE4NC4zWk0xNTYuMyAxNjcuNEgxNDQuOFYxNTMuMkgxMzAuNlYxNDEuN0gxNDQuOFYxMjcuNUgxNTYuM1YxNDEuN0gxNzAuNVYxNTMuMkgxNTYuM1YxNjcuNFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=';

  // SEO helper functions
  const generateSEOTitle = () => {
    const filterCount = Object.keys(activeFilters).length;
    const resultCount = filteredProperties.length;
    
    if (filterCount > 0) {
      const locationFilter = activeFilters.location;
      const priceFilter = activeFilters.priceRange;
      
      let title = "Student Accommodation";
      
      if (locationFilter) {
        title += ` in ${locationFilter}`;
      }
      
      if (priceFilter) {
        title += ` from R${priceFilter.min.toLocaleString()} - R${priceFilter.max.toLocaleString()}`;
      }
      
      title += ` | ${resultCount} Properties | UniStay`;
      return title;
    }
    
    return `Featured Student Properties | ${properties.length} Available | UniStay`;
  };

  const generateSEODescription = () => {
    const filterCount = Object.keys(activeFilters).length;
    const resultCount = filteredProperties.length;
    
    if (filterCount > 0) {
      const locationFilter = activeFilters.location;
      const paymentFilter = activeFilters.paymentMethod;
      
      let description = `Find ${resultCount} student accommodation properties`;
      
      if (locationFilter) {
        description += ` in ${locationFilter}`;
      }
      
      if (paymentFilter) {
        description += ` accepting ${paymentFilter} payments`;
      }
      
      description += ". Browse verified listings, compare prices, and secure your student housing today.";
      return description;
    }
    
    return `Browse ${properties.length} featured student accommodation properties. Find verified listings near universities, compare prices, and secure your perfect student housing with UniStay.`;
  };

  const generateSEOKeywords = () => {
    const baseKeywords = ["student accommodation", "student housing", "university housing", "student properties"];
    
    if (activeFilters.location) {
      baseKeywords.push(`student accommodation ${activeFilters.location}`);
      baseKeywords.push(`student housing ${activeFilters.location}`);
    }
    
    if (activeFilters.paymentMethod) {
      baseKeywords.push(`${activeFilters.paymentMethod} student accommodation`);
    }
    
    const locations = [...new Set(filteredProperties.map(p => p.location).filter(Boolean))];
    locations.slice(0, 3).forEach(location => {
      baseKeywords.push(`student accommodation ${location}`);
    });
    
    return baseKeywords.join(", ");
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Use the API endpoint
        const response = await get_all_accomodation();
        
        console.log("API Response:", response);
        
        // Check if the response has an error
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Get the data from the response - handle the 'property' key from your API
        const data = response.property || response.data || response;
        
        console.log("Data extracted:", data);
        
        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [data];
        
        // Initialize the current image index for each property
        const initialImageIndices = {};
        dataArray.forEach(prop => {
          initialImageIndices[prop.id] = 0;
        });
        setCurrentImageIndex(initialImageIndices);
        
        // Process property data and validate image URLs
        const processedData = dataArray.map(prop => {
          // Process amenities
          let parsedAmenities = [];
          if (prop.amenities) {
            parsedAmenities = Array.isArray(prop.amenities) ? prop.amenities : [];
          }
          
          // Process payment methods
          let parsedPaymentMethods = [];
          if (prop.paymentMethods) {
            parsedPaymentMethods = Array.isArray(prop.paymentMethods) ? prop.paymentMethods : [];
          }
          
          // Process image URLs - your API returns 'images' array
          let imageUrls = [];
          
          if (Array.isArray(prop.images)) {
            imageUrls = prop.images.map(url => validateImageUrl(url));
          } else if (prop.images && typeof prop.images === 'string') {
            imageUrls = [validateImageUrl(prop.images)];
          }
          
          // Ensure we always have at least one image
          if (imageUrls.length === 0) {
            imageUrls = [defaultPlaceholder];
          }
          
          return {
            acc_id: prop.id,
            title: prop.title,
            address: prop.address,
            description: prop.accDetails,
            max_occupants: prop.maxOccupants,
            deposit: prop.deposit,
            user_id: prop.userId,
            monthly_rent: prop.monthlyRent,
            room_type: prop.roomType,
            location: prop.location,
            is_verified: prop.isVerified,
            created_at: prop.createdAt,
            updated_at: prop.updatedAt,
            status: 'available',
            parsedAmenities,
            parsedPaymentMethods,
            imageUrls
          };
        });
        
        console.log("Processed data:", processedData);
        setProperties(processedData || []);
        setFilteredProperties(processedData || []);
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

  // Filter properties based on active filters
  useEffect(() => {
    let filtered = [...properties];

    // Filter by payment method
    if (activeFilters.paymentMethod) {
      filtered = filtered.filter(property => {
        if (!property.parsedPaymentMethods || property.parsedPaymentMethods.length === 0) {
          return false;
        }
        return property.parsedPaymentMethods.some(method => 
          method.toLowerCase().includes(activeFilters.paymentMethod.toLowerCase())
        );
      });
    }

    // Filter by location
    if (activeFilters.location) {
      filtered = filtered.filter(property => {
        const location = property.location || '';
        return location.toLowerCase().includes(activeFilters.location.toLowerCase());
      });
    }

    // Filter by price range
    if (activeFilters.priceRange) {
      filtered = filtered.filter(property => {
        const rent = property.monthly_rent || 0;
        return rent >= activeFilters.priceRange.min && rent <= activeFilters.priceRange.max;
      });
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [properties, activeFilters]);
  
  // Helper function to validate and format image URLs
  const validateImageUrl = (url) => {
    if (!url) return defaultPlaceholder;
    
    if (typeof url !== 'string') {
      console.warn(`Invalid image URL (not a string):`, url);
      return defaultPlaceholder;
    }
    
    if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/')) {
      return `/${url}`;
    }
    
    return url;
  };

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Navigate through property images
  const navigateImages = (e, propertyId, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    setCurrentImageIndex(prev => {
      const property = properties.find(p => p.acc_id === propertyId);
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

  // Function to handle image loading errors
  const handleImageError = (propertyId) => {
    console.log("Image failed to load, using fallback");
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: 0
    }));
    
    setProperties(prev => 
      prev.map(prop => 
        prop.acc_id === propertyId 
          ? { ...prop, imageUrls: [fallbackImage] } 
          : prop
      )
    );
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  // Generate structured data for properties
  const generateStructuredData = () => {
    if (filteredProperties.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Student Accommodation Properties",
      "description": generateSEODescription(),
      "numberOfItems": filteredProperties.length,
      "itemListElement": filteredProperties.slice(0, 10).map((property, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Accommodation",
          "@id": `https://yoursite.com/property/${property.acc_id}`,
          "name": property.location || "Student Accommodation",
          "description": `${property.room_type || 'Room'} in ${property.location || 'prime location'}`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": property.address,
            "addressLocality": property.location,
            "addressCountry": "ZA"
          },
          "priceRange": `R${property.monthly_rent || 2500}`,
          "image": property.imageUrls?.[0] || defaultPlaceholder,
          "amenityFeature": property.parsedAmenities?.map(amenity => ({
            "@type": "LocationFeatureSpecification",
            "name": amenity
          })) || []
        }
      }))
    };
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  // Pagination handlers
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <>
        <SEOHead
          title="Loading Student Properties | UniStay"
          description="Loading featured student accommodation properties. Find verified listings near universities."
          keywords="student accommodation, student housing, loading properties"
        />
        <div className="w-full px-4 md:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Properties</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
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
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead
          title="Error Loading Properties | UniStay"
          description="Error loading student accommodation properties. Please try again."
          keywords="student accommodation, error, reload"
        />
        <div className="w-full px-4 md:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Properties</h1>
          </div>
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
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={generateSEOTitle()}
        description={generateSEODescription()}
        keywords={generateSEOKeywords()}
        url="https://yoursite.com/properties"
        image={filteredProperties[0]?.imageUrls?.[0] || "/og-properties.jpg"}
        structuredData={generateStructuredData()}
      />
      
      <div className="w-full px-4 md:px-0 pt-20 md:pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Properties</h1>
        </div>
        
        {/* Search Filter Component */}
        <SearchFilter 
          onFilterChange={handleFilterChange} 
          activeFilters={activeFilters}
        />
        
        {filteredProperties.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProperties.length)} of {filteredProperties.length} properties
              </p>
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProperties.map((accommodation) => (
                <div key={accommodation.acc_id} className="group relative">
                  <Link 
                    to={`/property/${accommodation.acc_id}`}
                    className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative transform hover:-translate-y-1"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        {accommodation.status === 'booked' ? 'Booked' : 'Available Now'}
                      </span>
                    </div>

                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      <ImageSection 
                        imageUrls={accommodation.imageUrls}
                        currentIndex={currentImageIndex[accommodation.acc_id] || 0}
                        onNavigate={(e, direction) => navigateImages(e, accommodation.acc_id, direction)}
                        onError={() => handleImageError(accommodation.acc_id)}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {accommodation.location || accommodation.title || 'Student Accommodation'}
                      </h2>

                      <div className="flex items-start gap-1.5 text-gray-600 mb-3">
                        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span className="text-xs line-clamp-2">{accommodation.address || 'Address not specified'}</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            R{accommodation.monthly_rent ? accommodation.monthly_rent.toLocaleString() : '2,500'}
                          </span>
                          <span className="text-sm text-gray-500">/month</span>
                        </div>
                        
                        {accommodation.deposit > 0 && (
                          <div className="bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-lg border border-amber-200">
                            R{accommodation.deposit.toLocaleString()} deposit
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                          <Home className="w-5 h-5 text-gray-700 mb-1" />
                          <span className="text-xs text-gray-700">{accommodation.room_type || 'Room'}</span>
                        </div>
                        {accommodation.parsedAmenities && accommodation.parsedAmenities.includes('Security') ? (
                          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                            <Shield className="w-5 h-5 text-gray-700 mb-1" />
                            <span className="text-xs text-gray-700">Secure</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                            <Clock className="w-5 h-5 text-gray-700 mb-1" />
                            <span className="text-xs text-gray-700">24/7</span>
                          </div>
                        )}
                        {accommodation.parsedAmenities && accommodation.parsedAmenities.includes('Wi-Fi') ? (
                          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                            <Wifi className="w-5 h-5 text-gray-700 mb-1" />
                            <span className="text-xs text-gray-700">WiFi</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                            <Wifi className="w-5 h-5 text-gray-700 mb-1" />
                            <span className="text-xs text-gray-700">WiFi</span>
                          </div>
                        )}
                      </div>

                      <PaymentOptions methods={accommodation.parsedPaymentMethods} />

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg transition-colors duration-300 mt-1">
                        View Details
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 mb-12">
                <div className="flex justify-center items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Page Info */}
                <p className="text-center text-sm text-gray-600 mt-4">
                  Showing page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 rounded-lg bg-gray-50 shadow-sm">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {Object.keys(activeFilters).length > 0 ? 'No Properties Match Your Filters' : 'No Properties Available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {Object.keys(activeFilters).length > 0 
                ? 'Try adjusting your filter criteria to see more results.' 
                : 'We don\'t have any featured properties at the moment.'
              }
            </p>
            {Object.keys(activeFilters).length > 0 ? (
              <button 
                onClick={() => setActiveFilters({})}
                className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors inline-flex items-center gap-2"
              >
                Clear Filters
              </button>
            ) : (
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Properties;