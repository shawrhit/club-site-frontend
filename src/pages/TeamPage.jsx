import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';

function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    apiFetch('/api/team/')
      .then(response => response.json())
      .then(data => setTeamMembers(data))
      .catch(error => console.error('Error fetching team members:', error));
  }, []);

  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">The Core Team</h1>
        <p className="page-subtitle">The passionate individuals driving GDGOC NEHU's mission and activities.</p>
      </div>
      
      <div className="grid-layout team-grid">
        {teamMembers.map((member, index) => (
          <Link
            to={`/team/${member.id}`}
            key={member.id}
            className={`glass-card team-card card-variant-${(index % 4) + 1} card-link`}
          >
            <img src={member.photo_url} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </Link>
        ))}
      </div>

      <div className="back-link-container">
        <Link to="/" className="see-more-button">&larr; Back to Home</Link>
      </div>
    </main>
  );
}

export default TeamPage;

