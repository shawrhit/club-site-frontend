import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="main-header" id="mainHeader">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Google Developer's Group, NEHU</Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/roadmaps">Roadmaps</Link></li>
          <li><Link to="/team">Team</Link></li>
        </ul>
        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="theme-icon theme-icon-moon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M14.5 2a8.5 8.5 0 1 0 7.5 12.5A9.5 9.5 0 1 1 14.5 2z" />
              </svg>
            </span>
            <span className="theme-icon theme-icon-sun" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" />
              </svg>
            </span>
            <span className="sr-only">
              {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            </span>
          </button>
          <Link to="/join" className="cta-button">Join Us</Link>
        </div>

        <button
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
      </nav>

      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/projects" onClick={toggleMenu}>Projects</Link>
        <Link to="/blog" onClick={toggleMenu}>Blog</Link>
        <Link to="/events" onClick={toggleMenu}>Events</Link>
        <Link to="/roadmaps" onClick={toggleMenu}>Roadmaps</Link>
        <Link to="/team" onClick={toggleMenu}>Team</Link>
        <button
          type="button"
          className="theme-toggle mobile"
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="theme-icon theme-icon-moon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M14.5 2a8.5 8.5 0 1 0 7.5 12.5A9.5 9.5 0 1 1 14.5 2z" />
            </svg>
          </span>
          <span className="theme-icon theme-icon-sun" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" />
            </svg>
          </span>
          <span className="sr-only">
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;

