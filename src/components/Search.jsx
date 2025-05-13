import React, { useState } from "react";
import SearchBox from "./SearchBox";
import SearchResults from "./SearchResults";

function Search() {
  const [searchParams, setSearchParams] = useState(null);

  const handleSearch = (searchData) => {
    // Extract just the searchParams from the data returned by SearchBox
    // This is what SearchResults expects to receive
    console.log("Search data received:", searchData);
    
    // If searchData contains the searchParams property directly
    if (searchData.searchParams) {
      setSearchParams(searchData.searchParams);
    } 
    // If searchData is structured differently with results and params
    else {
      // Create a compatible format for SearchResults
      // based on what SearchBox appears to be returning
      const params = {
        location: searchData.location || "",
        paymentMethod: searchData.paymentMethod || "",
        priceRange: searchData.priceRange || [0, 10000]
      };
      
      setSearchParams(params);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-xl shadow-xl p-4 mb-6">
          <SearchBox onSearch={handleSearch} />
        </div>
      </div>
      
      <SearchResults searchParams={searchParams} />
    </div>
  );
}

export default Search;