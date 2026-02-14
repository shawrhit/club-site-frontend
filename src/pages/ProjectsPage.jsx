import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { apiFetch } from '../api';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const getTagName = (tag) => (typeof tag === 'string' ? tag : tag?.name);

  useEffect(() => {
    apiFetch('/api/projects/')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  return (
    <main className="page-container projects-page">
      <div className="page-header">
        <h1 className="page-title">Our Projects</h1>
        <p className="page-subtitle">A showcase of our members' passion, creativity, and technical skills.</p>
      </div>
      
      <div className="grid-layout">
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id} className="card-link">
            <GlassCard
              imgSrc={project.image_url}
              title={project.title}
              description={project.description}
              tags={(project.tags || []).map(getTagName).filter(Boolean)}
              date={project.published_date}
            />
          </Link>
        ))}
      </div>
      
      <div className="back-link-container">
        <Link to="/" className="see-more-button">&larr; Back to Home</Link>
      </div>
    </main>
  );
}

export default ProjectsPage;
