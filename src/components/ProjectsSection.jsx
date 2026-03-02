import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import GlassCard from './GlassCard';
import { buildDetailPath } from '../utils/contentRouting';

function ProjectsSection({ projects = [], loading = false }) {
  const getTagName = (tag) => (typeof tag === 'string' ? tag : tag?.name);
  const showProjects = projects.slice(0, 3);

  return (
    <Section
      id="projects"
      eyebrow="FEATURED"
      title="What We Build"
      subtitle="From electronics prototypes to impactful software, our projects reflect our shared drive to learn, build, and innovate."
      seeAllLink={{ href: "/projects", text: "See All Projects →" }}
    >
      <div className="grid-layout">
        {showProjects.map((project, index) => (
          <Link to={buildDetailPath('projects', project)} key={project.id} className="card-link">
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
    </Section>
  );
}

export default ProjectsSection;

