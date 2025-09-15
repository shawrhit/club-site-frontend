import React from 'react';

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="content-section">
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">{subtitle}</p>
      {children}
    </section>
  );
}

export default Section;
