export async function onRequest(context) {
  const { request } = context;
  const northflankBase = "https://site--gdg-backend--6b5qrljpcqzc.code.run";
  const url = new URL(request.url);
  
  // 1. Translation Layer (Bypassing Ad-Blocker Heuristics)
  let internalPath = url.pathname;
  if (internalPath.startsWith('/api/program/')) {
    internalPath = internalPath.replace('/api/program/', '/api/events/');
  } else if (internalPath.startsWith('/api/init/')) {
    internalPath = internalPath.replace('/api/init/', '/api/bootstrap/');
  }

  // 2. Cache Check (First-Party Domain Cache)
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;
  let response = await cache.match(cacheKey);

  if (!response) {
    const backendUrl = `${northflankBase}${internalPath}${url.search}`;
    const originResponse = await fetch(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null
    });

    // Create a new response to inject caching headers
    response = new Response(originResponse.body, originResponse);
    response.headers.set("Access-Control-Allow-Origin", "*");
    
    // Cache for 5 mins, serve stale for 1 hour
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    response.headers.set("X-Cache-Status", "MISS");

    if (request.method === "GET" && originResponse.status === 200) {
      context.waitUntil(cache.put(cacheKey, response.clone()));
    }
  } else {
    response = new Response(response.body, response);
    response.headers.set("X-Cache-Status", "HIT");
  }

  return response;
}
