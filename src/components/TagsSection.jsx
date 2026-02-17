import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';

function TagsSection({ tags = [], loading = false, error = null }) {
  const fallback = ['Arduino', 'Raspberry Pi', 'IoT', 'Robotics', 'AI / ML', 'PCB Design', 'Web Development', '3D Printing', 'Drones', 'Signal Processing'];
  const showTags = tags.length ? tags : (error ? fallback : []);

  return (
    <Section
      id="tags"
      eyebrow="EXPLORE"
      title="Explore Topics"
      subtitle="Dive into the topics that interest you the most. Find related projects, blog posts, and resources."
    >
      <div className="explore-tags-container">
        {loading && !showTags.length && <div className="muted">Loading topics...</div>}
        {showTags.map((tag) => {
          const name = tag.name || tag.title || tag.label || tag.slug || String(tag);
          const slug = tag.slug || (typeof tag === 'string' ? tag.toLowerCase().replace(/\s+/g, '-') : undefined);
          return slug ? (
            <Link key={slug} to={`/tags/${encodeURIComponent(slug)}`} className="explore-tag">
              {name}
            </Link>
          ) : (
            <span key={name} className="explore-tag">{name}</span>
          );
        })}
      </div>
    </Section>
  );
}

export default TagsSection;
