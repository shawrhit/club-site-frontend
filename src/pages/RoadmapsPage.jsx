import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/roadmaps/`)
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
          <div key={roadmap.id} className="glass-card roadmap-card">
            <div className="icon">{roadmap.icon_name}</div>
            <h3>{roadmap.title}</h3>
            <p>{roadmap.description}</p>
            <a href="#" className="cta-link">Start Learning →</a>
          </div>
        ))}
      </div>

       <div className="back-link-container">
        <Link to="/" className="see-more-button">&larr; Back to Home</Link>
      </div>
    </main>
  );
}

export default RoadmapsPage;
