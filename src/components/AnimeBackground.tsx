import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '../types';
import { THEMES } from '../constants/themes';

interface AnimeBackgroundProps {
  theme?: ThemeMode;
}

export const StarfieldCanvas: React.FC<{ color?: string }> = ({ color = 'rgba(190,190,255,' }) => {
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
      stars = Array.from({ length: Math.min(170, Math.floor(window.innerWidth / 8)) }, () => ({
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
        const glow = 0.25 + Math.abs(Math.sin(st.a)) * 0.55;
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
  }, [color]);

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
  const cfg = THEMES[theme] || THEMES.shonen;

  // Sakura petals (for Shonen theme)
  const petals = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${5 + Math.random() * 7}px`,
    height: `${9 + Math.random() * 9}px`,
    duration: `${10 + Math.random() * 16}s`,
    delay: `${-Math.random() * 22}s`,
    opacity: (0.35 + Math.random() * 0.55).toFixed(2),
    rotate: `${Math.random() * 180}deg`,
  }));

  // Floating warm embers / autumn leaves (for Torii Sunset theme)
  const embers = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${4 + Math.random() * 6}px`,
    duration: `${6 + Math.random() * 8}s`,
    delay: `${-Math.random() * 10}s`,
    opacity: (0.4 + Math.random() * 0.5).toFixed(2),
  }));

  // Rain streaks (for Lo-Fi Room theme)
  const raindrops = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    height: `${20 + Math.random() * 40}px`,
    duration: `${0.8 + Math.random() * 0.7}s`,
    delay: `${-Math.random() * 2}s`,
    opacity: (0.15 + Math.random() * 0.3).toFixed(2),
  }));

  if (theme === 'minimalist') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: '#040508',
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(30, 41, 59, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (theme === 'torii') {
    return (
      <>
        {/* Torii sunset warm twilight sky */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 100%, #3a0d18 0%, #1a0815 45%, #0d0612 100%)',
          }}
        />

        {/* Big sunset twilight sun */}
        <div
          style={{
            position: 'fixed',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'linear-gradient(180deg, #ff7a45 0%, #ff3838 70%, transparent 100%)',
            boxShadow: '0 0 100px rgba(255, 110, 70, 0.5)',
            opacity: 0.35,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Warm Starfield */}
        <StarfieldCanvas color="rgba(255,200,160," />

        {/* Floating embers */}
        {embers.map(e => (
          <span
            key={e.id}
            className="ember"
            style={{
              position: 'fixed',
              left: e.left,
              bottom: '-20px',
              width: e.size,
              height: e.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #ffd05b 0%, #ff5232 80%)',
              boxShadow: '0 0 10px #ff7a45',
              animation: `floatUp ${e.duration} linear infinite`,
              animationDelay: e.delay,
              opacity: e.opacity,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Manga speed lines with warm tone */}
        <div className="manga-lines" style={{ opacity: 0.08 }} />
      </>
    );
  }

  if (theme === 'lofi') {
    return (
      <>
        {/* Cozy Lo-Fi midnight room backdrop */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 20% 40%, #1e1b4b 0%, #0f1026 55%, #080914 100%)',
          }}
        />

        {/* Soft neon lamp glow */}
        <div
          style={{
            position: 'fixed',
            top: '20%',
            right: '15%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.22), transparent 70%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Rain streaks on window */}
        {raindrops.map(r => (
          <span
            key={r.id}
            className="rain-streak"
            style={{
              position: 'fixed',
              left: r.left,
              top: '-60px',
              width: 1.5,
              height: r.height,
              background: 'linear-gradient(180deg, transparent, rgba(190, 210, 255, 0.5))',
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
      {/* Ninja sky: moon, chakra, mountains, village */}
      <div className="ninja-sky">
        <div className="moon" />
        <div className="chakra-orb" />
        <div className="mountain back" />
        <div className="village" />
        <div className="mountain" />
      </div>

      {/* Starfield */}
      <StarfieldCanvas />

      {/* Anime conic-gradient aura blobs */}
      <div className="anime-aura aura-one" />
      <div className="anime-aura aura-two" />

      {/* Manga speed lines */}
      <div className="manga-lines" />

      {/* Sakura petals */}
      {petals.map(p => (
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
