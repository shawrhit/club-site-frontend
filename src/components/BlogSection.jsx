import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import GlassCard from './GlassCard';
import { apiFetch } from '../api';

function BlogSection() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    apiFetch('/api/blog/')
      .then(response => response.json())
      .then(data => setBlogPosts(data))
      .catch(error => console.error('Error fetching blog posts:', error));
  }, []);

  return (
    <Section
      id="blog"
      eyebrow="LATEST"
      title="Latest from the Blog"
      subtitle="Insights, tutorials, and stories from our members. Dive in and learn something new."
    >
      <div className="grid-layout">
        {blogPosts.slice(0, 3).map((post, index) => (
          <Link to={`/blog/${post.id}`} key={post.id} className="card-link">
            <GlassCard
              imgSrc={post.image_url}
              title={post.title}
              description={post.summary}
              tags={(post.tags || []).map(tag => tag.name)}
              date={post.published_date}
              className={`card-variant-${(index % 4) + 1}`}
            />
          </Link>
        ))}
      </div>
      
      <div className="see-more-container">
        <Link to="/blog" className="see-more-button">See All Posts</Link>
      </div>
    </Section>
  );
}

export default BlogSection;