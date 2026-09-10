import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '../types';

interface AnimeBackgroundProps {
  theme?: ThemeMode;
}

export const StarfieldCanvas: React.FC<{ color?: string; count?: number }> = ({
  color = 'rgba(190,190,255,',
  count,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Star { x: number; y: number; r: number; a: number; s: number; }
    let stars: Star[] = [];
    let animId: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
      const starCount = count || Math.min(160, Math.floor(window.innerWidth / 9));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.2,
        a: Math.random(),
        s: Math.random() * 0.004 + 0.001,
      }));
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      stars.forEach(st => {
        st.a += st.s;
        const glow = 0.2 + Math.abs(Math.sin(st.a)) * 0.6;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${glow})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [color, count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export const AnimeBackground: React.FC<AnimeBackgroundProps> = ({ theme = 'shonen' }) => {
  // Sakura petals (for Shonen)
  const sakuraPetals = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${5 + Math.random() * 7}px`,
    height: `${9 + Math.random() * 9}px`,
    duration: `${10 + Math.random() * 16}s`,
    delay: `${-Math.random() * 22}s`,
    opacity: (0.35 + Math.random() * 0.55).toFixed(2),
    rotate: `${Math.random() * 180}deg`,
  }));

  // Crimson / Autumn petals (for Torii Sunset)
  const toriiPetals = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${6 + Math.random() * 8}px`,
    height: `${10 + Math.random() * 10}px`,
    duration: `${12 + Math.random() * 14}s`,
    delay: `${-Math.random() * 20}s`,
    opacity: (0.4 + Math.random() * 0.5).toFixed(2),
    rotate: `${Math.random() * 240}deg`,
  }));

  // Floating embers (for Torii Sunset)
  const embers = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${3 + Math.random() * 5}px`,
    duration: `${7 + Math.random() * 9}s`,
    delay: `${-Math.random() * 10}s`,
    opacity: (0.35 + Math.random() * 0.5).toFixed(2),
  }));

  // Rain streaks (for Lo-Fi Room)
  const raindrops = Array.from({ length: 38 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    height: `${22 + Math.random() * 38}px`,
    duration: `${0.75 + Math.random() * 0.65}s`,
    delay: `${-Math.random() * 2}s`,
    opacity: (0.12 + Math.random() * 0.25).toFixed(2),
  }));

  if (theme === 'torii') {
    return (
      <>
        {/* Warm twilight starfield */}
        <StarfieldCanvas color="rgba(255,210,170," count={90} />

        {/* Floating warm embers from the water */}
        {embers.map(e => (
          <span
            key={e.id}
            style={{
              position: 'fixed',
              left: e.left,
              bottom: '-20px',
              width: e.size,
              height: e.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #ffe277 0%, #ff4b2b 85%)',
              boxShadow: '0 0 10px #ff6e38',
              animation: `floatUp ${e.duration} linear infinite`,
              animationDelay: e.delay,
              opacity: e.opacity,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Floating crimson autumn petals */}
        {toriiPetals.map(p => (
          <span
            key={p.id}
            className="petal"
            style={{
              left: p.left,
              width: p.width,
              height: p.height,
              background: 'linear-gradient(135deg, #ff8b7b, #d92434)',
              boxShadow: '0 0 10px rgba(255, 70, 70, 0.7)',
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: p.opacity,
              transform: `rotate(${p.rotate})`,
            }}
          />
        ))}
      </>
    );
  }

  if (theme === 'minimalist') {
    return (
      <>
        {/* Crisp celestial starfield with ice-blue shimmer */}
        <StarfieldCanvas color="rgba(180,225,255," count={80} />
      </>
    );
  }

  if (theme === 'lofi') {
    return (
      <>
        {/* Soft rain streaks on the window */}
        {raindrops.map(r => (
          <span
            key={r.id}
            style={{
              position: 'fixed',
              left: r.left,
              top: '-50px',
              width: 1.5,
              height: r.height,
              background: 'linear-gradient(180deg, transparent, rgba(180, 205, 255, 0.45))',
              animation: `rainFall ${r.duration} linear infinite`,
              animationDelay: r.delay,
              opacity: r.opacity,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        ))}
      </>
    );
  }

  // Default: Neon Shonen Cyberpunk
  return (
    <>
      {/* Ninja sky: moon, chakra, mountains */}
      <div className="ninja-sky">
        <div className="moon" />
        <div className="chakra-orb" />
      </div>

      {/* Starfield */}
      <StarfieldCanvas />

      {/* Anime conic-gradient aura blobs */}
      <div className="anime-aura aura-one" />
      <div className="anime-aura aura-two" />

      {/* Manga speed lines */}
      <div className="manga-lines" />

      {/* Sakura petals */}
      {sakuraPetals.map(p => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            transform: `rotate(${p.rotate})`,
          }}
        />
      ))}
    </>
  );
};
