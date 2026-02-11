import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import { apiFetch } from '../api';

function TeamSection() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    apiFetch('/api/team/')
      .then(response => response.json())
      .then(data => setTeamMembers(data))
      .catch(error => console.error('Error fetching team members:', error));
  }, []);

  return (
    <Section
      id="team"
      eyebrow="PEOPLE"
      title="Meet the Core Team"
      subtitle="The passionate individuals driving GDG NEHU's mission and activities."
    >
      <div className="grid-layout team-grid">
        {teamMembers.slice(0, 4).map((member, index) => (
          <Link
            key={member.id}
            to={`/team/${member.id}`}
            className={`glass-card team-card card-variant-${(index % 4) + 1} card-link`}
          >
            <img src={member.photo_url} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </Link>
        ))}
      </div>
      <div className="see-more-container">
        <Link to="/team" className="see-more-button">See All Members</Link>
      </div>
    </Section>
  );
}

export default TeamSection;

