# Google Developer's Group, NEHU Frontend

Frontend for the Google Developer's Group (GDG) NEHU website. Built with React, Vite, and React Router.

## Quick Start

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Environment and Configuration

API requests currently use `API_BASE_URL = http://127.0.0.1:8000` inside components. If you need a different backend URL, update the constants in the relevant files or switch to environment variables (recommended for deployment).

Suggested environment variable:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## API Endpoints Used

These endpoints are expected to be served by the backend:

- `GET /api/blog/`, `GET /api/blog/:id`
- `GET /api/projects/`, `GET /api/projects/:id`
- `GET /api/roadmaps/`, `GET /api/roadmaps/:id`
- `GET /api/team/`, `GET /api/team/:id`
- `GET /api/events/`

Blog content is rich text HTML (rendered with DOMPurify).

## Project Structure

```
src/
	components/   Reusable UI sections and cards
	pages/        Route-level pages
	assets/       Static assets
```

Routing is defined in `src/App.jsx` using React Router.

## Contributing

1. Create a feature branch.
2. Keep changes focused and consistent with existing styles.
3. Run the app locally to verify UI changes.
4. Open a PR with a short summary and screenshots when possible.
