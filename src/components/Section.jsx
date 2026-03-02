import React from 'react';
import { Link } from 'react-router-dom';

function Section({ id, title, subtitle, eyebrow, seeAllLink, children }) {
  return (
    <section id={id} className="content-section">
      <div className="section-header">
        <div className="section-header-content">
          {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        {seeAllLink && (
          <Link to={seeAllLink.href} className="section-see-all">
            {seeAllLink.text}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default Section;
