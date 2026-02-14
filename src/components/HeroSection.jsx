import React, { useState, useEffect } from 'react';

function HeroSection() {
  const [pillText, setPillText] = useState("Weekly Blogs");
  
  useEffect(() => {
    const texts = ["Weekly Blogs", "Open Source", "Projects", "Roadmaps", "Events"];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setPillText(texts[currentIndex]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-wrap">
        <div className="hero-content">
          <p className="hero-eyebrow">
            <span className="brand-full">Google Developer's Group On Campus, North Eastern Hill University</span>
            <span className="brand-short">GDGoC NEHU</span>
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
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-blob blob-blue"></div>
          <div className="hero-blob blob-pink"></div>
          <div className="hero-blob blob-yellow"></div>
          <div className="hero-pill">Join our community</div>
          <div key={pillText} className="hero-pill alt animate-pop-in">{pillText}</div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;