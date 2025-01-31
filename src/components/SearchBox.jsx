import React, { useState } from "react";
import { Search, MapPin, Wallet, Calendar } from "lucide-react";

function SearchBox({ onSearch }) {
  const [activePanel, setActivePanel] = useState(null);
  const [location, setLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  
  const towns = ["Summerstrand", "Central", "Humewood", "Forest Hill", "Wallmer"];
  const paymentMethods = ["Cash", "Bursary", "NSFAS"];

  const handlePanelClick = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const handlePriceRangeChange = (index, value) => {
    const newValue = value === "" ? 0 : Math.max(0, parseInt(value) || 0);
    
    setPriceRange(prev => {
      const newRange = [...prev];
      newRange[index] = newValue;
      
      if (index === 0 && newValue > prev[1]) {
        newRange[1] = newValue;
      }
      if (index === 1 && newValue < prev[0]) {
        newRange[0] = newValue;
      }
      
      return newRange;
    });
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => [prev[0], value]);
  };

  const handleSearch = () => {
    const searchParams = {
      location: location,
      paymentMethod: paymentMethod,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    };

    const fetchProperties = async () => {
      try {
        const response = await fetch('/propertyData.json');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const allProperties = await response.json();

        const filteredProperties = allProperties.filter(property => {
          const matchesLocation = !location || property.location.includes(location);
          const matchesPayment = !paymentMethod || 
            (property.paymentMethods && property.paymentMethods.includes(paymentMethod));
          const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];

          return matchesLocation && matchesPayment && matchesPrice;
        });

        onSearch({
          results: filteredProperties,
          searchParams: searchParams
        });

      } catch (error) {
        onSearch({
          results: [],
          error: error.message,
          searchParams: searchParams
        });
      }
    };

    fetchProperties();
    setActivePanel(null);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {activePanel && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setActivePanel(null)}
        />
      )}

      <div className="relative bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden z-40">
        <div className="flex flex-col sm:flex-row items-stretch">
          <button
            onClick={() => handlePanelClick("location")}
            className={`w-full sm:flex-1 flex items-center px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-all duration-200 ${
              activePanel === "location" ? "bg-gray-50 ring-2 ring-blue-100" : ""
            }`}
          >
            <div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                <span className="font-medium">Location</span>
              </div>
              <p className="text-sm text-gray-500">{location || "Choose your location"}</p>
            </div>
          </button>

          <button
            onClick={() => handlePanelClick("payment")}
            className={`w-full sm:flex-1 flex items-center px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-all duration-200 ${
              activePanel === "payment" ? "bg-gray-50 ring-2 ring-blue-100" : ""
            }`}
          >
            <div>
              <div className="flex items-center">
                <Wallet className="w-4 h-4 text-gray-500 mr-2" />
                <span className="font-medium">Payment</span>
              </div>
              <p className="text-sm text-gray-500">{paymentMethod || "Add payment method"}</p>
            </div>
          </button>

          <button
            onClick={() => handlePanelClick("price")}
            className={`w-full sm:flex-1 flex items-center px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-all duration-200 ${
              activePanel === "price" ? "bg-gray-50 ring-2 ring-blue-100" : ""
            }`}
          >
            <div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <span className="font-medium">Price</span>
              </div>
              <p className="text-sm text-gray-500">R{priceRange[0]} - R{priceRange[1]}</p>
            </div>
          </button>

          <button 
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {activePanel && (
        <div className="absolute left-0 right-0 mt-4 mx-auto max-w-4xl z-40 px-4 sm:px-0">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 transform transition-all duration-200 ease-out">
            {/* Panel content remains the same */}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBox;