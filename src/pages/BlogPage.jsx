import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { apiFetch } from '../api';

function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const heroPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

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
    apiFetch('/api/blog/')
      .then(response => response.json())
      .then(data => {
        // Sort newest first so the hero reflects the latest post.
        const sortedPosts = Array.isArray(data)
          ? [...data].sort((a, b) => new Date(b.published_date || 0) - new Date(a.published_date || 0))
          : [];
        setBlogPosts(sortedPosts);
      })
      .catch(error => console.error('Error fetching blog posts:', error));
  }, []);

  return (
    <main className="page-container blog-page">
      <section className="blog-hero hero-yellow">
        <div className="blog-hero-inner">
          <div className="blog-hero-media">
            {heroPost?.image_url ? (
              <img src={heroPost.image_url} alt={heroPost.title} />
            ) : (
              <div className="blog-hero-placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="blog-hero-content">
            <div className="blog-hero-tags">
              {(heroPost?.tags || []).slice(0, 3).map((tag) => (
                <span key={tag.id || getTagName(tag)} className="blog-hero-tag">
                  {getTagName(tag)}
                </span>
              ))}
            </div>
            <h1 className="blog-hero-title">
              {heroPost?.title || "Latest from Google Developer's Group, NEHU"}
            </h1>
            <p className="blog-hero-dek">
              {heroPost?.summary || "Stories, tutorials, and experiments from the GDG NEHU community."}
            </p>
            {(heroPost?.author_name || heroPost?.published_date) && (
              <p className="blog-hero-meta">
                {heroPost?.author_name && (
                  <span className="blog-hero-byline">by {heroPost.author_name}</span>
                )}
                {heroPost?.published_date && (
                  <span className="blog-hero-date">{formatDate(heroPost.published_date)}</span>
                )}
              </p>
            )}
            <div className="blog-hero-actions">
              {heroPost?.id ? (
                <Link to={`/blog/${heroPost.id}`} className="blog-hero-button">
                  Read story
                </Link>
              ) : (
                <Link to="/" className="blog-hero-button">
                  Explore updates
                </Link>
              )}
              <Link to="/" className="blog-hero-link">Back to Home</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-grid-section">
        <div className="blog-grid-header">
          <h2>More stories</h2>
          <p>Fresh posts from members, mentors, and event organizers.</p>
        </div>
        <div className="grid-layout">
          {remainingPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="card-link">
              <GlassCard
                imgSrc={post.image_url}
                title={post.title}
                description={post.summary}
                tags={(post.tags || []).map(getTagName).filter(Boolean)}
                date={post.published_date}
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default BlogPage;