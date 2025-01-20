import React from "react";
import BGimage from "../assets/background.jpg";

function OurStory() {
  return (
    <main className="relative ">
      <div
        className="fixed top-[64px] left-0 w-full min-h-[400px] flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${BGimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <div className="relative text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our Story
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Creating a safer, simpler way for students to find their perfect home away from home.
          </p>
        </div>
      </div>
    </main>
  );
}

export default OurStory;
