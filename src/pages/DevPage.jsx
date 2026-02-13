import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const techStack = [
  'React (Vite)',
  'React Router',
  'Vanilla CSS',
  'JavaScript ( obviously ;) )',
  'Python (Django REST Framework) on the backend',
  'Hopes and Dreams',
  'ChatGPT',
];

const contributors = [
  { name: 'Rohit K. Shaw', role: 'Frontend, Backend, Design' },
  { name: 'GDG NEHU Core Team', role: 'Content, QA and Club Operations' },
  { name: 'Student Contributors', role: 'Ideas, Testing and Iteration' },
];

export default function DevPage() {
  const bulletIdRef = useRef(1);
  const enemyIdRef = useRef(1);

  const createEnemy = (startY = -20) => ({
    id: enemyIdRef.current++,
    x: Math.floor(Math.random() * 84) + 8,
    y: startY - Math.random() * 50,
    speed: 0.8 + Math.random() * 1.2,
  });

  const createInitialState = () => ({
    shipX: 50,
    bullets: [],
    enemies: Array.from({ length: 6 }, () => createEnemy()),
    score: 0,
    lives: 3,
    gameOver: false,
  });

  const [game, setGame] = useState(createInitialState);

  const moveShip = (delta) => {
    setGame((prev) => {
      if (prev.gameOver) {
        return prev;
      }

      return {
        ...prev,
        shipX: Math.min(95, Math.max(5, prev.shipX + delta)),
      };
    });
  };

  const shoot = () => {
    setGame((prev) => {
      if (prev.gameOver || prev.bullets.length >= 9) {
        return prev;
      }

      return {
        ...prev,
        bullets: [
          ...prev.bullets,
          {
            id: bulletIdRef.current++,
            x: prev.shipX,
            y: 88,
          },
        ],
      };
    });
  };

  const resetGame = () => {
    bulletIdRef.current = 1;
    enemyIdRef.current = 1;
    setGame(createInitialState());
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        event.preventDefault();
        moveShip(-4);
      } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        event.preventDefault();
        moveShip(4);
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        shoot();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGame((prev) => {
        if (prev.gameOver) {
          return prev;
        }

        const movedBullets = prev.bullets
          .map((bullet) => ({ ...bullet, y: bullet.y - 4 }))
          .filter((bullet) => bullet.y > -4);

        let score = prev.score;
        let lives = prev.lives;

        const nextEnemies = prev.enemies.map((enemy) => {
          const nextEnemy = { ...enemy, y: enemy.y + enemy.speed };

          const hitBulletIndex = movedBullets.findIndex(
            (bullet) => Math.abs(bullet.x - nextEnemy.x) < 4 && Math.abs(bullet.y - nextEnemy.y) < 5
          );

          if (hitBulletIndex !== -1) {
            movedBullets.splice(hitBulletIndex, 1);
            score += 10;
            return createEnemy(-12);
          }

          if (nextEnemy.y > 100 || (nextEnemy.y > 88 && Math.abs(nextEnemy.x - prev.shipX) < 6)) {
            lives -= 1;
            return createEnemy(-18);
          }

          return nextEnemy;
        });

        const safeLives = Math.max(lives, 0);

        return {
          ...prev,
          bullets: movedBullets,
          enemies: nextEnemies,
          score,
          lives: safeLives,
          gameOver: safeLives === 0,
        };
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="dev-page">
      <section className="dev-shell">
        <Link to="/" className="dev-back-link">
          Back to main site
        </Link>

        <h1>Developer Den</h1>
        <p className="dev-subtitle">
          You found the easter egg. This page is intentionally frontend-only and fully hardcoded.
        </p>

        <div className="dev-grid">
          <article className="dev-card">
            <h2>Mini Game: Retro Space Shooter</h2>
            <p>Move with Left/Right (or A/D) and shoot with Space.</p>

            <div className="shooter-board" role="region" aria-label="Retro space shooter board">
              {game.enemies.map((enemy) => (
                <span
                  key={enemy.id}
                  className="enemy-sprite"
                  style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
                >
                  M
                </span>
              ))}

              {game.bullets.map((bullet) => (
                <span
                  key={bullet.id}
                  className="bullet-sprite"
                  style={{ left: `${bullet.x}%`, top: `${bullet.y}%` }}
                >
                  |
                </span>
              ))}

              <span className="ship-sprite" style={{ left: `${game.shipX}%` }}>
                A
              </span>

              {game.gameOver && <div className="game-over-overlay">GAME OVER</div>}
            </div>

            <div className="shooter-hud">
              <span>Score: {game.score}</span>
              <span>Lives: {game.lives}</span>
            </div>

            <div className="shooter-controls">
              <button type="button" onClick={() => moveShip(-6)} aria-label="Move left">
                <span className="control-icon" aria-hidden="true">
                  ◀
                </span>
              </button>
              <button type="button" onClick={shoot} aria-label="Shoot">
                <span className="control-icon" aria-hidden="true">
                  𖦏
                </span>
              </button>
              <button type="button" onClick={() => moveShip(6)} aria-label="Move right">
                <span className="control-icon" aria-hidden="true">
                  ▶
                </span>
              </button>
              <button type="button" onClick={resetGame} aria-label="Restart game">
                <span className="control-icon" aria-hidden="true">
                  ↺
                </span>
              </button>
            </div>
          </article>

          <article className="dev-card">
            <h2>Tech Stack</h2>
            <ul>
              {techStack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="dev-card">
            <h2>Contributors</h2>
            <ul>
              {contributors.map((person) => (
                <li key={person.name}>
                  <strong>{person.name}</strong>: {person.role}
                </li>
              ))}
            </ul>
          </article>

          <article className="dev-card">
            <h2>Note</h2>
            <p>
              If you are reading this, you are the kind of person who clicks footer text and inspects
              source. That is exactly how we started. Godspeed.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
