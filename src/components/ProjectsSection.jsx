import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import GlassCard from './GlassCard';

const API_BASE_URL = 'http://127.0.0.1:8000';

function ProjectsSection() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects/`)
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  return (
    <Section
      id="projects"
      title="What We Build"
      subtitle="From autonomous robots to smart IoT devices, our projects are a testament to our passion for innovation."
    >
      <div className="grid-layout">
        {/* The loop variable here is 'project' */}
        {projects.slice(0, 3).map(project => (
          <GlassCard
            key={project.id}
            imgSrc={project.image}
            title={project.title}
            description={project.description}
            tags={project.tags.map(tag => tag.name)}
            date={project.published_date}  // Pass the published date to GlassCard
          />
        ))}
      </div>
      <div className="see-more-container">
        <Link to="/projects" className="see-more-button">See All Projects</Link>
      </div>
    </Section>
  );
}

export default ProjectsSection;

