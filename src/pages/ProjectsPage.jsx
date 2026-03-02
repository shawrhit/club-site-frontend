import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import GlassCard from '../components/GlassCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import { apiFetch } from '../api';
import { buildDetailPath } from '../utils/contentRouting';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroProject = projects[0];
  const remainingProjects = projects.slice(1);
  const getTagName = (tag) => (typeof tag === 'string' ? tag : tag?.name);
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    apiFetch('/api/projects/')
      .then(response => response.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="page-container blog-page projects-page">
      <Helmet>
        <title>Projects | GDG On Campus NEHU</title>
        <meta name="description" content="Explore projects built by the GDG On Campus NEHU community. A showcase of creativity, technical skills, and collaborative innovation." />
        <meta property="og:title" content="Projects | GDG On Campus NEHU" />
        <meta property="og:description" content="Explore projects built by the GDG On Campus NEHU community." />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="blog-hero hero-blue">
        <div className="blog-hero-inner">
          <div className="blog-hero-media">
            {heroProject?.image_url ? (
              <img src={heroProject.image_url} alt={heroProject.title} />
            ) : (
              <div className="blog-hero-placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="blog-hero-content">
            <div className="blog-hero-tags">
              {(heroProject?.tags || []).slice(0, 3).map((tag) => (
                <span key={tag.id || getTagName(tag)} className="blog-hero-tag">
                  {getTagName(tag)}
                </span>
              ))}
            </div>
            <h1 className="blog-hero-title">
              {heroProject?.title || 'Our Projects'}
            </h1>
            <p className="blog-hero-dek">
              {heroProject?.description || 'A showcase of our members\' passion, creativity, and technical skills.'}
            </p>
            {heroProject?.published_date && (
              <p className="blog-hero-meta">
                <span className="blog-hero-date">{formatDate(heroProject.published_date)}</span>
              </p>
            )}
            <div className="blog-hero-actions">
              {heroProject?.id ? (
                <Link to={buildDetailPath('projects', heroProject)} className="blog-hero-button">
                  View project
                </Link>
              ) : (
                <Link to="/projects" className="blog-hero-button">
                  Explore projects
                </Link>
              )}
              <Link to="/" className="blog-hero-link">Back to Home</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-grid-section">
        <div className="blog-grid-header">
          <h2>More projects</h2>
          <p>Build logs, demos, and product ideas from the community.</p>
        </div>
        {loading ? (
          <SkeletonGrid count={3} variant="card" />
        ) : (
          <div className="grid-layout">
            {remainingProjects.map(project => (
              <Link to={buildDetailPath('projects', project)} key={project.id} className="card-link">
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
        )}
      </section>

      <div className="back-link-container">
        <Link to="/" className="see-more-button">&larr; Back to Home</Link>
      </div>
    </main>
  );
}

export default ProjectsPage;
