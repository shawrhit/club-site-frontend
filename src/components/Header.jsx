import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

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

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimer = useRef(null);
  const abortController = useRef(null);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    const onDocClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', onDocClick);

    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      if (abortController.current) abortController.current.abort();
      document.removeEventListener('click', onDocClick);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowResults(false);
      }
    };
    if (showResults) document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); };
  }, [showResults]);

  const closeSearch = () => {
    setShowResults(false);
    setSearchQuery('');
    setSearchResults(null);
    setShowSearchInput(false);
    if (searchRef.current) {
      const input = searchRef.current.querySelector('input');
      if (input) input.blur();
    }
  };

  const toggleSearchInput = () => {
    if (showSearchInput) {
      closeSearch();
      return;
    }
    setShowSearchInput(true);
    setShowResults(!!searchResults);
    // focus the input after render
    setTimeout(() => {
      if (searchRef.current) {
        const input = searchRef.current.querySelector('input');
        if (input) input.focus();
      }
    }, 50);
  };

  const runSearch = (q) => {
    if (!q || q.length < 2) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();
    apiFetch(`/api/search/?q=${encodeURIComponent(q)}`, { signal: abortController.current.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Search failed')))
      .then(data => {
        setSearchResults(data);
        setSearching(false);
        setShowResults(true);
      })
      .catch(() => {
        setSearchResults(null);
        setSearching(false);
      });
  };

  const onSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => runSearch(q.trim()), 300);
  };

  const handleResultClick = (type, id) => {
    setShowResults(false);
    setSearchQuery('');
    setSearchResults(null);
    // navigate to appropriate detail page
    if (type === 'blogs') navigate(`/blog/${id}`);
    else if (type === 'projects') navigate(`/projects/${id}`);
    else if (type === 'team') navigate(`/team/${id}`);
    else if (type === 'events') navigate(`/events/${id}`);
    else if (type === 'roadmaps') navigate(`/roadmaps/${id}`);
  };

  return (
    <header className="main-header" id="mainHeader">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <span className="brand-full">Google Developer's Group, NEHU</span>
            <span className="brand-short">GDG NEHU</span>
          </Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/roadmaps">Roadmaps</Link></li>
          <li><Link to="/team">Team</Link></li>
        </ul>
        
        <div className={`nav-actions ${showSearchInput ? 'nav-actions--hide-controls' : ''}`}>
          <div className="header-search" ref={searchRef}>
            <button type="button" className="search-toggle" onClick={toggleSearchInput} aria-label="Open search">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="6" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <input
              className={`search-input ${showSearchInput ? 'visible' : ''}`}
              placeholder="Search site..."
              value={searchQuery}
              onChange={onSearchChange}
              onFocus={() => { if (searchResults) setShowResults(true); setShowSearchInput(true); }}
              aria-label="Search site"
            />
            <button type="button" className="search-close" onClick={closeSearch} aria-label="Close search">×</button>
            <div className={`search-results ${showResults ? 'visible' : ''}`} role="listbox">
              {searching && <div className="search-loading">Searching…</div>}
              {!searching && searchResults && (
                <div>
                  {['blogs','projects','events','team','roadmaps'].map((section) => (
                    searchResults[section] && searchResults[section].length > 0 && (
                      <div key={section} className="search-section">
                        <div className="search-section-title">{section}</div>
                        {searchResults[section].map(item => (
                          <button key={`${section}-${item.id}`} className="search-item" onClick={() => handleResultClick(section, item.id)}>
                            {item.image_url ? (
                              <img className="search-item-thumb" src={item.image_url} alt="" />
                            ) : (
                              <div className="search-item-thumb fallback">{(item.title||item.name||'').charAt(0)}</div>
                            )}
                            <div className="search-item-body">
                              <div className="search-item-title">{item.title || item.name || item.author_name}</div>
                              {item.summary && <div className="search-item-summary">{item.summary}</div>}
                              {item.tags && item.tags.length > 0 && (
                                <div className="search-item-tags">
                                  {item.tags.slice(0,3).map((t, i) => (
                                    <span key={i} className="tag-chip">{t.name}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )
                  ))}
                </div>
              )}
              {!searching && !searchResults && searchQuery.length >= 2 && (
                <div className="search-empty">No results</div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="theme-icon theme-icon-moon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                role="presentation"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ fill: 'none', stroke: 'currentColor' }}
              >
                <path d="M21 14.2A8.5 8.5 0 1 1 9.8 3a7 7 0 0 0 11.2 11.2Z" />
              </svg>
            </span>
            <span className="theme-icon theme-icon-sun" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                role="presentation"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ fill: 'none', stroke: 'currentColor' }}
              >
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2.5v2.5M12 19v2.5M2.5 12h2.5M19 12h2.5M5 5l1.8 1.8M17.2 17.2l1.8 1.8M19 5l-1.8 1.8M6.8 17.2l-1.8 1.8" />
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
            <svg
              viewBox="0 0 24 24"
              role="presentation"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ fill: 'none', stroke: 'currentColor' }}
            >
              <path d="M21 14.2A8.5 8.5 0 1 1 9.8 3a7 7 0 0 0 11.2 11.2Z" />
            </svg>
          </span>
          <span className="theme-icon theme-icon-sun" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              role="presentation"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ fill: 'none', stroke: 'currentColor' }}
            >
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2.5v2.5M12 19v2.5M2.5 12h2.5M19 12h2.5M5 5l1.8 1.8M17.2 17.2l1.8 1.8M19 5l-1.8 1.8M6.8 17.2l-1.8 1.8" />
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

