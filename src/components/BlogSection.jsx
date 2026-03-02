import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import GlassCard from './GlassCard';
import { buildDetailPath } from '../utils/contentRouting';

function BlogSection({ blogPosts = [], loading = false }) {
  const showBlogPosts = blogPosts.slice(0, 3);

  return (
    <Section
      id="blog"
      eyebrow="LATEST"
      title="Latest from the Blog"
      subtitle="Insights, tutorials, and stories from our members. Dive in and learn something new."
      seeAllLink={{ href: "/blog", text: "See All Posts →" }}
    >
      <div className="grid-layout">
        {showBlogPosts.map((post, index) => (
          <Link to={buildDetailPath('blog', post)} key={post.id} className="card-link">
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
        {!showBlogPosts.length && loading && <div className="muted">Loading posts...</div>}
      </div>
    </Section>
  );
}

export default BlogSection;
