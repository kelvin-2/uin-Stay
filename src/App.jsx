import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
         {/* Default Route: Home Page */}
       <Route path="/" element={<HomePage/>} />
      
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
