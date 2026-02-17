import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';

function TeamSection({ teamMembers = [], loading = false }) {
  const showTeamMembers = teamMembers.slice(0, 4);

  return (
    <Section
      id="team"
      eyebrow="PEOPLE"
      title="Meet the Core Team"
      subtitle="The passionate individuals driving GDGOC NEHU's mission and activities."
    >
      <div className="grid-layout team-grid">
        {showTeamMembers.map((member, index) => (
          <Link
            key={member.id}
            to={`/team/${member.id}`}
            className={`glass-card team-card card-variant-${(index % 4) + 1} card-link`}
          >
            <img src={member.photo_url || member.image_url} alt={member.name || member.title || 'Team member'} />
            <h3>{member.name || member.title}</h3>
            <p>{member.role || member.summary || member.description}</p>
          </Link>
        ))}
        {!showTeamMembers.length && loading && <div className="muted">Loading team...</div>}
      </div>
      <div className="see-more-container">
        <Link to="/team" className="see-more-button">See All Members</Link>
      </div>
    </Section>
  );
}

export default TeamSection;


