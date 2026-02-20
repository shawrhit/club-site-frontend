import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import GlassCard from '../components/GlassCard';
import { apiFetch } from '../api';
import { processContent } from '../utils/contentProcessor';
import '../styles/CKEditorContent.css';

function BlogDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [morePosts, setMorePosts] = useState([]);
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

  useEffect(() => {
    apiFetch('/api/blog/')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter((item) => String(item.id) !== String(postId));
        setMorePosts(filtered.slice(0, 3));
      })
      .catch(() => {
        setMorePosts([]);
      });
  }, [postId]);

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
            <Link to="/blog" className="see-more-button">All Posts</Link>
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
  const relatedPosts = Array.isArray(post.related_posts) ? post.related_posts : [];
  const suggestedPosts = relatedPosts.length > 0 ? relatedPosts.slice(0, 3) : morePosts;
  const summaryText = post.summary || '';
  const pageTitle = `${post.title || 'Blog'} | GDGOC NEHU`;
  const pageDescription = post.short_description || post.summary || 'Read more on GDGOC NEHU';
  const pageImage = post.banner_image || post.image_url || post.image || 'https://gdgnehu.pages.dev/og-default.png';
  const pageUrl =
    typeof window !== 'undefined' ? window.location.href : `https://gdgnehu.pages.dev/blog/${postId}`;

  const handleShare = async () => {
    const shareData = {
      title: post.title || 'GDGOC NEHU Blog',
      text: post.summary || 'Check this post from GDG On Campus | NEHU',
      url: pageUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(pageUrl);
      window.alert('Link copied to clipboard.');
    } catch (_) {
      // no-op
    }
  };

  return (
    <main className="blog-detail-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={post.title || 'GDGOC NEHU'} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
      </Helmet>
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
            <div className="blog-hero-actions">
              <button type="button" className="blog-hero-link blog-hero-share" onClick={handleShare}>
                <span className="share-inline-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 12v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-7" />
                    <path d="M12 16V4" />
                    <path d="m8.5 7.5 3.5-3.5 3.5 3.5" />
                  </svg>
                </span>
                Share
              </button>
            </div>
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

          {suggestedPosts.length > 0 && (
            <div className="related-posts-section">
              <div className="related-posts-header">
                <div>
                  <h2 className="related-posts-title">You may also like</h2>
                  <p className="related-posts-subtitle">Dive deeper into the archives</p>
                </div>
              </div>
              <div className="grid-layout related-grid">
                {suggestedPosts.map((relatedPost, index) => (
                  <Link to={`/blog/${relatedPost.id}`} key={relatedPost.id} className="card-link">
                    <GlassCard
                      imgSrc={relatedPost.image_url}
                      title={relatedPost.title}
                      description={relatedPost.summary}
                      date={relatedPost.published_date}
                      tags={[]}
                      className={`card-variant-${(index % 4) + 1}`}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="back-link-container">
            <Link to="/blog" className="see-more-button">All Posts</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default BlogDetailPage;

