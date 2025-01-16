import React, { useState } from "react";
import { Search, MapPin, Wallet, Calendar } from "lucide-react";

function SearchBox() {
  const [activePanel, setActivePanel] = useState(null);
  const [location, setLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const towns = ["Summerstrand", "Central", "Humewood", "Forest Hill", "Wallmer"];
  const paymentMethods = ["Cash", "Bursary", "NSFAS"];


  const handlePanelClick = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Pill */}
      <div className="bg-white rounded-full shadow-lg border border-gray-200 divide-x">
        <div className="flex items-center h-16">
          {/* Location Button */}
          <button
            onClick={() => handlePanelClick("location")}
            className={`flex-1 flex items-center px-6 h-full rounded-l-full hover:bg-gray-50 transition-colors relative ${
              activePanel === "location" ? "bg-gray-50" : ""
            }`}
          >
            <div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                <span className="font-medium">Location</span>
              </div>
              <p className="text-sm text-gray-500">{location || "Where are you going?"}</p>
            </div>
          </button>

          {/* Payment Method Button */}
          <button
            onClick={() => handlePanelClick("payment")}
            className={`flex-1 flex items-center px-6 h-full hover:bg-gray-50 transition-colors ${
              activePanel === "payment" ? "bg-gray-50" : ""
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

          {/* Price Range Button */}
          <button
            onClick={() => handlePanelClick("price")}
            className={`flex-1 flex items-center px-6 h-full hover:bg-gray-50 transition-colors ${
              activePanel === "price" ? "bg-gray-50" : ""
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

          {/* Search Button */}
          <button className="px-6 h-full rounded-r-full bg-blue-500 hover:bg-blue-600 transition-colors">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Dropdown Panels */}
      {activePanel && (
        <div className="absolute left-0 right-0 mt-2 mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            {activePanel === "location" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Where to?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {towns.map((town) => (
                    <button
                      key={town}
                      onClick={() => {
                        setLocation(town);
                        setActivePanel(null);
                      }}
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
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
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
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
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full p-2 border rounded-lg"
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
