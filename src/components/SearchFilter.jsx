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
    <div className="relative mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Filter className="w-4 h-4 text-gray-600" />
        <span className="text-gray-700 font-medium">Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {getActiveFilterCount()}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Payment Method Filter */}
            <div className="relative flex-1">
              <button
                onClick={() => toggleDropdown('payment')}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {activeFilters.paymentMethod || 'Payment Method'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${openDropdown === 'payment' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'payment' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      onClick={() => handleFilterChange('paymentMethod', method)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        activeFilters.paymentMethod === method ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location Filter */}
            <div className="relative flex-1">
              <button
                onClick={() => toggleDropdown('location')}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {activeFilters.location || 'Location'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'location' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleFilterChange('location', location)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        activeFilters.location === location ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="relative flex-1">
              <button
                onClick={() => toggleDropdown('price')}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {activeFilters.priceRange ? 
                    priceRanges.find(p => p === activeFilters.priceRange)?.label || 'Price Range' : 
                    'Price Range'
                  }
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'price' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handleFilterChange('priceRange', range)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        activeFilters.priceRange === range ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clear Filters Button */}
          {getActiveFilterCount() > 0 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied
              </span>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isOpen || openDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
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