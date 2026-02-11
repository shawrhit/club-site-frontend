import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import GlassCard from './GlassCard';
import { apiFetch } from '../api';

function EventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiFetch('/api/events/')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const getTagName = (tag) => (typeof tag === 'string' ? tag : tag?.name);

  return (
    <Section
      id="events"
      eyebrow="HAPPENING"
      title="Events & Meetups"
      subtitle="Workshops, build nights, and demos you can join in person or online."
    >
      <div className="grid-layout">
        {events.slice(0, 3).map((event, index) => (
          <Link to={`/events/${event.id}`} key={event.id} className="card-link">
            <GlassCard
              imgSrc={event.image_url}
              title={event.title}
              description={event.summary}
              tags={(event.tags || []).map(getTagName).filter(Boolean)}
              date={event.event_date}
              className={`card-variant-${(index % 4) + 1}`}
            />
          </Link>
        ))}
      </div>
      <div className="see-more-container">
        <Link to="/events" className="see-more-button">See All Events</Link>
      </div>
    </Section>
  );
}

export default EventsSection;
