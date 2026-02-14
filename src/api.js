const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = (path, options = {}) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return fetch(`${API_BASE}${normalizedPath}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'ngrok-skip-browser-warning': '1',
    },
  });
};
