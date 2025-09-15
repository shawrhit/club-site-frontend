import React, { useState, useEffect } from 'react';
import Section from './Section';

// This is the base URL of your running Django server
const API_BASE_URL = 'http://127.0.0.1:8000';

function TeamSection() {
  // 1. Set up state to hold the team member data
  const [teamMembers, setTeamMembers] = useState([]);

  // 2. Fetch data when the component loads
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/team/`)
      .then(response => response.json())
      .then(data => setTeamMembers(data))
      .catch(error => console.error('Error fetching team members:', error));
  }, []);

  return (
    <Section
      id="team"
      title="Meet the Core Team"
      subtitle="The passionate individuals driving the club's mission and activities."
    >
      {/* 3. Render the data from the state variable */}
      <div className="grid-layout team-grid">
        {teamMembers.map(member => (
          <div key={member.id} className="glass-card team-card">
            {/* The API sends the full URL, so we use it directly */}
            <img src={member.photo} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default TeamSection;
