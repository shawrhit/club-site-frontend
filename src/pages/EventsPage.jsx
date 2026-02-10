import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

const API_BASE_URL = 'http://127.0.0.1:8000';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const heroEvent = events[0];
  const remainingEvents = events.slice(1);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTagName = (tag) => (typeof tag === 'string' ? tag : tag?.name);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events/`)
      .then((response) => response.json())
      .then((data) => {
        // Sort newest first so the hero reflects the latest event.
        const sortedEvents = Array.isArray(data)
          ? [...data].sort((a, b) => new Date(b.event_date || 0) - new Date(a.event_date || 0))
          : [];
        setEvents(sortedEvents);
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  return (
    <main className="page-container blog-page">
      <section className="blog-hero hero-green">
        <div className="blog-hero-inner">
          <div className="blog-hero-media">
            {heroEvent?.image ? (
              <img src={heroEvent.image} alt={heroEvent.title} />
            ) : (
              <div className="blog-hero-placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="blog-hero-content">
            <div className="blog-hero-tags">
              {(heroEvent?.tags || []).slice(0, 3).map((tag) => (
                <span key={tag.id || getTagName(tag)} className="blog-hero-tag">
                  {getTagName(tag)}
                </span>
              ))}
            </div>
            <h1 className="blog-hero-title">
              {heroEvent?.title || 'Upcoming events and build nights'}
            </h1>
            <p className="blog-hero-dek">
              {heroEvent?.summary || 'Hands-on workshops, demos, and meetups for every skill level.'}
            </p>
            {(heroEvent?.event_date || heroEvent?.location) && (
              <p className="blog-hero-meta">
                {heroEvent?.location && (
                  <span className="blog-hero-byline">{heroEvent.location}</span>
                )}
                {heroEvent?.event_date && (
                  <span className="blog-hero-date">{formatDate(heroEvent.event_date)}</span>
                )}
              </p>
            )}
            <div className="blog-hero-actions">
              <Link to="/" className="blog-hero-link">Back to Home</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-grid-section">
        <div className="blog-grid-header">
          <h2>More events</h2>
          <p>Keep building with the community each month.</p>
        </div>
        <div className="grid-layout">
          {remainingEvents.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id} className="card-link">
              <GlassCard
                imgSrc={event.image}
                title={event.title}
                description={event.summary}
                tags={(event.tags || []).map(getTagName).filter(Boolean)}
                date={event.event_date}
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default EventsPage;
