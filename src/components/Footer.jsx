import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer-inner">
        <div className="footer-col footer-brand">
          <Link to="/" className="footer-logo">Google Developer's Group</Link>
          <p className="footer-copy">© {new Date().getFullYear()} Club. All rights reserved.</p>
        </div>

        <nav className="footer-col footer-nav" aria-label="Footer navigation">
          <Link to="/roadmaps">Roadmaps</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/team">Team</Link>
          <Link to="/blog">Blog</Link>
        </nav>

        <div className="footer-col footer-contact">
          <a href="mailto:gdgnehu@gmail.com">gdgnehu@gmail.com</a>
          <Link to="/dev" className="footer-dev-link" aria-label="Open developer easter egg page">
            Developed and maintained by GDG NEHU
          </Link>
        </div>
      </div>
    </footer>
  );
}
