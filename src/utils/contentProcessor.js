const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtu.be',
]);

function toYouTubeEmbedUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();
    if (!YOUTUBE_HOSTS.has(host)) return null;

    let videoId = '';

    if (host.includes('youtu.be')) {
      videoId = parsed.pathname.replace('/', '').trim();
    } else if (parsed.pathname.startsWith('/shorts/')) {
      videoId = parsed.pathname.split('/shorts/')[1]?.split('/')[0] || '';
    } else if (parsed.pathname.startsWith('/embed/')) {
      videoId = parsed.pathname.split('/embed/')[1]?.split('/')[0] || '';
    } else {
      videoId = parsed.searchParams.get('v') || '';
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

export function processContent(html) {
  if (!html || typeof html !== 'string') return '';

  const oembedRegex = /<oembed[^>]*url=(["'])(.*?)\1[^>]*>(?:<\/oembed>)?/gi;

  return html.replace(oembedRegex, (_, __, url) => {
    const embedUrl = toYouTubeEmbedUrl(url);
    if (!embedUrl) return '';

    return (
      `<div class="ck-media-embed">` +
      `<iframe ` +
      `src="${embedUrl}" ` +
      `title="Embedded media" ` +
      `loading="lazy" ` +
      `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ` +
      `allowfullscreen ` +
      `referrerpolicy="strict-origin-when-cross-origin">` +
      `</iframe>` +
      `</div>`
    );
  });
}

