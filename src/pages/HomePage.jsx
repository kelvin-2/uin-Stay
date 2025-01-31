import React, { useState } from 'react';
import { Link } from "react-router-dom";
import SearchBox from '../components/SearchBox';
import Properties from '../components/Properties';
import HeroSection from "../components/HeroSection";
import Benefits from "../components/Benefits";
import FeaturedProperties from "../components/FeaturedProperties";
import { Building2, GraduationCap, Home, Users } from 'lucide-react';
import SearchResults from '../components/SearchResults';

function HomePage() {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = ({ results, error, searchParams }) => {
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSearchResults(results);
    }
  };

  return (
    <div className="w-full mx-auto">
      <HeroSection/>
      <div className="relative -mt-6 sm:-mt-10 mb-8 sm:mb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4">
            <SearchBox 
              onSearch={(searchData) => {
                setLoading(true);
                handleSearch(searchData);
              }} 
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {searchResults ? (
          <SearchResults 
            results={searchResults} 
            loading={loading}
            error={error}
          />
        ) : (
          <>
            <FeaturedProperties/>
            <Benefits/>
          </>
        )}
      </div>
    </div>
  );
}
export default HomePage;