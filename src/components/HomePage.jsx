import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-screen ">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to UniStay</h1>
      <p className="text-lg text-gray-600 mt-4">
        Find your perfect student accommodation easily.
      </p>
    </div>
  );
}

export default HomePage;
