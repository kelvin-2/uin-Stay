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
    <div className="relative w-full max-w-4xl mx-auto">
      {activePanel && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setActivePanel(null)}
        />
      )}

      <div className="relative bg-white rounded-full shadow-lg border border-gray-200 divide-x z-40">
        <div className="flex items-center h-16">
          <button
            onClick={() => handlePanelClick("location")}
            className={`flex-1 flex items-center px-6 h-full rounded-l-full hover:bg-gray-50 transition-all duration-200 ${
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
            className={`flex-1 flex items-center px-6 h-full hover:bg-gray-50 transition-all duration-200 ${
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
            className={`flex-1 flex items-center px-6 h-full hover:bg-gray-50 transition-all duration-200 ${
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
            className="px-6 h-full rounded-r-full bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {activePanel && (
        <div className="absolute left-0 right-0 mt-4 mx-auto max-w-4xl z-40">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 transform transition-all duration-200 ease-out">
            {activePanel === "location" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Where to Stay?</h3>
                <div className="grid grid-cols-3 gap-4">
                  {towns.map((town) => (
                    <button
                      key={town}
                      onClick={() => {
                        setLocation(town);
                        setActivePanel(null);
                      }}
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    >
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium">{town}</p>
                        <p className="text-sm text-gray-500">Available</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activePanel === "payment" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      onClick={() => {
                        setPaymentMethod(method);
                        setActivePanel(null);
                      }}
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    >
                      <Wallet className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{method}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activePanel === "price" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={handleSliderChange}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                      <input
                        type="number"
                        min="0"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                      <input
                        type="number"
                        min="0"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBox;