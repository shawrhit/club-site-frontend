import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import GlassCard from './GlassCard';
import { buildDetailPath } from '../utils/contentRouting';

function EventsSection({ events = [], loading = false }) {
  const showEvents = events.slice(0, 3);
  const getTagName = (tag) => (typeof tag === 'string' ? tag : tag?.name);

  return (
    <Section
      id="events"
      eyebrow="HAPPENING"
      title="Events & Meetups"
      subtitle="Workshops, build nights, and demos you can join in person or online."
      seeAllLink={{ href: "/events", text: "See All Events →" }}
    >
      <div className="grid-layout">
        {showEvents.map((event, index) => (
          <Link to={buildDetailPath('events', event)} key={event.id} className="card-link">
            <GlassCard
              imgSrc={event.image_url}
              title={event.title}
              description={event.summary}
              tags={(event.tags || []).map(getTagName).filter(Boolean)}
              date={event.event_date || event.published_date}
              className={`card-variant-${(index % 4) + 1}`}
            />
          </Link>
        ))}
        {!showEvents.length && loading && <div className="muted">Loading events...</div>}
      </div>
    </Section>
  );
}

export default EventsSection;
