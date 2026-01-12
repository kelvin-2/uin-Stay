import React, { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';

const SearchFilter = ({ onFilterChange, activeFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const paymentMethods = ['Private', 'Bursary', 'NSFAS'];
  const locations = ['Central', 'Humewood', 'Town'];
  const priceRanges = [
    { label: 'Under R2,000', min: 0, max: 2000 },
    { label: 'R2,000 - R3,500', min: 2000, max: 3500 },
    { label: 'R3,500 - R5,000', min: 3500, max: 5000 },
    { label: 'R5,000 - R7,500', min: 5000, max: 7500 },
    { label: 'Above R7,500', min: 7500, max: Infinity }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'paymentMethod') {
      newFilters.paymentMethod = newFilters.paymentMethod === value ? null : value;
    } else if (filterType === 'location') {
      newFilters.location = newFilters.location === value ? null : value;
    } else if (filterType === 'priceRange') {
      newFilters.priceRange = newFilters.priceRange === value ? null : value;
    }

    onFilterChange(newFilters);
    setOpenDropdown(null);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== null && value !== undefined).length;
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="relative mb-6 z-50">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-4 py-3 w-full sm:w-auto
          rounded-lg border border-white/30 bg-white/20 backdrop-blur-md
          shadow-lg shadow-blue-200/30 hover:scale-[1.02] transition-transform
          min-h-[44px]
        "
      >
        <Filter className="w-5 h-5 text-gray-600" />
        <span className="text-gray-900 font-medium">Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
            {getActiveFilterCount()}
          </span>
        )}
        <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ml-auto ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 max-w-screen-sm mx-auto rounded-lg z-50">
          <div className="flex flex-col gap-4 relative z-50">
            
            {/* Payment Method Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('payment')}
                className="
                  w-full flex items-center justify-between px-4 py-3
                  rounded-lg border border-white/30 bg-white/20 backdrop-blur-md
                  text-gray-900 font-medium hover:scale-[1.01] transition-transform min-h-[48px]
                "
              >
                <span className="text-sm font-medium truncate">
                  {activeFilters.paymentMethod || 'Payment Method'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ml-2 flex-shrink-0 ${openDropdown === 'payment' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'payment' && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/30 bg-white/20 backdrop-blur-md shadow-lg max-h-60 overflow-y-auto z-50">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      onClick={() => handleFilterChange('paymentMethod', method)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/30 transition-colors first:rounded-t-lg last:rounded-b-lg min-h-[44px] ${
                        activeFilters.paymentMethod === method ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-900'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('location')}
                className="
                  w-full flex items-center justify-between px-4 py-3
                  rounded-lg border border-white/30 bg-white/20 backdrop-blur-md
                  text-gray-900 font-medium hover:scale-[1.01] transition-transform min-h-[48px]
                "
              >
                <span className="text-sm font-medium truncate">
                  {activeFilters.location || 'Location'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ml-2 flex-shrink-0 ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'location' && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/30 bg-white/20 backdrop-blur-md shadow-lg max-h-60 overflow-y-auto z-50">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleFilterChange('location', location)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/30 transition-colors first:rounded-t-lg last:rounded-b-lg min-h-[44px] ${
                        activeFilters.location === location ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-900'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('price')}
                className="
                  w-full flex items-center justify-between px-4 py-3
                  rounded-lg border border-white/30 bg-white/20 backdrop-blur-md
                  text-gray-900 font-medium hover:scale-[1.01] transition-transform min-h-[48px]
                "
              >
                <span className="text-sm font-medium truncate">
                  {activeFilters.priceRange ? activeFilters.priceRange.label : 'Price Range'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ml-2 flex-shrink-0 ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'price' && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/30 bg-white/20 backdrop-blur-md shadow-lg max-h-60 overflow-y-auto z-50">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handleFilterChange('priceRange', range)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/30 transition-colors first:rounded-t-lg last:rounded-b-lg min-h-[44px] ${
                        activeFilters.priceRange === range ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-900'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clear Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t border-white/30 gap-3">
              <span className="text-sm text-gray-600">
                {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied
              </span>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors min-h-[40px] w-full sm:w-auto justify-center sm:justify-start"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdowns */}
      {(isOpen || openDropdown) && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-5 sm:bg-transparent" 
          onClick={() => {
            setIsOpen(false);
            setOpenDropdown(null);
          }}
        />
      )}
    </div>
  );
};

export default SearchFilter;
