import React from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { loadLandingData } from '../utils/landingData';

vi.mock('../utils/landingData', () => ({
  loadLandingData: vi.fn(),
}));

describe('HomePage landing data integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and renders sections from bootstrap loader data', async () => {
    loadLandingData.mockResolvedValueOnce({
      source: 'bootstrap',
      tags: [{ id: 1, name: 'AI', slug: 'ai' }],
      tagsPopular: [],
      blogs: [{ id: 101, title: 'Blog Test', summary: 'Summary' }],
      projects: [{ id: 201, title: 'Project Test', description: 'Desc' }],
      events: [{ id: 301, title: 'Event Test', summary: 'Event summary' }],
      roadmaps: [{ id: 401, title: 'Roadmap Test', description: 'Roadmap desc', icon_name: 'R' }],
      team: [{ id: 501, name: 'Member Test', role: 'Lead', photo_url: '/member.png' }],
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(loadLandingData).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText('Blog Test')).toBeInTheDocument();
    expect(screen.getByText('Project Test')).toBeInTheDocument();
    expect(screen.getByText('Event Test')).toBeInTheDocument();
    expect(screen.getByText('Roadmap Test')).toBeInTheDocument();
    expect(screen.getByText('Member Test')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('shows unified loading state while loader is pending', async () => {
    loadLandingData.mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
    expect(screen.getByText('Loading roadmaps...')).toBeInTheDocument();
    expect(screen.getByText('Loading team...')).toBeInTheDocument();
    expect(screen.getByText('Loading topics...')).toBeInTheDocument();
  });
});
