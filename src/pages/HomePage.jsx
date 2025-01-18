import React from "react";
import { Link } from "react-router-dom";
import SearchBox from '../components/SearchBox';
import Properties from '../components/Properties';
import HeroSection from "../components/HeroSection";
import Benefits from "../components/Benefits";
import FeaturedProperties from "../components/FeaturedProperties";
import { Building2, GraduationCap, Home, Users } from 'lucide-react';


function HomePage() {
  return (
    <div className="w-full mx-auto ">
      <HeroSection/>
      {/* Search Section */}
      <div className="relative -mt-10 mb-10">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-xl shadow-xl p-4">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* Featured Properties Section d*/}
      <FeaturedProperties/>

      {/* Benefits Section */}
      <Benefits/>
      
    </div>
  );
}

export default HomePage;