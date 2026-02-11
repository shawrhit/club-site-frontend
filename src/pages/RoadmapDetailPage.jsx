import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

const API_BASE_URL = 'http://127.0.0.1:8000';

function RoadmapDetailPage() {
  const { roadmapId } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setErrorMessage('');

    fetch(`${API_BASE_URL}/api/roadmaps/${roadmapId}/`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then((data) => {
        setRoadmap(data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load this roadmap right now.');
        setIsLoading(false);
      });
  }, [roadmapId]);

  if (isLoading) {
    return (
      <main className="page-container">
        <div className="blog-post-container">Loading...</div>
      </main>
    );
  }

  if (errorMessage || !roadmap) {
    return (
      <main className="page-container">
        <div className="blog-post-container">
          <p>{errorMessage || 'This roadmap is unavailable.'}</p>
          <div className="back-link-container">
            <Link to="/roadmaps" className="see-more-button">&larr; All Roadmaps</Link>
          </div>
        </div>
      </main>
    );
  }

  const contentHtml = roadmap.content || (roadmap.description ? `<p>${roadmap.description}</p>` : '<p>Details coming soon.</p>');
  const sanitizedContent = DOMPurify.sanitize(contentHtml);

  return (
    <main className="blog-detail-page">
      <section className="blog-hero blog-hero-detail hero-pink">
        <div className="blog-hero-inner roadmap-hero">
          <div className="blog-hero-media roadmap-hero-media">
            <div className="roadmap-hero-emoji" aria-hidden="true">
              {roadmap.icon_name || '🧭'}
            </div>
          </div>
          <div className="blog-hero-content">
            <p className="post-category">ROADMAP</p>
            <h1 className="blog-hero-title">{roadmap.title}</h1>
            {roadmap.description && <p className="blog-hero-dek">{roadmap.description}</p>}
            <div className="blog-hero-actions">
              <Link to="/roadmaps" className="blog-hero-link">Back to Roadmaps</Link>
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

export default RoadmapDetailPage;
