import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { Globe, ExternalLink } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { apiFetch, fetchProjectDetail } from '../api';
import { processContent } from '../utils/contentProcessor';
import { buildDetailPath } from '../utils/contentRouting';
import '../styles/CKEditorContent.css';

const ensureExternalUrl = (value) => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const InfoBadge = ({ kind }) => {
  const iconMap = {
    openSource: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 2 9l10 6 10-6-10-6Z" />
        <path d="M6 12v6l6 3 6-3v-6" />
      </svg>
    ),
    repo: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16v16" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),
    demo: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m10 9 6 3-6 3V9Z" />
      </svg>
    ),
    status: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5 11 15l5-6" />
      </svg>
    ),
  };

  return (
    <span className={`event-icon-badge event-icon-badge--${kind}`}>
      {iconMap[kind] || iconMap.repo}
    </span>
  );
};

const CONTRIBUTOR_LINKS = [
  { key: 'github_url', type: 'github', label: 'GitHub' },
  { key: 'linkedin_url', type: 'linkedin', label: 'LinkedIn' },
  { key: 'website_url', type: 'website', label: 'Website' },
];

const ContributorLinkIcon = ({ type }) => {
  switch (type) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" role="presentation">
          <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.52 2.87 8.36 6.84 9.71.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.2-1.1-1.52-1.1-1.52-.9-.64.07-.63.07-.63 1 .07 1.52 1.05 1.52 1.05.9 1.57 2.36 1.12 2.94.85.1-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .85-.28 2.78 1.05a9.36 9.36 0 0 1 2.53-.35c.86 0 1.73.12 2.53.35 1.92-1.33 2.77-1.05 2.77-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.82-4.58 5.07.36.32.68.94.68 1.9v2.82c0 .26.18.58.69.48A10.02 10.02 0 0 0 22 12.24C22 6.58 17.52 2 12 2z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" role="presentation">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.66 4.78 6.11V21h-4v-5.45c0-1.3-.02-2.98-1.82-2.98-1.82 0-2.1 1.42-2.1 2.88V21H9z" />
        </svg>
      );
    case 'website':
    default:
      return <Globe size={16} aria-hidden="true" />;
  }
};

function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [moreProjects, setMoreProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setErrorMessage('');

    fetchProjectDetail(slug)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then((data) => {
        setProject(data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load this project right now.');
        setIsLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    apiFetch('/api/projects/')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter((item) => String(item.id) !== String(project?.id));
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setMoreProjects(shuffled.slice(0, 3));
      })
      .catch(() => {
        setMoreProjects([]);
      });
  }, [project?.id, slug]);

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
    typeof window !== 'undefined' ? window.location.href : `https://gdgnehu.pages.dev/projects/${slug}`;
  const repoUrl = ensureExternalUrl(project.repo_url);
  const demoUrl = ensureExternalUrl(project.demo_url);
  const openSourceState =
    typeof project.is_open_source === 'boolean'
      ? project.is_open_source
        ? 'Open Source'
        : 'Closed Source'
      : '';
  const projectStatusLabel = project.status
    ? project.status
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : '';
  const hasProjectMetaCard = Boolean(openSourceState || projectStatusLabel || repoUrl || demoUrl);
  const contributors = Array.isArray(project.contributors)
    ? [...project.contributors].sort((a, b) => {
        const orderA = typeof a?.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
        const orderB = typeof b?.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      })
    : [];

  const buildContributorLinks = (contributor) =>
    CONTRIBUTOR_LINKS.map(({ key, type, label }) => {
      const normalized = ensureExternalUrl(contributor?.[key]);
      return normalized ? { type, label, url: normalized } : null;
    }).filter(Boolean);

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

      <div className="page-container event-detail-layout">
        <div className="event-detail-main">
          <div className="blog-post-content ck-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

          {contributors.length > 0 && (
            <section className="event-speakers-section">
              <h2>Contributors</h2>
              <div className="event-speakers-grid">
                {contributors.map((contributor, index) => {
                  const contributorLinks = buildContributorLinks(contributor);
                  return (
                    <article key={`${contributor?.name || 'contributor'}-${index}`} className="event-speaker-card">
                      {contributor?.photo_url ? (
                        <img
                          src={contributor.photo_url}
                          alt={contributor.name || 'Contributor'}
                          className="event-speaker-avatar"
                        />
                      ) : (
                        <span className="event-speaker-avatar event-speaker-avatar--placeholder" aria-hidden="true">
                          <svg viewBox="0 0 24 24" className="event-icon-svg">
                            <circle cx="12" cy="8" r="3.5" />
                            <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
                          </svg>
                        </span>
                      )}
                      <h3>{contributor?.name || 'Contributor'}</h3>
                      {contributor?.role_type && (
                        <p className="event-speaker-role">{contributor.role_type}</p>
                      )}
                      {contributorLinks.length > 0 && (
                        <div className="event-speaker-links">
                          {contributorLinks.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="event-speaker-link"
                              aria-label={`${contributor?.name || 'Contributor'} on ${link.label}`}
                            >
                              <span className="speaker-pill-icon" aria-hidden="true">
                                <ContributorLinkIcon type={link.type} />
                              </span>
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {hasProjectMetaCard && (
          <aside className="event-detail-sidebar">
            <section className="event-info-card">
              {openSourceState && (
                <div className="event-info-row">
                  <InfoBadge kind="openSource" />
                  <div>
                    <p className="event-info-label">Project Type</p>
                    <p className="event-info-value">{openSourceState}</p>
                  </div>
                </div>
              )}

              {projectStatusLabel && (
                <div className="event-info-row">
                  <InfoBadge kind="status" />
                  <div>
                    <p className="event-info-label">Status</p>
                    <p className="event-info-value">{projectStatusLabel}</p>
                  </div>
                </div>
              )}

              {repoUrl && (
                <div className="event-info-row">
                  <InfoBadge kind="repo" />
                  <div>
                    <p className="event-info-label">Repository</p>
                    <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="event-inline-link event-resource-link">
                      <ExternalLink size={13} />
                      View Code
                    </a>
                  </div>
                </div>
              )}

              {demoUrl && (
                <div className="event-info-row">
                  <InfoBadge kind="demo" />
                  <div>
                    <p className="event-info-label">Live Demo</p>
                    <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="event-inline-link event-resource-link">
                      <ExternalLink size={13} />
                      Visit Site
                    </a>
                  </div>
                </div>
              )}
            </section>
          </aside>
        )}
      </div>

      {moreProjects.length > 0 && (
        <div className="page-container">
          <section className="related-posts-section">
            <div className="related-posts-header">
              <div>
                <h2 className="related-posts-title">You may also like</h2>
                <p className="related-posts-subtitle">Check out more builds</p>
              </div>
            </div>
            <div className="grid-layout related-grid">
              {moreProjects.slice(0, 3).map((item, index) => (
                <Link to={buildDetailPath('projects', item)} key={item.id} className="card-link">
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
          <div className="back-link-container">
            <Link to="/projects" className="see-more-button">All Projects</Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProjectDetailPage;
