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
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  

  return (
    <div className="w-full mx-auto">
      <HeroSection/>
      

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