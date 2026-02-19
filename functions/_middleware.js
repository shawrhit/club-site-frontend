export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  const isEvent = url.pathname.startsWith('/events/');
  const isBlog = url.pathname.startsWith('/blog/');
  const isProject = url.pathname.startsWith('/projects/');
  const isRoadmap = url.pathname.startsWith('/roadmaps/');

  if (!isEvent && !isBlog && !isProject && !isRoadmap) return next();

  const id = url.pathname.split('/')[2];
  if (!id || id.trim() === '') return next();

  try {
    let apiPath = '';
    if (isEvent) apiPath = `/api/events/${id}/`;
    else if (isBlog) apiPath = `/api/blog/${id}/`;
    else if (isProject) apiPath = `/api/projects/${id}/`;
    else if (isRoadmap) apiPath = `/api/roadmaps/${id}/`;

    if (!apiPath) return next();
    const apiRes = await fetch(`https://site--gdg-backend--6b5qrljpcqzc.code.run${apiPath}`);

    if (!apiRes.ok) return next();
    const data = await apiRes.json();

    const response = await next();

    return new HTMLRewriter()
      .on('title', {
        element(e) {
          e.setInnerContent(`${data.title} | GDGOC NEHU`);
        },
      })
      .on('meta[property="og:title"]', {
        element(e) {
          e.setAttribute('content', data.title);
        },
      })
      .on('meta[property="og:description"]', {
        element(e) {
          e.setAttribute('content', data.short_description || data.summary || 'Read more on GDGOC NEHU');
        },
      })
      .on('meta[property="og:image"]', {
        element(e) {
          e.setAttribute(
            'content',
            data.banner_image || data.image || data.image_url || 'https://gdgnehu.pages.dev/og-default.png'
          );
        },
      })
      .on('meta[property="og:url"]', {
        element(e) {
          e.setAttribute('content', url.toString());
        },
      })
      .transform(response);
  } catch (e) {
    return next();
  }
}
