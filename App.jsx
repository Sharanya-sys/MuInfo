import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Map from './pages/Map';
import Tour from './pages/Tour';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/map" element={<Map />} />
        <Route path="/tour" element={<Tour />} />
      </Routes>
    </Router>
  );
}

export default App;