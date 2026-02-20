import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import GlassCard from '../components/GlassCard';
import { apiFetch } from '../api';
import { processContent } from '../utils/contentProcessor';
import '../styles/CKEditorContent.css';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [moreProjects, setMoreProjects] = useState([]);
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

  useEffect(() => {
    apiFetch('/api/projects/')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter((item) => String(item.id) !== String(projectId));
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setMoreProjects(shuffled.slice(0, 3));
      })
      .catch(() => {
        setMoreProjects([]);
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
            <Link to="/projects" className="see-more-button">All Projects</Link>
          </div>
        </div>
      </main>
    );
  }

  const contentHtml = project.content || (project.description ? `<p>${project.description}</p>` : '<p>Details coming soon.</p>');
  const processedContent = processContent(contentHtml);
  const sanitizedContent = DOMPurify.sanitize(processedContent, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy'],
  });
  const formattedDate = project.published_date
    ? new Date(project.published_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const tagList = (project.tags || []).map((tag) => (typeof tag === 'string' ? tag : tag.name)).filter(Boolean);
  const pageTitle = `${project.title || 'Project'} | GDGOC NEHU`;
  const pageDescription = project.short_description || project.summary || project.description || 'Read more on GDGOC NEHU';
  const pageImage =
    project.banner_image || project.image_url || project.image || 'https://gdgnehu.pages.dev/og-default.png';
  const pageUrl =
    typeof window !== 'undefined' ? window.location.href : `https://gdgnehu.pages.dev/projects/${projectId}`;

  const handleShare = async () => {
    const shareData = {
      title: project.title || 'GDGOC NEHU Project',
      text: project.summary || project.description || 'Check this project from GDG On Campus | NEHU',
      url: pageUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(pageUrl);
      window.alert('Link copied to clipboard.');
    } catch (_) {
      // no-op
    }
  };

  return (
    <main className="blog-detail-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={project.title || 'GDGOC NEHU'} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
      </Helmet>
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
              <button type="button" className="blog-hero-link blog-hero-share" onClick={handleShare}>
                <span className="share-inline-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 12v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-7" />
                    <path d="M12 16V4" />
                    <path d="m8.5 7.5 3.5-3.5 3.5 3.5" />
                  </svg>
                </span>
                Share
              </button>
              <Link to="/projects" className="blog-hero-link">Back to Projects</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container">
        <div className="blog-post-container">
          <div className="blog-post-content ck-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

          {moreProjects.length > 0 && (
            <section className="related-posts-section">
              <div className="related-posts-header">
                <div>
                  <h2 className="related-posts-title">You may also like</h2>
                  <p className="related-posts-subtitle">Check out more builds</p>
                </div>
              </div>
              <div className="grid-layout related-grid">
                {moreProjects.map((item, index) => (
                  <Link to={`/projects/${item.id}`} key={item.id} className="card-link">
                    <GlassCard
                      imgSrc={item.image_url}
                      title={item.title}
                      description={item.summary || item.description}
                      date={item.published_date}
                      tags={(item.tags || []).map((tag) => (typeof tag === 'string' ? tag : tag?.name)).filter(Boolean)}
                      className={`card-variant-${(index % 4) + 1}`}
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="back-link-container">
            <Link to="/projects" className="see-more-button">All Projects</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProjectDetailPage;
