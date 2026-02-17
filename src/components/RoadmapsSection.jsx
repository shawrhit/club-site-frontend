import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';

function RoadmapsSection({ roadmaps = [], loading = false }) {
  const showRoadmaps = roadmaps.slice(0, 3);

  return (
    <Section
      id="roadmaps"
      eyebrow="LEARNING"
      title="Learning Roadmaps"
      subtitle="Curated learning paths to guide you from beginner to expert in key electronics domains."
    >
      <div className="grid-layout">
        {showRoadmaps.map((roadmap, index) => (
          <Link
            key={roadmap.id}
            to={`/roadmaps/${roadmap.id}`}
            className={`glass-card roadmap-card card-variant-${(index % 4) + 1} card-link`}
          >
            <div className="icon">{roadmap.icon_name || roadmap.icon || roadmap.emoji || '🧭'}</div>
            <h3>{roadmap.title || roadmap.name}</h3>
            <p>{roadmap.summary || roadmap.description}</p>
            <span className="cta-link">Start Learning -&gt;</span>
          </Link>
        ))}
        {!showRoadmaps.length && loading && <div className="muted">Loading roadmaps...</div>}
      </div>
      <div className="see-more-container">
        <Link to="/roadmaps" className="see-more-button">See All Roadmaps</Link>
      </div>
    </Section>
  );
}

export default RoadmapsSection;
