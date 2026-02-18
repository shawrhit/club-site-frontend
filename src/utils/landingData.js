import { apiFetch } from '../api';

const USE_BOOTSTRAP_ENDPOINT = import.meta.env.VITE_ENABLE_BOOTSTRAP_LANDING !== 'false';

/**
 * @typedef {{ id: number|string, name?: string, title?: string, slug?: string, count?: number }} Tag
 * @typedef {{ id: number|string, title?: string, name?: string, summary?: string, description?: string, image_url?: string, photo_url?: string, icon_name?: string, tags?: Array<{name?: string}|string>, event_date?: string, published_date?: string, role?: string }} ItemCard
 * @typedef {{
 *   meta?: { generated_at?: string, source?: string },
 *   tags?: Tag[],
 *   tags_popular?: Tag[],
 *   events?: ItemCard[],
 *   items_by_type?: {
 *     blogs?: ItemCard[],
 *     projects?: ItemCard[],
 *     events?: ItemCard[],
 *     roadmaps?: ItemCard[],
 *     team?: ItemCard[]
 *   }
 * }} BootstrapPayload
 * @typedef {{
 *   source: 'bootstrap' | 'legacy',
 *   meta?: { generated_at?: string, source?: string },
 *   tags: Tag[],
 *   tagsPopular: Tag[],
 *   blogs: ItemCard[],
 *   projects: ItemCard[],
 *   events: ItemCard[],
 *   roadmaps: ItemCard[],
 *   team: ItemCard[]
 * }} LandingData
 */

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const fetchJson = async (path, signal) => {
  const response = await apiFetch(path, { signal });
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
};

const fetchOptionalJson = async (path, signal) => {
  try {
    return await fetchJson(path, signal);
  } catch (error) {
    return [];
  }
};

/**
 * @param {BootstrapPayload} payload
 * @returns {LandingData}
 */
export const mapBootstrapPayload = (payload) => {
  const typedItems = payload?.items_by_type || {};
  const tags = ensureArray(payload?.tags);
  const tagsPopular = ensureArray(payload?.tags_popular);
  const typedEvents = ensureArray(typedItems.events);

  return {
    source: 'bootstrap',
    meta: payload?.meta,
    tags,
    tagsPopular: tagsPopular.length ? tagsPopular : tags,
    blogs: ensureArray(typedItems.blogs),
    projects: ensureArray(typedItems.projects),
    events: typedEvents.length ? typedEvents : ensureArray(payload?.events),
    roadmaps: ensureArray(typedItems.roadmaps),
    team: ensureArray(typedItems.team),
  };
};

/**
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<LandingData>}
 */
export const loadLegacyLandingData = async ({ signal } = {}) => {
  const [tagsRaw, tagsPopularRaw, events, projects, blogs, roadmaps, team] = await Promise.all([
    fetchOptionalJson('/api/tags/', signal),
    fetchOptionalJson('/api/tags/popular/', signal),
    fetchOptionalJson('/api/program/', signal),
    fetchOptionalJson('/api/projects/', signal),
    fetchOptionalJson('/api/blog/', signal),
    fetchOptionalJson('/api/roadmaps/', signal),
    fetchOptionalJson('/api/team/', signal),
  ]);

  const tags = ensureArray(tagsRaw?.tags || tagsRaw?.results || tagsRaw);
  const tagsPopular = ensureArray(tagsPopularRaw?.tags || tagsPopularRaw?.results || tagsPopularRaw);

  if (!tags.length && !events.length && !projects.length && !blogs.length && !roadmaps.length && !team.length) {
    throw new Error('Legacy landing fetch failed');
  }

  return {
    source: 'legacy',
    tags,
    tagsPopular: tagsPopular.length ? tagsPopular : tags,
    blogs: ensureArray(blogs),
    projects: ensureArray(projects),
    events: ensureArray(events),
    roadmaps: ensureArray(roadmaps),
    team: ensureArray(team),
  };
};

/**
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<LandingData>}
 */
export const loadLandingData = async ({ signal } = {}) => {
  if (USE_BOOTSTRAP_ENDPOINT) {
    try {
      const payload = await fetchJson('/api/init/', signal);
      return mapBootstrapPayload(payload);
    } catch (error) {
      return loadLegacyLandingData({ signal });
    }
  }

  return loadLegacyLandingData({ signal });
};

