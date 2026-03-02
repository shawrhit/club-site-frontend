import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SkeletonGrid } from '../components/SkeletonCard';
import { apiFetch } from '../api';
import { buildDetailPath } from '../utils/contentRouting';

const DEFAULT_AVATAR = '/GDG_Logo.png';

function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/team/')
      .then(response => response.json())
      .then(data => {
        setTeamMembers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching team members:', error);
        setLoading(false);
      });
  }, []);

  const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  return (
    <main className="page-container">
      <Helmet>
        <title>Team | GDG On Campus NEHU</title>
        <meta name="description" content="Meet the passionate individuals driving GDG On Campus NEHU's mission and activities." />
        <meta property="og:title" content="Team | GDG On Campus NEHU" />
        <meta property="og:description" content="Meet the core team behind GDG On Campus NEHU." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="page-header">
        <h1 className="page-title">The Core Team</h1>
        <p className="page-subtitle">The passionate individuals driving GDGOC NEHU's mission and activities.</p>
      </div>
      
      {loading ? (
        <SkeletonGrid count={8} variant="team" />
      ) : (
        <div className="grid-layout team-grid">
          {teamMembers.map((member, index) => (
            <Link
              to={buildDetailPath('team', member)}
              key={member.id}
              className={`glass-card team-card card-variant-${(index % 4) + 1} card-link`}
            >
              <img
                src={member.photo_url || DEFAULT_AVATAR}
                alt={member.name}
                loading="lazy"
                onError={handleImageError}
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
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

export default TeamPage;

