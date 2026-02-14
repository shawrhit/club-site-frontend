import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <img src="/404_Error_Page.gif" alt="404 Not Found" className="not-found-gif" />
      <p className="not-found-text">Error 404: Page not found. The link may be broken or moved.</p>
      <Link to="/" className="see-more-button">Go Home</Link>
    </main>
  );
}

export default NotFoundPage;

