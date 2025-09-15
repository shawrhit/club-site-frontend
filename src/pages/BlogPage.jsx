import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for the back button
import GlassCard from '../components/GlassCard'; // Note the '../' to go up one directory

const API_BASE_URL = 'http://127.0.0.1:8000';

function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Fetch all blog posts from the API
    fetch(`${API_BASE_URL}/api/blog/`)
      .then(response => response.json())
      .then(data => setBlogPosts(data))
      .catch(error => console.error('Error fetching blog posts:', error));
  }, []);

  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">From the Blog</h1>
        <p className="page-subtitle">Explore all our articles, tutorials, and club updates.</p>
      </div>
      
      <div className="grid-layout">
        {blogPosts.map(post => (
          <GlassCard
            key={post.id}
            imgSrc={post.image}
            title={post.title}
            description={post.summary}
            tags={post.tags.map(tag => tag.name)}
            date={post.publish_date}
          />
        ))}
      </div>
      
      <div className="back-link-container">
        <Link to="/" className="see-more-button">&larr; Back to Home</Link>
      </div>
    </main>
  );
}

export default BlogPage;