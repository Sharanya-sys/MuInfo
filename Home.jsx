import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to MuInfo</h1>
      <nav className="mt-4 space-x-4">
        <Link to="/scan">Scan Artwork</Link>
        <Link to="/map">Museum Map</Link>
        <Link to="/tour">Guided Tour</Link>
      </nav>
    </div>
  );
}