import React from 'react';
import { Button } from 'react-bootstrap';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content text-center">
        <h1>Welcome to EduTrack</h1>
        <p>Your gateway to quality education.</p>
        <Button variant="custom" className="mt-3">Get Started</Button>
      </div>
    </div>
  );
};

export default HeroSection;
