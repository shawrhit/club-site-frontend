import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import { apiFetch } from '../api';

function TagsSection() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const res = await apiFetch('/api/tags/', { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load tags');
        const json = await res.json();
        // Backend may return { tags: [...] } or an array directly or { results: [...] }
        const arr = Array.isArray(json) ? json : (json.tags || json.results || []);
        setTags(arr);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  // Fallback static tags if API fails or returns empty
  const fallback = ["Arduino", "Raspberry Pi", "IoT", "Robotics", "AI / ML", "PCB Design", "Web Development", "3D Printing", "Drones", "Signal Processing"];
  const showTags = tags.length ? tags : (error ? fallback : []);

  return (
    <Section
      id="tags"
      eyebrow="EXPLORE"
      title="Explore Topics"
      subtitle="Dive into the topics that interest you the most. Find related projects, blog posts, and resources."
    >
      <div className="explore-tags-container">
        {loading && !showTags.length && <div className="muted">Loading topics…</div>}
        {showTags.map(tag => {
          const name = tag.name || tag.title || tag;
          const slug = tag.slug || (typeof tag === 'string' ? tag.toLowerCase().replace(/\s+/g, '-') : undefined);
          return slug ? (
            <Link key={slug} to={`/tags/${encodeURIComponent(slug)}`} className="explore-tag">
              {name}{tag.count ? ` • ${tag.count}` : ''}
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

