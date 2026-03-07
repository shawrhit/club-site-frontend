import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  const texts = ["Weekly Blogs", "Open Source", "Projects", "Roadmaps", "Events"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      // After exit animation completes, change text and trigger enter animation
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsAnimating(false);
      }, 300); // Match exit animation duration
    }, 2500);
    
    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-wrap">
        <div className="hero-content">
          <p className="hero-eyebrow">
            <span className="brand-full">Google Developer's Group On Campus, North Eastern Hill University</span>
          </p>
          <h1 className="hero-headline">Engineering the Future, Together.</h1>
          <p className="hero-subheadline">
            Learn. Build. Collaborate. Grow Together as Developers.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="hero-cta">Explore Projects</a>
            <a href="#tags" className="hero-ghost">Browse Topics</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob blob-blue"></div>
          <div className="hero-blob blob-pink"></div>
          <div className="hero-blob blob-yellow"></div>
          <Link to="/join" className="hero-pill">Join our community</Link>
          <div 
            className={`hero-pill alt ${isAnimating ? 'animate-pop-out' : 'animate-pop-in'}`}
          >
            {texts[currentIndex]}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
