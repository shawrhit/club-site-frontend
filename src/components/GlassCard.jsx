import React from 'react';

// Receive the new 'date' prop
function GlassCard({ imgSrc, title, description, tags, date }) {
  
  // A helper function to format the date nicely
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : null;

  return (
    <div className="glass-card">
      {imgSrc && <img src={imgSrc} alt={title} />}
      <div className="card-content">
        <h3>{title}</h3>
        {formattedDate && <p className="card-date">{formattedDate}</p>}
        <p>{description}</p>
        <div className="tags-container">
          {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
    </div>
  );
}

export default GlassCard;