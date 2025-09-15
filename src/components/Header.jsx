import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="main-header" id="mainHeader">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Electrophoenix</Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/roadmaps">Roadmaps</Link></li>
          <li><Link to="/team">Team</Link></li>
        </ul>
        <Link to="/join" className="cta-button">Join Us</Link>

        {/* Hamburger Menu Button */}
        <button
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {/* CRITICAL FIX: The 'open' class is now on the bars themselves */}
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/projects" onClick={toggleMenu}>Projects</Link>
        <Link to="/blog" onClick={toggleMenu}>Blog</Link>
        <Link to="/roadmaps" onClick={toggleMenu}>Roadmaps</Link>
        <Link to="/team" onClick={toggleMenu}>Team</Link>
      </div>
    </header>
  );
}

export default Header;

