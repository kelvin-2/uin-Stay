import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Home, Heart, Clock, Shield, Wifi, 
  ImageOff, ChevronLeft, ChevronRight, Star, 
  Wallet, CreditCard, GraduationCap, BadgeDollarSign, DollarSign
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
  const [itemsPerPage] = useState(9);
  
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

  const getPaymentMethodIcon = (method) => {
    if (!method) return <DollarSign className="w-3 h-3" />;
    
    const methodLower = method.toLowerCase();
    if (methodLower.includes('cash') || methodLower.includes('private')) 
      return <Wallet className="w-3 h-3" />;
    if (methodLower.includes('card') || methodLower.includes('credit') || methodLower.includes('debit')) 
      return <CreditCard className="w-3 h-3" />;
    if (methodLower.includes('bursary')) 
      return <GraduationCap className="w-3 h-3" />;
    if (methodLower.includes('nsfas')) 
      return <BadgeDollarSign className="w-3 h-3" />;
    return <DollarSign className="w-3 h-3" />;
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        const response = await get_all_accomodation();
        
        console.log("API Response:", response);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        const data = response.property || response.data || response;
        
        console.log("Data extracted:", data);
        
        const dataArray = Array.isArray(data) ? data : [data];
        
        const initialImageIndices = {};
        dataArray.forEach(prop => {
          initialImageIndices[prop.id] = 0;
        });
        setCurrentImageIndex(initialImageIndices);
        
        const processedData = dataArray.map(prop => {
          let parsedAmenities = [];
          if (prop.amenities) {
            parsedAmenities = Array.isArray(prop.amenities) ? prop.amenities : [];
          }
          
          let parsedPaymentMethods = [];
          if (prop.paymentMethods) {
            parsedPaymentMethods = Array.isArray(prop.paymentMethods) ? prop.paymentMethods : [];
          }
          
          let imageUrls = [];
          
          if (Array.isArray(prop.images)) {
            imageUrls = prop.images.map(url => validateImageUrl(url));
          } else if (prop.images && typeof prop.images === 'string') {
            imageUrls = [validateImageUrl(prop.images)];
          }
          
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

    if (activeFilters.location) {
      filtered = filtered.filter(property => {
        const location = property.location || '';
        return location.toLowerCase().includes(activeFilters.location.toLowerCase());
      });
    }

    if (activeFilters.priceRange) {
      filtered = filtered.filter(property => {
        const rent = property.monthly_rent || 0;
        return rent >= activeFilters.priceRange.min && rent <= activeFilters.priceRange.max;
      });
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [properties, activeFilters]);
  
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

  const handleImageError = (e, propertyId) => {
    e.target.onerror = null;
    e.target.src = defaultPlaceholder;
    
    e.target.onerror = () => {
      e.target.src = fallbackImage;
    };
    
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

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

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
              <div key={index} className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl overflow-hidden animate-pulse shadow-2xl">
                <div className="h-48 bg-gradient-to-br from-blue-200/50 to-purple-200/50" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-white/50 rounded-full w-3/4" />
                  <div className="h-4 bg-white/50 rounded-full w-1/2" />
                  <div className="h-4 bg-white/50 rounded-full w-full" />
                  <div className="flex gap-2">
                    <div className="h-8 bg-white/50 rounded-full w-1/3" />
                    <div className="h-8 bg-white/50 rounded-full w-1/3" />
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
            <div className="backdrop-blur-xl bg-red-50/80 border border-red-200/50 p-6 rounded-3xl inline-block shadow-2xl">
              <p className="text-red-600 font-medium">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 backdrop-blur-md bg-red-100/80 border border-red-300/50 text-red-700 rounded-xl hover:bg-red-200/80 transition-all"
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
        
        <SearchFilter 
          onFilterChange={handleFilterChange} 
          activeFilters={activeFilters}
        />
        
        {filteredProperties.length > 0 ? (
          <>
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
                    className="block backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 relative transform hover:-translate-y-2 hover:bg-white/50"
                  >
                    {/* Glassmorphic Status Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="backdrop-blur-md bg-gradient-to-r from-blue-500/90 to-purple-500/90 border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {accommodation.status === 'booked' ? 'Booked' : 'Available Now'}
                      </span>
                    </div>

                    {/* Glassmorphic Favorite Button */}
                    <button 
                      onClick={(e) => toggleFavorite(e, accommodation.acc_id)}
                      className="absolute top-3 right-3 z-10 p-2.5 backdrop-blur-md bg-white/60 border border-white/40 hover:bg-white/80 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <Heart 
                        className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
                          favorites[accommodation.acc_id] ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-700'
                        }`} 
                      />
                    </button>

                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                        {accommodation.imageUrls && accommodation.imageUrls.length > 0 ? (
                          <>
                            <img
                              src={accommodation.imageUrls[currentImageIndex[accommodation.acc_id] || 0]}
                              alt={`${accommodation.address || 'Property'}`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => handleImageError(e, accommodation.acc_id)}
                            />
                            
                            {accommodation.imageUrls.length > 1 && (
                              <>
                                {/* Glassmorphic Image Counter */}
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-black/40 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                                  {(currentImageIndex[accommodation.acc_id] || 0) + 1}/{accommodation.imageUrls.length}
                                </div>
                                
                                {/* Glassmorphic Navigation Buttons */}
                                <button 
                                  onClick={(e) => navigateImages(e, accommodation.acc_id, 'prev')}
                                  className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white/50 rounded-full transition-all duration-300 shadow-lg"
                                >
                                  <ChevronLeft className="w-4 h-4 text-white" />
                                </button>
                                
                                <button 
                                  onClick={(e) => navigateImages(e, accommodation.acc_id, 'next')}
                                  className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white/50 rounded-full transition-all duration-300 shadow-lg"
                                >
                                  <ChevronRight className="w-4 h-4 text-white" />
                                </button>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100/50 to-gray-200/50 backdrop-blur-sm">
                            <div className="text-center p-4">
                              <ImageOff className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No image available</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>

                    {/* Content Container with Enhanced Glassmorphism */}
                    <div className="p-5 md:p-6 relative">
                      {/* Decorative gradient line */}
                      <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                      
                      {/* Title/Location */}
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                        {accommodation.location || accommodation.title || 'Student Accommodation'}
                      </h3>

                      {/* Address with Glassmorphic Background */}
                      <div className="flex items-start gap-2 mb-4 p-2 rounded-xl backdrop-blur-sm bg-gray-50/50 border border-gray-200/50">
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm text-gray-700 line-clamp-2">{accommodation.address || 'Address not specified'}</span>
                      </div>

                      {/* Price Section with Glassmorphism */}
                      <div className="flex items-center justify-between mb-4 p-3 rounded-xl backdrop-blur-md bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-200/30">
                        <div>
                          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            R{accommodation.monthly_rent ? accommodation.monthly_rent.toLocaleString() : 'N/A'}
                          </span>
                          <span className="text-xs md:text-sm text-gray-600 ml-1">/month</span>
                        </div>
                        
                        {accommodation.deposit > 0 && (
                          <div className="backdrop-blur-md bg-amber-100/80 border border-amber-300/50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm">
                            R{accommodation.deposit.toLocaleString()} deposit
                          </div>
                        )}
                      </div>

                      {/* Features with Enhanced Glassmorphism */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex flex-col items-center p-2 backdrop-blur-md bg-gradient-to-br from-blue-50/70 to-purple-50/70 border border-white/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                          <Home className="w-5 h-5 text-blue-600 mb-1" />
                          <span className="text-xs text-gray-700 font-medium">{accommodation.room_type || 'Room'}</span>
                        </div>
                        {accommodation.parsedAmenities && accommodation.parsedAmenities.includes('Security') ? (
                          <div className="flex flex-col items-center p-2 backdrop-blur-md bg-gradient-to-br from-green-50/70 to-emerald-50/70 border border-white/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <Shield className="w-5 h-5 text-green-600 mb-1" />
                            <span className="text-xs text-gray-700 font-medium">Secure</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center p-2 backdrop-blur-md bg-gradient-to-br from-orange-50/70 to-amber-50/70 border border-white/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <Clock className="w-5 h-5 text-orange-600 mb-1" />
                            <span className="text-xs text-gray-700 font-medium">24/7</span>
                          </div>
                        )}
                        {accommodation.parsedAmenities && accommodation.parsedAmenities.includes('Wi-Fi') ? (
                          <div className="flex flex-col items-center p-2 backdrop-blur-md bg-gradient-to-br from-purple-50/70 to-pink-50/70 border border-white/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <Wifi className="w-5 h-5 text-purple-600 mb-1" />
                            <span className="text-xs text-gray-700 font-medium">WiFi</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center p-2 backdrop-blur-md bg-gradient-to-br from-yellow-50/70 to-amber-50/70 border border-white/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <Star className="w-5 h-5 text-yellow-600 mb-1" />
                            <span className="text-xs text-gray-700 font-medium">Featured</span>
                          </div>
                        )}
                      </div>

                      {/* Payment Methods with Glassmorphism */}
                      {accommodation.parsedPaymentMethods && accommodation.parsedPaymentMethods.length > 0 && (
                        <>
                          <div className="mb-2">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Options</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {accommodation.parsedPaymentMethods.slice(0, 3).map((method, index) => (
                              <div key={`payment-${index}`} className="flex items-center gap-1.5 px-2.5 py-1.5 backdrop-blur-md bg-gray-100/80 border border-gray-200/50 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                                {getPaymentMethodIcon(method)}
                                <span className="text-xs text-gray-700 font-medium">{method}</span>
                              </div>
                            ))}
                            
                            {accommodation.parsedPaymentMethods.length > 3 && (
                              <div className="flex items-center px-2.5 py-1.5 backdrop-blur-md bg-blue-100/80 border border-blue-200/50 rounded-full shadow-sm">
                                <span className="text-xs text-blue-700 font-medium">+{accommodation.parsedPaymentMethods.length - 3} more</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Glassmorphic CTA Button */}
                      <button className="w-full backdrop-blur-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border border-white/20 text-white font-semibold text-sm md:text-base py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
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
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-all backdrop-blur-md border ${
                      currentPage === 1
                        ? 'bg-gray-100/40 border-gray-200/30 text-gray-400 cursor-not-allowed'
                        : 'bg-white/50 border-white/40 text-gray-700 hover:bg-blue-50/60 hover:border-blue-200/50 hover:text-blue-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

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
                          className={`px-3 py-2 rounded-lg transition-all backdrop-blur-md border ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500/40 text-white shadow-xl'
                              : 'bg-white/50 border-white/40 text-gray-700 hover:bg-blue-50/60 hover:border-blue-200/50 hover:text-blue-600 shadow-md hover:shadow-lg'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-all backdrop-blur-md border ${
                      currentPage === totalPages
                        ? 'bg-gray-100/40 border-gray-200/30 text-gray-400 cursor-not-allowed'
                        : 'bg-white/50 border-white/40 text-gray-700 hover:bg-blue-50/60 hover:border-blue-200/50 hover:text-blue-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Showing page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-gray-50/70 to-gray-100/70 border border-white/30 shadow-2xl">
            <div className="p-4 rounded-2xl backdrop-blur-md bg-white/40 border border-white/50 inline-block mb-4">
              <Home className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              {Object.keys(activeFilters).length > 0 ? 'No Properties Match Your Filters' : 'No Properties Available'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {Object.keys(activeFilters).length > 0 
                ? 'Try adjusting your filter criteria to see more results.' 
                : 'We don\'t have any featured properties at the moment.'
              }
            </p>
            {Object.keys(activeFilters).length > 0 ? (
              <button 
                onClick={() => setActiveFilters({})}
                className="px-6 py-3 backdrop-blur-md bg-blue-100/80 border border-blue-200/50 text-blue-700 rounded-xl hover:bg-blue-200/80 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl font-medium"
              >
                Clear Filters
              </button>
            ) : (
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 backdrop-blur-md bg-blue-100/80 border border-blue-200/50 text-blue-700 rounded-xl hover:bg-blue-200/80 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl font-medium"
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