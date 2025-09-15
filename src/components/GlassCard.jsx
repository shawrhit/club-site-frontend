import React from 'react';

function GlassCard({ imgSrc, title, description, tags }) {
  return (
    <div className="glass-card">
      {imgSrc && <img src={imgSrc} alt={title} />}
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="tags-container">
          {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
    </div>
  );
}

export default GlassCard;