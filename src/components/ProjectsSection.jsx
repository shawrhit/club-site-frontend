import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import GlassCard from './GlassCard';

function ProjectsSection({ projects = [], loading = false }) {
  const getTagName = (tag) => (typeof tag === 'string' ? tag : tag?.name);
  const showProjects = projects.slice(0, 3);

  return (
    <Section
      id="projects"
      eyebrow="FEATURED"
      title="What We Build"
      subtitle="From autonomous robots to smart IoT devices, our projects are a testament to our passion for innovation."
    >
      <div className="grid-layout">
        {showProjects.map((project, index) => (
          <Link to={`/projects/${project.id}`} key={project.id} className="card-link">
            <GlassCard
              imgSrc={project.image_url || project.photo_url}
              title={project.title || project.name}
              description={project.summary || project.description}
              tags={(project.tags || []).map(getTagName).filter(Boolean)}
              date={project.published_date || project.event_date}
              className={`card-variant-${(index % 4) + 1}`}
            />
          </Link>
        ))}
        {!showProjects.length && loading && <div className="muted">Loading projects...</div>}
      </div>
      <div className="see-more-container">
        <Link to="/projects" className="see-more-button">See All Projects</Link>
      </div>
    </Section>
  );
}

export default ProjectsSection;

