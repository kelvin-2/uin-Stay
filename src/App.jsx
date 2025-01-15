import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Feature One</h2>
            <p className="text-gray-600 mb-4">This is a sample card demonstrating Tailwind's styling capabilities.</p>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
              Learn More
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Feature Two</h2>
            <p className="text-gray-600 mb-4">Each card automatically adjusts its width based on screen size.</p>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">
              Explore
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Feature Three</h2>
            <p className="text-gray-600 mb-4">The layout is fully responsive and uses Tailwind's grid system.</p>
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg">
              Get Started
            </button>
          </div>
        </div>

        {/* Full-width section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Tailwind CSS is working! 🎉
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Left Content</h3>
              <p className="text-gray-600">This section demonstrates full-width layout with responsive design.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Right Content</h3>
              <p className="text-gray-600">The content automatically adjusts based on your screen size.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
