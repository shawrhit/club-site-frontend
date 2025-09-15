import React, { useState, useEffect } from 'react';
import Section from './Section';
import { Link } from 'react-router-dom';
import GlassCard from './GlassCard';

// Define the base URL for your API
const API_BASE_URL = 'http://127.0.0.1:8000';

function BlogSection() {
  // --- STEP 2: Set up state and fetch data ---
  const [blogPosts, setBlogPosts] = useState([]); // Create state to hold blog posts

  useEffect(() => {
    // Fetch data from the Django API for blog posts
    fetch(`${API_BASE_URL}/api/blog/`)
      .then(response => response.json())
      .then(data => setBlogPosts(data)) // Update state with fetched data
      .catch(error => console.error('Error fetching blog posts:', error));
  }, []); // The empty array ensures this runs only once

  return (
    <Section
      id="blog"
      title="Latest from the Blog"
      subtitle="Insights, tutorials, and stories from our members. Dive in and learn something new."
    >
      {/* --- STEP 3: Render from state --- */}
      <div className="grid-layout">
        {blogPosts.map(post => (
          <GlassCard
            key={post.id}
            imgSrc={post.image}  // Construct full image URL
            title={post.title}
            description={post.summary} // Use the 'summary' field from your model
            tags={post.tags.map(tag => tag.name)} // Map over the nested tags array
          />
        ))}
      </div>
      <div className="see-more-container">
        <Link to="/blogs" className="see-more-button">See All Blogs</Link>
      </div>
    </Section>
  );
}

export default BlogSection;

