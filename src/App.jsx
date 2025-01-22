import viteLogo from '/vite.svg';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Properties from './components/Properties';
import OurStory from './pages/OurStory';
import ContactUs from './pages/ContactUs';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter >
      <Navbar />
      <Routes>
        {/* Default Route: Home Page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Properties Page */}
        <Route path="/Properties" element={<Properties />} />
        
        {/* OurStory Page */}
        <Route path="/OurStory" element={<OurStory/>} />

        {/*Contanct Page*/}
        <Route path="/ContactUs" element={<ContactUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
