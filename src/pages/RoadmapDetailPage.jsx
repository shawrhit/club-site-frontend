import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { apiFetch } from '../api';
import { processContent } from '../utils/contentProcessor';
import '../styles/CKEditorContent.css';

function RoadmapDetailPage() {
  const { roadmapId } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [tocItems, setTocItems] = useState([]);
  const [activeHeadingId, setActiveHeadingId] = useState('');

  useContentRailUpdater();
  useHeroRailUpdater();
  useConnectorUpdater();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setErrorMessage('');

    apiFetch(`/api/roadmaps/${roadmapId}/`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Request failed'))))
      .then((data) => {
        setRoadmap(data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load this roadmap right now.');
        setIsLoading(false);
      });
  }, [roadmapId]);
  const contentHtml =
    roadmap?.content ||
    (roadmap?.description ? `<p>${roadmap.description}</p>` : '<p>Details coming soon.</p>');
  const processedContent = processContent(contentHtml);
  const sanitizedContent = DOMPurify.sanitize(processedContent, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy'],
  });

  const onTocJump = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const y = target.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setActiveHeadingId(id);
  };

  useEffect(() => {
    if (isLoading || !roadmap) return;

    const contentRoot = document.querySelector('.roadmap-map .blog-post-content');
    if (!contentRoot) {
      setTocItems([]);
      setActiveHeadingId('');
      return;
    }

    const headings = Array.from(contentRoot.querySelectorAll('h2'));
    if (!headings.length) {
      setTocItems([]);
      setActiveHeadingId('');
      return;
    }

    const idRegistry = new Set();
    const items = headings.map((heading, index) => {
      let id = (heading.id || '').trim();
      if (!id) {
        const baseId = slugifyHeading(heading.textContent || `section-${index + 1}`);
        let nextId = baseId || `section-${index + 1}`;
        let counter = 2;

        while (document.getElementById(nextId) || idRegistry.has(nextId)) {
          nextId = `${baseId || `section-${index + 1}`}-${counter}`;
          counter += 1;
        }

        id = nextId;
        heading.id = id;
      }

      idRegistry.add(id);
      return {
        id,
        title: (heading.textContent || `Section ${index + 1}`).trim(),
      };
    });

    setTocItems(items);
    setActiveHeadingId(items[0]?.id || '');

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setActiveHeadingId(visibleEntries[0].target.id);
          return;
        }

        const previouslyPassed = headings.filter((heading) => heading.getBoundingClientRect().top < 130);
        if (previouslyPassed.length > 0) {
          setActiveHeadingId(previouslyPassed[previouslyPassed.length - 1].id);
        }
      },
      {
        root: null,
        rootMargin: '-110px 0px -65% 0px',
        threshold: [0, 0.2, 0.6, 1],
      }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [isLoading, roadmap, roadmapId, sanitizedContent]);

  if (isLoading) {
    return (
      <main className="page-container">
        <div className="blog-post-container">Loading...</div>
      </main>
    );
  }

  if (errorMessage || !roadmap) {
    return (
      <main className="page-container">
        <div className="blog-post-container">
          <p>{errorMessage || 'This roadmap is unavailable.'}</p>
          <div className="back-link-container">
            <Link to="/roadmaps" className="see-more-button">&larr; All Roadmaps</Link>
          </div>
        </div>
      </main>
    );
  }

  const pageTitle = `${roadmap.title || 'Roadmap'} | GDGOC NEHU`;
  const pageDescription =
    roadmap.short_description || roadmap.summary || roadmap.description || 'Read more on GDGOC NEHU';
  const pageImage =
    roadmap.banner_image || roadmap.image_url || roadmap.image || 'https://gdgnehu.pages.dev/og-default.png';
  const pageUrl =
    typeof window !== 'undefined' ? window.location.href : `https://gdgnehu.pages.dev/roadmaps/${roadmapId}`;

  return (
    <main className="blog-detail-page roadmap-map">
      <Helmet>
        <title>{pageTitle}</title>
        <meta property="og:title" content={roadmap.title || 'GDGOC NEHU'} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
      </Helmet>
      <div className="roadmap-map-shell">
        <span className="roadmap-hero-line" aria-hidden="true" />
          <svg className="roadmap-connector" aria-hidden="true">
              <defs>
                <linearGradient id="connectorGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#F783CF" />
                  <stop offset="100%" stopColor="#5AA3FF" />
                </linearGradient>
              </defs>
                <path className="connector-path" stroke="url(#connectorGradient)" fill="none" />
            </svg>
        <section className="roadmap-launchpad">
          <div className="roadmap-launchpad-inner">
            <Link to="/roadmaps" className="launchpad-back">&larr; Back to Roadmaps</Link>
            <div className="launchpad-rail" aria-hidden="true">
              <span className="launchpad-dot" />
            </div>
            <div className="launchpad-content">
              <h1 className="launchpad-title">{roadmap.title}</h1>
              <p className="launchpad-subtitle">
                {roadmap.description || 'A guided pathway to build skills step by step.'}
              </p>
            </div>
            <div className="launchpad-card" aria-hidden="true">
              <div className="launchpad-icon">{roadmap.icon_name || '🧭'}</div>
            </div>
          </div>
        </section>

        <div className="page-container roadmap-map-content">
          <span className="roadmap-content-line" aria-hidden="true" />
          <div className="roadmap-detail-layout">
            <div className="blog-post-container">
              <div className="blog-post-content ck-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>
            {tocItems.length > 0 && (
              <aside className="roadmap-mini-toc" aria-label="In This Page">
                <p className="roadmap-mini-toc-title">In This Page</p>
                <ul className="roadmap-mini-toc-list">
                  {tocItems.map((item) => (
                    <li
                      key={item.id}
                      className={`roadmap-mini-toc-item ${activeHeadingId === item.id ? 'is-active' : ''}`}
                    >
                      <a href={`#${item.id}`} onClick={(event) => onTocJump(event, item.id)}>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Connector removed: no runtime updates required for roadmaps page

export default RoadmapDetailPage;

// Hook: measure heading dots and position the content rail precisely
function useContentRailUpdater() {
  useEffect(() => {
    const updateRail = () => {
      const contentContainer = document.querySelector('.roadmap-map-content');
      const rail = contentContainer && contentContainer.querySelector('.roadmap-content-line');
      const headings = document.querySelectorAll('.roadmap-map .blog-post-content h2');
      if (!contentContainer || !rail) return;

      if (!headings || headings.length === 0) {
        rail.style.display = 'none';
        return;
      }

      // compute CSS variable driven offsets from .roadmap-map-shell for dot calc
      const shell = document.querySelector('.roadmap-map-shell');
      const shellStyles = shell ? getComputedStyle(shell) : null;
      const mapTextGapPx = shellStyles ? parseFloat(shellStyles.getPropertyValue('--map-text-gap')) || 32 : 32;
      const mapLineXPx = shellStyles ? parseFloat(shellStyles.getPropertyValue('--map-line-x')) || 118 : 118;
      const dotLeftRelative = -1 * (120 + mapTextGapPx) + mapLineXPx - 29;

      const first = headings[0];
      const last = headings[headings.length - 1];
      const firstRect = first.getBoundingClientRect();
      const lastRect = last.getBoundingClientRect();
      const containerRect = contentContainer.getBoundingClientRect();

      // compute dot center Y using the same top:0.55em from CSS (0.55 * font-size)
      const firstFontSize = parseFloat(getComputedStyle(first).fontSize) || 16;
      const lastFontSize = parseFloat(getComputedStyle(last).fontSize) || firstFontSize;
      const firstDotY = firstRect.top - containerRect.top + (0.55 * firstFontSize);
      const lastDotY = lastRect.top - containerRect.top + (0.55 * lastFontSize);

      // compute dot X relative to container
      const firstDotX = (firstRect.left - containerRect.left) + dotLeftRelative;

      // apply styles: left, top, height
      rail.style.display = '';
      rail.style.left = `${Math.round(firstDotX)}px`;
      const topPx = Math.round(firstDotY);
      const heightPx = Math.max(2, Math.round(lastDotY - firstDotY));
      rail.style.top = `${topPx}px`;
      rail.style.height = `${heightPx}px`;
    };

    // run on load and changes
    updateRail();
    window.addEventListener('resize', updateRail);
    window.addEventListener('scroll', updateRail, { passive: true });
    const mo = new MutationObserver(updateRail);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updateRail);
      window.removeEventListener('scroll', updateRail);
      mo.disconnect();
    };
  }, []);
}

// Hook: position a vertical hero rail left of the main hero text (30px gap)
function useHeroRailUpdater() {
  useEffect(() => {
    const updateHeroRail = () => {
      const shell = document.querySelector('.roadmap-map-shell');
      const hero = shell && shell.querySelector('.roadmap-launchpad');
      const content = shell && shell.querySelector('.launchpad-content');
      const rail = shell && shell.querySelector('.roadmap-hero-line');
      if (!shell || !hero || !content || !rail) return;

      const shellRect = shell.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const railWidth = 3; // matches CSS

      // Right edge of the rail should be 30px left of the content's left edge.
      const leftPx = Math.round(contentRect.left - shellRect.left - 30 - railWidth);
      const topPx = Math.round(0);
      const heightPx = Math.max(24, Math.round((heroRect.bottom - shellRect.top) - topPx));

      rail.style.display = '';
      rail.style.left = `${leftPx}px`;
      rail.style.top = `${topPx}px`;
      rail.style.height = `${heightPx}px`;
    };

    updateHeroRail();
    window.addEventListener('resize', updateHeroRail);
    window.addEventListener('scroll', updateHeroRail, { passive: true });
    const mo = new MutationObserver(updateHeroRail);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updateHeroRail);
      window.removeEventListener('scroll', updateHeroRail);
      mo.disconnect();
    };
  }, []);
}

// Hook: draw a smooth cubic Bézier connector between the hero rail bottom and the content rail top
function useConnectorUpdater() {
  useEffect(() => {
    const updateConnector = () => {
      const shell = document.querySelector('.roadmap-map-shell');
      const heroRail = shell && shell.querySelector('.roadmap-hero-line');
      const contentRail = shell && shell.querySelector('.roadmap-content-line');
      const svg = shell && shell.querySelector('.roadmap-connector');
      const path = svg && svg.querySelector('.connector-path');
      if (!shell || !heroRail || !contentRail || !svg || !path) {
        if (path) path.style.display = 'none';
        return;
      }

      const shellRect = shell.getBoundingClientRect();
      const heroRect = heroRail.getBoundingClientRect();
      const contentRect = contentRail.getBoundingClientRect();

      // Convert to coordinates relative to the shell SVG
      const startX = Math.round((heroRect.left + heroRect.width / 2) - shellRect.left);
      const startY = Math.round((heroRect.top + heroRect.height) - shellRect.top);
      const endX = Math.round((contentRect.left + contentRect.width / 2) - shellRect.left);
      const endY = Math.round((contentRect.top) - shellRect.top);

      const deltaY = Math.max(40, (endY - startY) * 0.45);
      const c1x = startX;
      const c1y = startY + deltaY;
      const c2x = endX;
      const c2y = endY - deltaY;

      const d = `M ${startX} ${startY} C ${c1x} ${c1y} ${c2x} ${c2y} ${endX} ${endY}`;

      // ensure svg covers shell area (it is absolute inset:0) and set path
      path.setAttribute('d', d);
      path.style.display = '';
    };

    updateConnector();
    window.addEventListener('resize', updateConnector);
    window.addEventListener('scroll', updateConnector, { passive: true });
    const mo = new MutationObserver(updateConnector);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updateConnector);
      window.removeEventListener('scroll', updateConnector);
      mo.disconnect();
    };
  }, []);
}

function slugifyHeading(value) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
