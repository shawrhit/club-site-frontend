import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import GlassCard from '../components/GlassCard';
import { apiFetch } from '../api';
import { processContent } from '../utils/contentProcessor';
import '../styles/CKEditorContent.css';

function BlogDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); 
    setIsLoading(true);
    setErrorMessage('');

    apiFetch(`/api/blog/${postId}/`)
      .then(response => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then(data => {
        setPost(data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load this post right now.');
        setIsLoading(false);
      });
  }, [postId]);

  useEffect(() => {
    if (post && window.Prism) {
      const timer = setTimeout(() => {
        window.Prism.highlightAll();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [post]);

  if (isLoading) {
    return (
      <main className="page-container">
        <div className="blog-post-container">Loading...</div>
      </main>
    );
  }

  if (errorMessage || !post) {
    return (
      <main className="page-container">
        <div className="blog-post-container">
          <p>{errorMessage || 'This post is unavailable.'}</p>
          <div className="back-link-container">
            <Link to="/blog" className="see-more-button">&larr; All Posts</Link>
          </div>
        </div>
      </main>
    );
  }

  const processedContent = processContent(post.content || '<p>No content yet.</p>');
  const sanitizedContent = DOMPurify.sanitize(processedContent, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy'],
  });
  const formattedDate = post.published_date
    ? new Date(post.published_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const tagList = (post.tags || []).map(tag => (typeof tag === 'string' ? tag : tag.name)).filter(Boolean);
  const relatedPosts = post.related_posts || [];
  const summaryText = post.summary || '';

  return (
    <main className="blog-detail-page">
      <section className="blog-hero blog-hero-detail hero-yellow">
        <div className="blog-hero-inner">
          <div className="blog-hero-media">
            {post.image_url ? (
              <img src={post.image_url} alt={post.title} />
            ) : (
              <div className="blog-hero-placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="blog-hero-content">
            <p className="post-category">CLUB BLOG</p>
            <div className="blog-hero-tags">
              {tagList.slice(0, 3).map((tag) => (
                <span key={tag} className="blog-hero-tag">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="blog-hero-title">{post.title}</h1>
            {summaryText && <p className="blog-hero-dek">{summaryText}</p>}
            {(post.author_name || formattedDate) && (
              <p className="blog-hero-meta">
                {post.author_name && (
                  <span className="blog-hero-byline">by {post.author_name}</span>
                )}
                {formattedDate && (
                  <span className="blog-hero-date">{formattedDate}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="page-container">
        <div className="blog-post-container">
          <div
            className="blog-post-content ck-content"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {post.author && (
            <div className="author-box">
              {post.author.photo_url ? (
                <img src={post.author.photo_url} alt={post.author.name} className="author-photo" />
              ) : (
                <div className="author-photo author-photo-placeholder" aria-hidden="true" />
              )}
              <div className="author-details">
                <h3>About the Author</h3>
                <p className="author-name">{post.author.name}</p>
                <p>{post.author.bio}</p>
                {post.author.linkedin_url && (
                  <a href={post.author.linkedin_url} target="_blank" rel="noopener noreferrer" className="author-link">
                    Visit Profile
                  </a>
                )}
              </div>
            </div>
          )}

          {relatedPosts && relatedPosts.length > 0 && (
            <div className="related-posts-section">
              <h2 className="related-posts-title">You may also like</h2>
              <div className="grid-layout">
                {relatedPosts.map((relatedPost) => (
                  <Link to={`/blog/${relatedPost.id}`} key={relatedPost.id} className="card-link">
                    <GlassCard
                      imgSrc={relatedPost.image_url}
                      title={relatedPost.title}
                      description={relatedPost.summary}
                      date={relatedPost.published_date}
                      tags={[]}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="back-link-container">
            <Link to="/blog" className="see-more-button">&larr; All Posts</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BlogDetailPage;

