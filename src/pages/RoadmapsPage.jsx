import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';

function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    apiFetch('/api/roadmaps/')
      .then(response => response.json())
      .then(data => setRoadmaps(data))
      .catch(error => console.error('Error fetching roadmaps:', error));
  }, []);

  return (
    <main className="page-container">
       <div className="page-header">
        <h1 className="page-title">Learning Roadmaps</h1>
        <p className="page-subtitle">Your guide to mastering key domains in the world of electronics and software.</p>
      </div>

      <div className="grid-layout">
        {roadmaps.map(roadmap => (
          <Link
            key={roadmap.id}
            to={`/roadmaps/${roadmap.id}`}
            className="glass-card roadmap-card card-link"
          >
            <div className="icon">{roadmap.icon_name}</div>
            <h3>{roadmap.title}</h3>
            <p>{roadmap.description}</p>
            <span className="cta-link">Start Learning →</span>
          </Link>
        ))}
      </div>

       <div className="back-link-container">
        <Link to="/" className="see-more-button">&larr; Back to Home</Link>
      </div>
    </main>
  );
}

export default RoadmapsPage;
