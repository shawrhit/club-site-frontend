import React, { useState, useEffect } from 'react';
import Section from './Section';
import { Link } from 'react-router-dom';

// This is the base URL of your running Django server
const API_BASE_URL = 'http://127.0.0.1:8000';

function RoadmapsSection() {
  // 1. Set up state to hold the roadmap data
  const [roadmaps, setRoadmaps] = useState([]);

  // 2. Fetch data from the API when the component loads
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/roadmaps/`)
      .then(response => response.json())
      .then(data => setRoadmaps(data))
      .catch(error => console.error('Error fetching roadmaps:', error));
  }, []); // The empty array ensures this effect runs only once

  return (
    <Section
      id="roadmaps"
      title="Learning Roadmaps"
      subtitle="Curated learning paths to guide you from beginner to expert in key electronics domains."
    >
      {/* 3. Render the dynamic data from the 'roadmaps' state variable */}
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
      <div className="see-more-container">
              <Link to="/blogs" className="see-more-button">See All Roadmaps</Link>
      </div>
    </Section>
  );
}

export default RoadmapsSection;

