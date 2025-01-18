import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import Properties from './components/Properties'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
         {/* Default Route: Home Page */}
       <Route path="/" element={<HomePage/>} />
       <Route path="/Properties" element={<Properties/>} />
      
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
