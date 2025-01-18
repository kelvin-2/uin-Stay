import React from "react";
import { Link } from 'react-router-dom';
import Properties from '../components/Properties';

function FeaturedProperties(){
    return(
    <div className="w-full  ">
        <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
        <Link 
            to="/properties" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
            View all properties
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        </div>
    <Properties />
  </div>

    );
}

export default FeaturedProperties;