import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

const API_BASE_URL = 'http://127.0.0.1:8000';

function EventDetailPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setErrorMessage('');

    fetch(`${API_BASE_URL}/api/events/${eventId}/`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then((data) => {
        setEvent(data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load this event right now.');
        setIsLoading(false);
      });
  }, [eventId]);

  if (isLoading) {
    return (
      <main className="page-container">
        <div className="blog-post-container">Loading...</div>
      </main>
    );
  }

  if (errorMessage || !event) {
    return (
      <main className="page-container">
        <div className="blog-post-container">
          <p>{errorMessage || 'This event is unavailable.'}</p>
          <div className="back-link-container">
            <Link to="/events" className="see-more-button">&larr; All Events</Link>
          </div>
        </div>
      </main>
    );
  }

  const contentHtml = event.content || (event.summary ? `<p>${event.summary}</p>` : '<p>Details coming soon.</p>');
  const sanitizedContent = DOMPurify.sanitize(contentHtml);
  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const tagList = (event.tags || []).map((tag) => (typeof tag === 'string' ? tag : tag.name)).filter(Boolean);

  return (
    <main className="blog-detail-page">
      <section className="blog-hero blog-hero-detail hero-green">
        <div className="blog-hero-inner">
          <div className="blog-hero-media">
            {event.image ? (
              <img src={event.image} alt={event.title} />
            ) : (
              <div className="blog-hero-placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="blog-hero-content">
            <p className="post-category">EVENT</p>
            <div className="blog-hero-tags">
              {tagList.slice(0, 3).map((tag) => (
                <span key={tag} className="blog-hero-tag">{tag}</span>
              ))}
            </div>
            <h1 className="blog-hero-title">{event.title}</h1>
            {event.summary && <p className="blog-hero-dek">{event.summary}</p>}
            {(event.location || formattedDate) && (
              <p className="blog-hero-meta">
                {event.location && (
                  <span className="blog-hero-byline">{event.location}</span>
                )}
                {formattedDate && (
                  <span className="blog-hero-date">{formattedDate}</span>
                )}
              </p>
            )}
            <div className="blog-hero-actions">
              <Link to="/events" className="blog-hero-link">Back to Events</Link>
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

export default EventDetailPage;
