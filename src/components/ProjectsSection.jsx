import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import GlassCard from './GlassCard';
import { apiFetch } from '../api';

function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const getTagName = (tag) => (typeof tag === 'string' ? tag : tag?.name);

  useEffect(() => {
    apiFetch('/api/projects/')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  return (
    <Section
      id="projects"
      eyebrow="FEATURED"
      title="What We Build"
      subtitle="From autonomous robots to smart IoT devices, our projects are a testament to our passion for innovation."
    >
      <div className="grid-layout">
        {projects.slice(0, 3).map((project, index) => (
          <Link to={`/projects/${project.id}`} key={project.id} className="card-link">
            <GlassCard
              imgSrc={project.image_url}
              title={project.title}
              description={project.description}
              tags={(project.tags || []).map(getTagName).filter(Boolean)}
              date={project.published_date}
              className={`card-variant-${(index % 4) + 1}`}
            />
          </Link>
        ))}
      </div>
      <div className="see-more-container">
        <Link to="/projects" className="see-more-button">See All Projects</Link>
      </div>
    </Section>
  );
}

export default ProjectsSection;

