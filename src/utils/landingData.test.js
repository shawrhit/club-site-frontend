import { describe, expect, it, beforeEach, vi } from 'vitest';
import { apiFetch } from '../api';
import { loadLandingData, loadLegacyLandingData, mapBootstrapPayload } from './landingData';

vi.mock('../api', () => ({
  apiFetch: vi.fn(),
}));

const makeResponse = (json, ok = true) => ({
  ok,
  json: async () => json,
});

describe('landingData loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps bootstrap payload into landing sections', () => {
    const payload = {
      meta: { generated_at: '2026-02-17T10:00:00Z', source: 'cache' },
      tags: [{ id: 1, name: 'All' }],
      tags_popular: [{ id: 2, name: 'Popular' }],
      events: [{ id: 9, title: 'Fallback Event' }],
      items_by_type: {
        blogs: [{ id: 10, title: 'Blog A' }],
        projects: [{ id: 11, title: 'Project A' }],
        events: [{ id: 12, title: 'Event A' }],
        roadmaps: [{ id: 13, title: 'Roadmap A' }],
        team: [{ id: 14, name: 'Member A' }],
      },
    };

    const mapped = mapBootstrapPayload(payload);

    expect(mapped.source).toBe('bootstrap');
    expect(mapped.meta?.source).toBe('cache');
    expect(mapped.tagsPopular).toEqual([{ id: 2, name: 'Popular' }]);
    expect(mapped.blogs).toHaveLength(1);
    expect(mapped.projects).toHaveLength(1);
    expect(mapped.events).toEqual([{ id: 12, title: 'Event A' }]);
    expect(mapped.roadmaps).toHaveLength(1);
    expect(mapped.team).toHaveLength(1);
  });

  it('uses bootstrap endpoint when available', async () => {
    apiFetch.mockResolvedValueOnce(
      makeResponse({
        tags: [],
        tags_popular: [],
        items_by_type: { blogs: [], projects: [], events: [], roadmaps: [], team: [] },
      })
    );

    await loadLandingData();

    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(apiFetch).toHaveBeenCalledWith('/api/init/', expect.any(Object));
  });

  it('falls back to legacy fanout when bootstrap fails', async () => {
    apiFetch
      .mockResolvedValueOnce(makeResponse({}, false))
      .mockResolvedValueOnce(makeResponse([{ id: 1, name: 'tag-1' }]))
      .mockResolvedValueOnce(makeResponse([{ id: 2, name: 'tag-2' }]))
      .mockResolvedValueOnce(makeResponse([{ id: 3, title: 'event-1' }]))
      .mockResolvedValueOnce(makeResponse([{ id: 4, title: 'project-1' }]))
      .mockResolvedValueOnce(makeResponse([{ id: 5, title: 'blog-1' }]))
      .mockResolvedValueOnce(makeResponse([{ id: 6, title: 'roadmap-1' }]))
      .mockResolvedValueOnce(makeResponse([{ id: 7, name: 'team-1' }]));

    const data = await loadLandingData();

    expect(data.source).toBe('legacy');
    expect(data.tags).toHaveLength(1);
    expect(data.tagsPopular).toHaveLength(1);
    expect(data.events).toHaveLength(1);
    expect(data.projects).toHaveLength(1);
    expect(data.blogs).toHaveLength(1);
    expect(data.roadmaps).toHaveLength(1);
    expect(data.team).toHaveLength(1);
  });

  it('legacy loader throws when every endpoint fails', async () => {
    apiFetch.mockResolvedValue(makeResponse({}, false));

    await expect(loadLegacyLandingData()).rejects.toThrow('Legacy landing fetch failed');
  });
});
