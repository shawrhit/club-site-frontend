import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

const API_BASE_URL = 'http://127.0.0.1:8000';

function TeamMemberPage() {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setErrorMessage('');

    fetch(`${API_BASE_URL}/api/team/${memberId}/`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then((data) => {
        setMember(data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load this team member right now.');
        setIsLoading(false);
      });
  }, [memberId]);

  if (isLoading) {
    return (
      <main className="page-container">
        <div className="blog-post-container">Loading...</div>
      </main>
    );
  }

  if (errorMessage || !member) {
    return (
      <main className="page-container">
        <div className="blog-post-container">
          <p>{errorMessage || 'This profile is unavailable.'}</p>
          <div className="back-link-container">
            <Link to="/team" className="see-more-button">&larr; All Members</Link>
          </div>
        </div>
      </main>
    );
  }

  const bioHtml = member.bio ? `<p>${member.bio}</p>` : '<p>Bio coming soon.</p>';
  const sanitizedBio = DOMPurify.sanitize(bioHtml);

  // Normalize skills/links across backend field variations.
  const rawSkills =
    member.skills ||
    member.skill_set ||
    member.skill_list ||
    member.core_skills ||
    '';

  const skills = Array.isArray(rawSkills)
    ? rawSkills.filter(Boolean)
    : rawSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

  const rawLinks = member.social_links || member.urls || member.links || [];
  const fieldLinks = [
    member.github_url && { label: 'GitHub', url: member.github_url },
    member.linkedin_url && { label: 'LinkedIn', url: member.linkedin_url },
    member.instagram_url && { label: 'Instagram', url: member.instagram_url },
    member.twitter_url && { label: 'Twitter', url: member.twitter_url },
    member.website_url && { label: 'Website', url: member.website_url },
  ].filter(Boolean);

  const socialLinks = Array.isArray(rawLinks)
    ? rawLinks.map((link) =>
        typeof link === 'string' ? { label: link, url: link } : link
      )
    : Object.entries(rawLinks).map(([label, url]) => ({ label, url }));

  const normalizedLinks = [...socialLinks, ...fieldLinks].filter((link) => link && link.url);

  const getSocialLabel = (link) => link.label || link.url || 'Profile link';

  const getSocialType = (link) => {
    const raw = `${link.label || ''} ${link.url || ''}`.toLowerCase();
    if (raw.includes('github')) return 'github';
    if (raw.includes('linkedin')) return 'linkedin';
    if (raw.includes('instagram')) return 'instagram';
    if (raw.includes('twitter') || raw.includes('x.com')) return 'twitter';
    return 'website';
  };

  const renderSocialIcon = (type) => {
    switch (type) {
      case 'github':
        return (
          <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.52 2.87 8.36 6.84 9.71.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.2-1.1-1.52-1.1-1.52-.9-.64.07-.63.07-.63 1 .07 1.52 1.05 1.52 1.05.9 1.57 2.36 1.12 2.94.85.1-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .85-.28 2.78 1.05a9.36 9.36 0 0 1 2.53-.35c.86 0 1.73.12 2.53.35 1.92-1.33 2.77-1.05 2.77-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.82-4.58 5.07.36.32.68.94.68 1.9v2.82c0 .26.18.58.69.48A10.02 10.02 0 0 0 22 12.24C22 6.58 17.52 2 12 2z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.66 4.78 6.11V21h-4v-5.45c0-1.3-.02-2.98-1.82-2.98-1.82 0-2.1 1.42-2.1 2.88V21H9z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg
            viewBox="0 0 24 24"
            role="presentation"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ fill: 'none', stroke: 'currentColor' }}
          >
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <circle cx="12" cy="12" r="3.5" />
            <circle cx="16.5" cy="7.5" r="1" />
          </svg>
        );
      case 'twitter':
        return (
          <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
            <path d="M19.9 7.5c.01.14.01.29.01.43 0 4.4-3.35 9.48-9.48 9.48-1.88 0-3.64-.55-5.12-1.5.26.03.52.04.79.04 1.56 0 3-0.53 4.14-1.42-1.46-.03-2.69-.99-3.12-2.31.2.03.4.05.62.05.29 0 .58-.04.86-.11-1.52-.3-2.67-1.65-2.67-3.26v-.04c.45.25.96.4 1.5.42-.9-.6-1.5-1.62-1.5-2.78 0-.61.16-1.18.45-1.67 1.64 2.01 4.1 3.33 6.87 3.47-.05-.24-.08-.49-.08-.75 0-1.8 1.46-3.26 3.26-3.26.94 0 1.78.4 2.38 1.03.74-.14 1.44-.42 2.07-.8-.24.76-.76 1.4-1.44 1.81.66-.08 1.3-.26 1.9-.52-.44.66-1 1.24-1.64 1.7z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.75 9h-3.2a15.6 15.6 0 0 0-1.1-5.07A8.03 8.03 0 0 1 19.75 11zM12 4.2c.84 1.2 1.5 2.96 1.84 4.8H10.16c.34-1.84 1-3.6 1.84-4.8zM4.25 13h3.2c.2 1.8.72 3.46 1.5 4.85A8.03 8.03 0 0 1 4.25 13zm3.2-2h-3.2a8.03 8.03 0 0 1 4.7-5.07c-.78 1.39-1.3 3.05-1.5 5.07zm2.7 2h3.7c-.34 1.84-1 3.6-1.84 4.8-.84-1.2-1.5-2.96-1.84-4.8zm6.39 4.85c.78-1.39 1.3-3.05 1.5-4.85h3.2a8.03 8.03 0 0 1-4.7 4.85z" />
          </svg>
        );
    }
  };

  return (
    <main className="blog-detail-page">
      <section className="blog-hero blog-hero-detail">
        <div className="blog-hero-inner">
          <div className="blog-hero-media">
            {member.photo ? (
              <img src={member.photo} alt={member.name} />
            ) : (
              <div className="blog-hero-placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="blog-hero-content">
            <p className="post-category">TEAM</p>
            <h1 className="blog-hero-title">{member.name}</h1>
            {member.role && <p className="blog-hero-dek">{member.role}</p>}
            <div className="blog-hero-actions">
              <Link to="/team" className="blog-hero-link">Back to Team</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container">
        <div className="blog-post-container">
          <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: sanitizedBio }} />

          {skills.length > 0 && (
            <div className="member-skills">
              <h2>Skills</h2>
              <div className="member-skill-list">
                {skills.map((skill) => (
                  <span key={skill} className="member-skill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {normalizedLinks.length > 0 && (
            <div className="member-links">
              <h2>Links</h2>
              <div className="member-link-list">
                {normalizedLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="member-social"
                  >
                    <span className="member-social-icon" aria-hidden="true">
                      {renderSocialIcon(getSocialType(link))}
                    </span>
                    <span className="member-social-text">{getSocialLabel(link)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default TeamMemberPage;
