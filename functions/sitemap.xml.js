const SITE_URL = 'https://gdgnehu.pages.dev';
const API_BASE = 'https://site--gdg-backend--6b5qrljpcqzc.code.run/api';

const STATIC_ROUTES = ['/', '/events', '/blog', '/projects', '/team'];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function asArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

function pickId(item) {
  return item?.id ?? item?.pk ?? item?._id ?? item?.slug ?? null;
}

function pickLastModified(item) {
  return (
    item?.updated_at ??
    item?.updatedAt ??
    item?.modified_at ??
    item?.modifiedAt ??
    item?.published_at ??
    item?.created_at ??
    item?.createdAt ??
    null
  );
}

function buildUrlTag(url, lastmod) {
  const safeUrl = escapeXml(url);
  const safeLastmod = lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : '';
  return `<url><loc>${safeUrl}</loc>${safeLastmod}</url>`;
}

async function fetchCollection(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) return [];
  const json = await response.json();
  return asArray(json);
}

export async function onRequestGet() {
  const [events, blogs] = await Promise.all([
    fetchCollection('/events/').catch(() => []),
    fetchCollection('/blog/').catch(() => []),
  ]);

  const urlTags = [];

  for (const route of STATIC_ROUTES) {
    urlTags.push(buildUrlTag(`${SITE_URL}${route}`));
  }

  for (const event of events) {
    const id = pickId(event);
    if (!id) continue;
    urlTags.push(buildUrlTag(`${SITE_URL}/events/${id}`, pickLastModified(event)));
  }

  for (const blog of blogs) {
    const id = pickId(blog);
    if (!id) continue;
    urlTags.push(buildUrlTag(`${SITE_URL}/blog/${id}`, pickLastModified(blog)));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
