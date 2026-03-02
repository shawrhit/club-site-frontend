import React from 'react';

/**
 * Skeleton card placeholder for loading states.
 * Eliminates Cumulative Layout Shift (CLS) by reserving space during data fetch.
 * 
 * @param {Object} props
 * @param {'card'|'team'|'roadmap'} props.variant - Style variant
 */
function SkeletonCard({ variant = 'card' }) {
  if (variant === 'team') {
    return (
      <div className="skeleton-card skeleton-card--team">
        <div className="skeleton-avatar" />
        <div className="skeleton-line skeleton-line--medium" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
    );
  }

  if (variant === 'roadmap') {
    return (
      <div className="skeleton-card skeleton-card--roadmap">
        <div className="skeleton-icon" />
        <div className="skeleton-line skeleton-line--medium" />
        <div className="skeleton-line skeleton-line--long" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
    );
  }

  // Default card variant (projects, events, blogs)
  return (
    <div className="skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-line--medium" />
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line skeleton-line--long" />
      </div>
    </div>
  );
}

/**
 * Grid of skeleton cards for loading states.
 * 
 * @param {Object} props
 * @param {number} props.count - Number of skeleton cards to render
 * @param {'card'|'team'|'roadmap'} props.variant - Style variant
 */
export function SkeletonGrid({ count = 3, variant = 'card' }) {
  return (
    <div className={`grid-layout ${variant === 'team' ? 'team-grid' : ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} variant={variant} />
      ))}
    </div>
  );
}

export default SkeletonCard;
