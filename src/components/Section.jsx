import React from 'react';

function Section({ id, title, subtitle, eyebrow, children }) {
  return (
    <section id={id} className="content-section">
      <div className="section-header">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export default Section;
