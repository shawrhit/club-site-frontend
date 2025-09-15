import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/team/`)
      .then(response => response.json())
      .then(data => setTeamMembers(data))
      .catch(error => console.error('Error fetching team members:', error));
  }, []);

  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">The Core Team</h1>
        <p className="page-subtitle">The passionate individuals driving the club's mission and activities.</p>
      </div>
      
      <div className="grid-layout team-grid">
        {teamMembers.map(member => (
          <div key={member.id} className="glass-card team-card">
            <img src={member.photo} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>

      <div className="back-link-container">
        <Link to="/" className="see-more-button">&larr; Back to Home</Link>
      </div>
    </main>
  );
}

export default TeamPage;
