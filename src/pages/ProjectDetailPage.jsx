import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { apiFetch } from '../api';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setErrorMessage('');

    apiFetch(`/api/projects/${projectId}/`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then((data) => {
        setProject(data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load this project right now.');
        setIsLoading(false);
      });
  }, [projectId]);

  if (isLoading) {
    return (
      <main className="page-container">
        <div className="blog-post-container">Loading...</div>
      </main>
    );
  }

  if (errorMessage || !project) {
    return (
      <main className="page-container">
        <div className="blog-post-container">
          <p>{errorMessage || 'This project is unavailable.'}</p>
          <div className="back-link-container">
            <Link to="/projects" className="see-more-button">&larr; All Projects</Link>
          </div>
        </div>
      </main>
    );
  }

  const contentHtml = project.content || (project.description ? `<p>${project.description}</p>` : '<p>Details coming soon.</p>');
  const sanitizedContent = DOMPurify.sanitize(contentHtml);
  const formattedDate = project.published_date
    ? new Date(project.published_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const tagList = (project.tags || []).map((tag) => (typeof tag === 'string' ? tag : tag.name)).filter(Boolean);

  return (
    <main className="blog-detail-page">
      <section className="blog-hero blog-hero-detail hero-blue">
        <div className="blog-hero-inner">
          <div className="blog-hero-media">
            {project.image_url ? (
              <img src={project.image_url} alt={project.title} />
            ) : (
              <div className="blog-hero-placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="blog-hero-content">
            <p className="post-category">PROJECT</p>
            <div className="blog-hero-tags">
              {tagList.slice(0, 3).map((tag) => (
                <span key={tag} className="blog-hero-tag">{tag}</span>
              ))}
            </div>
            <h1 className="blog-hero-title">{project.title}</h1>
            {project.description && <p className="blog-hero-dek">{project.description}</p>}
            {formattedDate && (
              <p className="blog-hero-meta">
                <span className="blog-hero-date">{formattedDate}</span>
              </p>
            )}
            <div className="blog-hero-actions">
              <Link to="/projects" className="blog-hero-link">Back to Projects</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container">
        <div className="blog-post-container">
          <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
      </div>
    </main>
  );
}

export default ProjectDetailPage;
