import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const techStack = [
  'Frontend: React (Vite) + Vanilla CSS',
  'Backend: Python (Django REST Framework)',
  'Infrastructure: Cloudflare Pages & Workers — Edge-optimized for 200ms latency.',
  'Deployment: Northflank',
  'Core Ingredients: JavaScript, Hopes, Dreams, ChatGPT, Gemini and a surprising amount of Cloudflare Glue.',
];

const contributors = [
  { name: 'Rohit K. Shaw', role: 'Development, Architecture, UI/UX & Deployment' },
  { name: 'GDGOC NEHU Core Team', role: 'Content, QA and Club Operations' },
  { name: 'Want to contribute?', role: 'Head on over to our Github' },
];

const CARD_DEFS = [
  { id: 'tech', title: 'Tech Stack' },
  { id: 'contributors', title: 'Contributors' },
  { id: 'note', title: 'Note' },
];

const getCardVariantClass = (index) => `card-variant-${(index % 4) + 1}`;

function renderCardBody(id) {
  if (id === 'tech') {
    return (
      <ul>
        {techStack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (id === 'contributors') {
    return (
      <ul>
        {contributors.map((person) => (
          <li key={person.name}>
            <strong>{person.name}</strong>: {person.role}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p>
      this page breaks easily and i dont know to fix it, so dont break and it dont tell anyone
    </p>
  );
}

export default function DevPage() {
  const cardRefs = useRef({});
  const bodiesRef = useRef([]);
  const rafRef = useRef(null);
  const dragRef = useRef(null);

  const [isBroken, setIsBroken] = useState(false);
  const [bodies, setBodies] = useState([]);
  const isPhoneViewport = () => window.matchMedia('(max-width: 768px)').matches;

  const setCardRef = (id, node) => {
    if (node) cardRefs.current[id] = node;
    else delete cardRefs.current[id];
  };

  const startPhysics = () => {
    const gravity = 1500;
    const bounce = 0.5;

    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;

      const width = window.innerWidth;
      const height = window.innerHeight;

      const next = bodiesRef.current.map((body) => ({ ...body }));

      for (let i = 0; i < next.length; i += 1) {
        const body = next[i];
        const dragging = dragRef.current && dragRef.current.id === body.id;

        if (!dragging) {
          body.vy += gravity * dt;
          body.x += body.vx * dt;
          body.y += body.vy * dt;

          if (body.x < 0) {
            body.x = 0;
            body.vx *= -bounce;
          }
          if (body.x + body.w > width) {
            body.x = width - body.w;
            body.vx *= -bounce;
          }
          if (body.y < 0) {
            body.y = 0;
            body.vy *= -bounce;
          }
          if (body.y + body.h > height) {
            body.y = height - body.h;
            body.vy *= -bounce;
            body.vx *= 0.97;
            if (Math.abs(body.vy) < 18) body.vy = 0;
          }
        }
      }

      for (let i = 0; i < next.length; i += 1) {
        for (let j = i + 1; j < next.length; j += 1) {
          const a = next[i];
          const b = next[j];

          if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) {
            const overlapX = Math.min(a.x + a.w - b.x, b.x + b.w - a.x);
            const overlapY = Math.min(a.y + a.h - b.y, b.y + b.h - a.y);

            if (overlapX < overlapY) {
              const push = overlapX / 2;
              if (a.x < b.x) {
                a.x -= push;
                b.x += push;
              } else {
                a.x += push;
                b.x -= push;
              }
              const avx = a.vx;
              a.vx = b.vx * 0.9;
              b.vx = avx * 0.9;
            } else {
              const push = overlapY / 2;
              if (a.y < b.y) {
                a.y -= push;
                b.y += push;
              } else {
                a.y += push;
                b.y -= push;
              }
              const avy = a.vy;
              a.vy = b.vy * 0.72;
              b.vy = avy * 0.72;
            }
          }
        }
      }

      bodiesRef.current = next;
      setBodies(next);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const breakWebsite = (clickedId) => {
    if (isBroken) return;
    if (isPhoneViewport()) return;

    const initialBodies = CARD_DEFS.map((card, index) => {
      const node = cardRefs.current[card.id];
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return {
        id: card.id,
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
        vx: (Math.random() - 0.5) * 180,
        vy: card.id === clickedId ? -120 : -40 - index * 20,
        angle: 0,
      };
    }).filter(Boolean);

    if (!initialBodies.length) return;

    bodiesRef.current = initialBodies;
    setBodies(initialBodies);
    setIsBroken(true);
    startPhysics();
  };

  const onPointerDownCard = (id, event) => {
    if (!isBroken) return;

    const target = bodiesRef.current.find((body) => body.id === id);
    if (!target) return;

    event.preventDefault();

    dragRef.current = {
      id,
      dx: event.clientX - target.x,
      dy: event.clientY - target.y,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: performance.now(),
      vx: 0,
      vy: 0,
    };
  };

  useEffect(() => {
    if (!isBroken) return undefined;

    const onPointerMove = (event) => {
      if (!dragRef.current) return;

      const drag = dragRef.current;
      const idx = bodiesRef.current.findIndex((body) => body.id === drag.id);
      if (idx === -1) return;

      const now = performance.now();
      const dt = Math.max((now - drag.lastT) / 1000, 0.001);
      const nx = event.clientX - drag.dx;
      const ny = event.clientY - drag.dy;

      const body = bodiesRef.current[idx];
      body.x = Math.max(0, Math.min(window.innerWidth - body.w, nx));
      body.y = Math.max(0, Math.min(window.innerHeight - body.h, ny));
      body.vx = 0;
      body.vy = 0;

      drag.vx = (event.clientX - drag.lastX) / dt;
      drag.vy = (event.clientY - drag.lastY) / dt;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.lastT = now;

      setBodies([...bodiesRef.current]);
    };

    const onPointerUp = () => {
      if (!dragRef.current) return;

      const drag = dragRef.current;
      const idx = bodiesRef.current.findIndex((body) => body.id === drag.id);
      if (idx !== -1) {
        bodiesRef.current[idx].vx = drag.vx * 0.08;
        bodiesRef.current[idx].vy = drag.vy * 0.08;
      }

      dragRef.current = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isBroken]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main className="dev-page">
      <section className={`dev-shell ${isBroken ? 'is-broken' : ''}`}>
        <Link to="/" className="dev-back-link">
          Back to main site
        </Link>

        <h1>Developer Den</h1>
        <p className={`dev-break-warning ${isBroken ? 'visible' : ''}`}>
          oh no, you broke the website, i warned you it is held together wo hopes, dreams and glue
        </p>

        <div className={`dev-grid ${isBroken ? 'dev-grid--broken' : ''}`}>
          {CARD_DEFS.map((card, index) => (
            <article
              key={card.id}
              ref={(node) => setCardRef(card.id, node)}
              className={`dev-card ${getCardVariantClass(index)} ${card.id === 'note' ? 'dev-card--note' : ''}`}
              onClick={() => breakWebsite(card.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  breakWebsite(card.id);
                }
              }}
            >
              <h2>{card.title}</h2>
              {renderCardBody(card.id)}
            </article>
          ))}
        </div>
      </section>

      {isBroken && (
        <div className="dev-fall-overlay" aria-hidden="true">
          {bodies.map((body) => {
            const card = CARD_DEFS.find((item) => item.id === body.id);
            if (!card) return null;
            const cardIndex = CARD_DEFS.findIndex((item) => item.id === body.id);

            return (
              <article
                key={body.id}
                className={`dev-card dev-falling-card ${getCardVariantClass(cardIndex)} ${card.id === 'note' ? 'dev-card--note' : ''}`}
                style={{
                  width: `${body.w}px`,
                  height: `${body.h}px`,
                  transform: `translate(${body.x}px, ${body.y}px)`,
                }}
                onPointerDown={(event) => onPointerDownCard(body.id, event)}
              >
                <h2>{card.title}</h2>
                {renderCardBody(card.id)}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

