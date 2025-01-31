import React from "react";
import { Link } from "react-router-dom";
import SearchBox from '../components/SearchBox';
import Properties from '../components/Properties';
import HeroSection from "../components/HeroSection";
import Benefits from "../components/Benefits";
import FeaturedProperties from "../components/FeaturedProperties";
import { Building2, GraduationCap, Home, Users } from 'lucide-react';


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
      <div className="relative -mt-10 mb-10">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-xl shadow-xl p-4">
            <SearchBox 
              onSearch={(searchData) => {
                setLoading(true);
                handleSearch(searchData);
              }} 
            />
          </div>
        </div>
      </div>

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
  );
}

export default HomePage;