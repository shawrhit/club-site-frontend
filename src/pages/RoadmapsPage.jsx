import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SkeletonGrid } from '../components/SkeletonCard';
import { apiFetch } from '../api';
import { buildDetailPath } from '../utils/contentRouting';

function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/roadmaps/')
      .then(response => response.json())
      .then(data => {
        setRoadmaps(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching roadmaps:', error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="page-container roadmaps-page">
      <Helmet>
        <title>Learning Roadmaps | GDG On Campus NEHU</title>
        <meta name="description" content="Curated learning paths to guide you from beginner to expert in electronics and software domains." />
        <meta property="og:title" content="Learning Roadmaps | GDG On Campus NEHU" />
        <meta property="og:description" content="Your guide to mastering key domains in electronics and software." />
        <meta property="og:type" content="website" />
      </Helmet>
       <div className="page-header">
        <h1 className="page-title">Learning Roadmaps</h1>
        <p className="page-subtitle">Your guide to mastering key domains in the world of electronics and software.</p>
      </div>

      {loading ? (
        <SkeletonGrid count={4} variant="roadmap" />
      ) : (
        <div className="grid-layout">
          {roadmaps.map((roadmap, index) => (
            <Link
              key={roadmap.id}
              to={buildDetailPath('roadmaps', roadmap)}
              className={`glass-card roadmap-card card-variant-${(index % 4) + 1} card-link`}
            >
              <div className="icon">{roadmap.icon_name}</div>
              <h3>{roadmap.title}</h3>
              <p>{roadmap.description}</p>
              <span className="cta-link">Start Learning →</span>
            </Link>
          ))}
        </div>
      )}

       <div className="back-link-container">
        <Link to="/" className="see-more-button">&larr; Back to Home</Link>
      </div>
    </main>
  );
}

export default RoadmapsPage;
