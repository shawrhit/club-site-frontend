import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Section from '../components/Section';

function TagPage() {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        // Try with and without a trailing slash to be tolerant of backend config
        // Use apiFetch so requests are sent to the configured backend base URL
        let res = await (await import('../api')).apiFetch(`/api/tags/${encodeURIComponent(slug)}/`, { signal: controller.signal });
        if (!res.ok) {
          // try non-slash variant
          res = await (await import('../api')).apiFetch(`/api/tags/${encodeURIComponent(slug)}`, { signal: controller.signal });
        }
        if (!res.ok) throw new Error('Failed to load tag');
        const json = await res.json();

        // Support response shapes:
        // { tag: {...}, items: [...] }
        // { name, slug, items: [...] }
        // { tag: {...}, results: [...] }
        const tagObj = json.tag || { name: json.name || slug, slug: json.slug || slug, description: json.description };
        const rawItems = json.items || json.results || [];

        // Normalize items to the fields this UI expects
        const norm = (rawItems || []).map(it => ({
          id: it.id || it.pk,
          type: (it.type || it.item_type || '').replace(/s$/i, '').toLowerCase(),
          title: it.title || it.name || it.headline || '',
          excerpt: it.excerpt || it.summary || it.description || '',
          thumbnail: it.thumbnail || it.image_url || it.image || it.imageUrl || '',
          slug: it.slug || '' ,
          url: it.url || '' ,
        }));

        setTag(tagObj);
        setItems(norm);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [slug]);

  function itemLink(item) {
    if (!item) return '#';
    if (item.url) return item.url;
    const type = (item.type || '').toLowerCase();
    const id = item.id || item.pk || item.slug;
    switch (type) {
      case 'project': return `/projects/${id}`;
      case 'post':
      case 'blog': return `/blog/${id}`;
      case 'event': return `/events/${id}`;
      case 'roadmap': return `/roadmaps/${id}`;
      case 'team': return `/team/${id}`;
      default: return '#';
    }
  }

  return (
    <div>
      <Section eyebrow="TOPIC" title={tag ? tag.name : `#${slug}`} subtitle={tag && tag.description ? tag.description : 'Related projects, posts and events.'}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Link to="/" className="see-more-button" aria-label="Back to home">Back to home</Link>
        </div>
        {loading && <div className="muted">Loading…</div>}
        {error && <div className="error">Could not load this topic.</div>}

        {!loading && !error && !items.length && <div className="muted">No items found for this topic yet.</div>}

        <div className="tag-grid">
          {items.map((item, idx) => (
            <article key={item.id || item.slug || idx} className="glass-card">
              {item.thumbnail && <img src={item.thumbnail} alt="" />}
              <div className="card-content">
                <h3>{item.title || item.name || item.headline}</h3>
                {item.excerpt && <p>{item.excerpt}</p>}
                <div style={{ marginTop: 'auto' }}>
                  <Link className="see-more-button" to={itemLink(item)}>Open</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}

export default TagPage;
