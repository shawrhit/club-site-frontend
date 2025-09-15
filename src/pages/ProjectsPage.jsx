import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

const API_BASE_URL = 'http://127.0.0.1:8000';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects/`)
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">Our Projects</h1>
        <p className="page-subtitle">A showcase of our members' passion, creativity, and technical skills.</p>
      </div>
      
      <div className="grid-layout">
        {projects.map(project => (
          <GlassCard
            key={project.id}
            imgSrc={project.image}
            title={project.title}
            description={project.description}
            tags={project.tags.map(tag => tag.name)}
            date={project.publish_date}
          />
        ))}
      </div>
      
      <div className="back-link-container">
        <Link to="/" className="see-more-button">&larr; Back to Home</Link>
      </div>
    </main>
  );
}

export default ProjectsPage;
