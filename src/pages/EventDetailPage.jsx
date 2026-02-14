import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { ExternalLink } from 'lucide-react';
import { apiFetch } from '../api';

const HOUR_MS = 60 * 60 * 1000;

function IconBadge({ kind }) {
  const iconMap = {
    date: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </svg>
    ),
    time: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </svg>
    ),
    location: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    video: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10 5-3v10l-5-3z" />
      </svg>
    ),
    social: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 10v8M8 7.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 18v-4.3c0-1.6 1.1-2.7 2.6-2.7S17 12 17 13.7V18" />
      </svg>
    ),
    mode: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M7 8h10M7 12h7M7 16h5" />
      </svg>
    ),
  };

  return (
    <span className={`event-icon-badge event-icon-badge--${kind}`}>
      {iconMap[kind]}
    </span>
  );
}

function EventDetailPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setErrorMessage('');

    apiFetch(`/api/events/${eventId}/`)
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

  const eventDate = useMemo(() => {
    if (!event?.event_date) return null;
    const parsed = new Date(event.event_date);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [event?.event_date]);

  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const formattedTime = eventDate
    ? eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  const contentHtml = event?.content || (event?.summary ? `<p>${event.summary}</p>` : '<p>Details coming soon.</p>');
  const sanitizedContent = DOMPurify.sanitize(contentHtml);

  const mode = (event?.mode || 'physical').toLowerCase();
  const techTags = Array.isArray(event?.tech_tags)
    ? event.tech_tags.filter((tag) => typeof tag === 'string' && tag.trim().length > 0)
    : [];
  const resources = Array.isArray(event?.resources)
    ? event.resources.filter((item) => item && item.label && item.url)
    : [];

  const isArchived = (() => {
    if (!eventDate) return false;
    return Date.now() - eventDate.getTime() > 2 * HOUR_MS;
  })();

  const isLiveWindow = (() => {
    if (!eventDate) return false;
    return Math.abs(Date.now() - eventDate.getTime()) <= HOUR_MS;
  })();

  const renderActionButton = () => {
    if (isArchived) {
      return (
        <button type="button" className="event-action-btn" disabled>
          Event Ended
        </button>
      );
    }

    if (isLiveWindow && (mode === 'virtual' || mode === 'hybrid') && event?.meeting_link) {
      return (
        <a href={event.meeting_link} target="_blank" rel="noopener noreferrer" className="event-action-btn">
          Join Session
        </a>
      );
    }

    if (event?.requires_registration === false) {
      return (
        <button type="button" className="event-action-btn" disabled>
          Open to All / Walk-in
        </button>
      );
    }

    if (event?.registration_link) {
      return (
        <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="event-action-btn">
          Register Now
        </a>
      );
    }

    return (
      <button type="button" className="event-action-btn" disabled>
        Register Now
      </button>
    );
  };

  const modeLabel =
    mode === 'virtual'
      ? 'Virtual'
      : mode === 'hybrid'
      ? 'Hybrid'
      : 'Physical';

  const speakerList = Array.isArray(event?.speakers) ? event.speakers : [];
  const galleryImages = Array.isArray(event?.gallery_images)
    ? event.gallery_images.filter((url) => typeof url === 'string' && url.trim().length > 0)
    : [];

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
            <Link to="/events" className="see-more-button">
              &larr; All Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="blog-detail-page">
      <section className="blog-hero blog-hero-detail hero-green">
        <div className="blog-hero-inner">
          <div className="blog-hero-media">
            {event.image_url ? (
              <img src={event.image_url} alt={event.title} />
            ) : (
              <div className="blog-hero-placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="blog-hero-content">
            <p className="post-category">EVENT</p>
            {!!techTags.length && (
              <div className="blog-hero-tags">
                {techTags.slice(0, 4).map((tag) => (
                  <span key={tag} className="blog-hero-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="blog-hero-title">{event.title}</h1>
            {event.summary && <p className="blog-hero-dek">{event.summary}</p>}
            <div className="blog-hero-actions">
              <Link to="/events" className="blog-hero-link">
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container event-detail-layout">
        <div className="event-detail-main">
          <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

          {speakerList.length > 0 && (
            <section className="event-speakers-section">
              <h2>Speakers</h2>
              <div className="event-speakers-grid">
                {speakerList.map((speaker, index) => (
                  <article key={`${speaker.name || 'speaker'}-${index}`} className="event-speaker-card">
                    {speaker.profile_image ? (
                      <img src={speaker.profile_image} alt={speaker.name || 'Speaker'} className="event-speaker-avatar" />
                    ) : (
                      <span className="event-speaker-avatar event-speaker-avatar--placeholder" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="event-icon-svg">
                          <circle cx="12" cy="8" r="3.5" />
                          <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
                        </svg>
                      </span>
                    )}
                    <h3>{speaker.name || 'Guest Speaker'}</h3>
                    {speaker.role && <p className="event-speaker-role">{speaker.role}</p>}
                    {speaker.bio && <p className="event-speaker-bio">{speaker.bio}</p>}
                    {speaker.social_link && (
                      <a href={speaker.social_link} target="_blank" rel="noopener noreferrer" className="event-speaker-link">
                        <IconBadge kind="social" />
                        LinkedIn
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {galleryImages.length > 0 && (
            <section className="event-gallery-section">
              <h2>Event Highlights</h2>
              <div
                className="event-gallery-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '0.8rem',
                }}
              >
                {galleryImages.map((imageUrl, index) => (
                  <img
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={`Event highlight ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="event-detail-sidebar">
          <section className="event-info-card">
            <div className="event-info-row">
              <IconBadge kind="mode" />
              <div>
                <p className="event-info-label">Event Type</p>
                <p className="event-info-value">{modeLabel}</p>
              </div>
            </div>

            <div className="event-info-row">
              <IconBadge kind="date" />
              <div>
                <p className="event-info-label">Date</p>
                <p className="event-info-value">{formattedDate || 'TBA'}</p>
              </div>
            </div>

            <div className="event-info-row">
              <IconBadge kind="time" />
              <div>
                <p className="event-info-label">Time</p>
                <p className="event-info-value">{formattedTime || 'TBA'}</p>
              </div>
            </div>

            {(mode === 'physical' || mode === 'hybrid') && (
              <div className="event-info-row">
                <IconBadge kind="location" />
                <div>
                  <p className="event-info-label">Location</p>
                  <p className="event-info-value">{event?.location_address || 'Venue details coming soon'}</p>
                </div>
              </div>
            )}

            {(mode === 'virtual' || mode === 'hybrid') && (
              <div className="event-info-row">
                <IconBadge kind="video" />
                <div>
                  <p className="event-info-label">Meeting Link</p>
                  {event?.meeting_link ? (
                    <a
                      href={event.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-inline-link"
                    >
                      {event.meeting_link}
                    </a>
                  ) : (
                    <p className="event-info-value">Google Meet / Online</p>
                  )}
                </div>
              </div>
            )}

            <div className="event-action-wrap">{renderActionButton()}</div>
          </section>

          {techTags.length > 0 && (
            <section className="event-tech-card">
              <h3>Tech Stack</h3>
              <div className="event-pills-wrap">
                {techTags.map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {resources.length > 0 && (
            <section className="event-tech-card">
              <h3>Resources</h3>
              <div style={{ display: 'grid', gap: '0.55rem' }}>
                {resources.map((resource, index) => (
                  <a
                    key={`${resource.label}-${index}`}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      color: '#4285f4',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.opacity = '1';
                    }}
                  >
                    <ExternalLink size={14} />
                    {resource.label}
                  </a>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}

export default EventDetailPage;
