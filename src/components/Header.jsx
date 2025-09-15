import React from 'react';

function Header() {
  return (
    <header className="main-header" id="mainHeader">
      <nav className="navbar">
        <div className="logo">Electrophoenix</div>
        <ul className="nav-links">
          <li><a href="#projects">Projects</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#roadmaps">Roadmaps</a></li>
          <li><a href="#team">Team</a></li>
        </ul>
        <a href="#" className="cta-button">Join Us</a>
      </nav>
    </header>
  );
}

export default Header;
     