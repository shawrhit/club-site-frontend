import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import GlassCard from '../components/GlassCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import { apiFetch } from '../api';
import { formatCalendarDate } from '../utils/eventRegistration';
import { buildDetailPath } from '../utils/contentRouting';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroEvent = events[0];
  const remainingEvents = events.slice(1);

  const getTagName = (tag) => (typeof tag === 'string' ? tag : tag?.name);

  useEffect(() => {
    apiFetch('/api/events/')
      .then((response) => response.json())
      .then((data) => {
        // Sort newest first so the hero reflects the latest event.
        const sortedEvents = Array.isArray(data)
          ? [...data].sort((a, b) => new Date(b.event_date || 0) - new Date(a.event_date || 0))
          : [];
        setEvents(sortedEvents);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="page-container blog-page events-page">
      <Helmet>
        <title>Events | GDG On Campus NEHU</title>
        <meta name="description" content="Upcoming events and build nights at GDG On Campus NEHU. Hands-on workshops, demos, and meetups for every skill level." />
        <meta property="og:title" content="Events | GDG On Campus NEHU" />
        <meta property="og:description" content="Upcoming events and build nights at GDG On Campus NEHU." />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="blog-hero hero-green">
        <div className="blog-hero-inner">
          <div className="blog-hero-media">
            {heroEvent?.image_url ? (
              <img src={heroEvent.image_url} alt={heroEvent.title} />
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
                  <span className="blog-hero-date">{formatCalendarDate(heroEvent.event_date)}</span>
                )}
              </p>
            )}
            <div className="blog-hero-actions">
              {heroEvent?.id ? (
                <Link to={buildDetailPath('events', heroEvent)} className="blog-hero-button">
                  View event
                </Link>
              ) : (
                <Link to="/events" className="blog-hero-button">
                  Explore events
                </Link>
              )}
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
        {loading ? (
          <SkeletonGrid count={3} variant="card" />
        ) : (
          <div className="grid-layout">
            {remainingEvents.map((event) => (
              <Link to={buildDetailPath('events', event)} key={event.id} className="card-link">
                <GlassCard
                  imgSrc={event.image_url}
                  title={event.title}
                  description={event.summary}
                  tags={(event.tags || []).map(getTagName).filter(Boolean)}
                  date={event.event_date}
                />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default EventsPage;
