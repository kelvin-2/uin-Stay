import React, { useState, useEffect } from "react";
import { Search, MapPin, Wallet, Calendar } from "lucide-react";

function SearchBox({ onSearch }) {
  const [activePanel, setActivePanel] = useState(null);
  const [location, setLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const towns = ["Summerstrand", "Central", "Humewood", "Town"];
  const paymentMethods = ["Private", "Bursary", "NSFAS"];

  const handlePanelClick = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const handlePriceRangeChange = (index, value) => {
    const newValue = value === "" ? 0 : Math.max(0, parseInt(value) || 0);

    setPriceRange((prev) => {
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
    setPriceRange((prev) => [prev[0], value]);
  };

  const handleSearchClick = () => {
    setIsLoading(true);
    
    // Create the search parameters object
    const searchParams = {
      location,
      paymentMethod,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      // Include timestamp for tracking/debugging
      timestamp: new Date().toISOString()
    };
    
    // Log the parameters being sent (for debugging)
    console.log('Search parameters:', searchParams);
    
    // Pass parameters to parent component
    if (typeof onSearch === 'function') {
      onSearch(searchParams);
    }
    
    // Reset UI state
    setIsLoading(false);
    setActivePanel(null);
  };

  // Debug function to help visualize parameters
  const logCurrentParameters = () => {
    console.log('Current search parameters:', {
      location,
      paymentMethod,
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    });
  };
  
  // Add this debug button to your UI when developing
  const debugButton = process.env.NODE_ENV === 'development' && (
    <button 
      onClick={logCurrentParameters}
      className="text-sm text-gray-500 underline mt-2"
    >
      Debug: Show Current Parameters
    </button>
  );

  if (isMobile) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => handlePanelClick("location")}
            className="w-full bg-white p-4 rounded-lg shadow border text-left"
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <span className="font-medium">Location</span>
                <p className="text-sm text-gray-500">{location || "Choose your location"}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handlePanelClick("payment")}
            className="w-full bg-white p-4 rounded-lg shadow border text-left"
          >
            <div className="flex items-center">
              <Wallet className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <span className="font-medium">Payment</span>
                <p className="text-sm text-gray-500">{paymentMethod || "Add payment method"}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handlePanelClick("price")}
            className="w-full bg-white p-4 rounded-lg shadow border text-left"
          >
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
              <div>
                <span className="font-medium">Price</span>
                <p className="text-sm text-gray-500">R{priceRange[0]} - R{priceRange[1]}</p>
              </div>
            </div>
          </button>
        </div>

        {activePanel ? (
          <div className="fixed inset-0 flex flex-col justify-end z-50">
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setActivePanel(null)}
            />
            <div className="relative bg-white rounded-t-2xl shadow-2xl border-t p-6 max-h-[80vh] overflow-y-auto">
              {activePanel === "location" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Where to Stay?</h3>
                  <div className="grid grid-cols-1 gap-4">
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
                  <div className="grid grid-cols-1 gap-3">
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
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSearchClick}
                disabled={isLoading}
                className="w-full mt-6 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center disabled:bg-blue-300"
              >
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={handleSearchClick}
              disabled={isLoading}
              className="w-full p-4 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors flex items-center justify-center disabled:bg-blue-300"
            >
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  <span>Search</span>
                </>
              )}
            </button>
            {debugButton}
          </>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="relative w-full max-w-4xl mx-auto p-4">
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
            onClick={handleSearchClick}
            disabled={isLoading}
            className="px-6 h-full rounded-r-full bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-blue-300 flex items-center"
          >
            {isLoading ? (
              <span className="text-white text-sm">Searching...</span>
            ) : (
              <Search className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {activePanel && (
        <div className="absolute left-0 right-0 mt-4 mx-auto max-w-4xl z-40">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 transform transition-all duration-200 ease-out">
            {activePanel === "location" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Where to Stay?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                      <input
                        type="number"
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
      {debugButton}
    </div>
  );
}

export default SearchBox;