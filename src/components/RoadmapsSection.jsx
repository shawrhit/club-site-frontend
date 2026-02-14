import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import { apiFetch } from '../api';

function RoadmapsSection() {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    apiFetch('/api/roadmaps/')
      .then(response => response.json())
      .then(data => setRoadmaps(data))
      .catch(error => console.error('Error fetching roadmaps:', error));
  }, []);

  return (
    <Section
      id="roadmaps"
      eyebrow="LEARNING"
      title="Learning Roadmaps"
      subtitle="Curated learning paths to guide you from beginner to expert in key electronics domains."
    >
      <div className="grid-layout">
        {roadmaps.slice(0, 3).map((roadmap, index) => (
          <Link
            key={roadmap.id}
            to={`/roadmaps/${roadmap.id}`}
            className={`glass-card roadmap-card card-variant-${(index % 4) + 1} card-link`}
          >
            <div className="icon">{roadmap.icon_name}</div>
            <h3>{roadmap.title}</h3>
            <p>{roadmap.description}</p>
            <span className="cta-link">Start Learning →</span>
          </Link>
        ))}
      </div>
       <div className="see-more-container">
        <Link to="/roadmaps" className="see-more-button">See All Roadmaps</Link>
      </div>
    </Section>
  );
}

export default RoadmapsSection;

