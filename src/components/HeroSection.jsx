import React from 'react';

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-wrap">
        <div className="hero-content">
          <p className="hero-eyebrow">Google Developer's Group, NEHU</p>
          <h1 className="hero-headline">Engineering the Future, Together.</h1>
          <p className="hero-subheadline">
            Welcome to the hub for electronics and robotics enthusiasts. We build, we learn, and we redefine what's possible.
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
          <div className="hero-pill alt">Weekly builds</div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;