import React, { useEffect, useRef } from 'react';

export const StarfieldCanvas: React.FC = () => {
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
        ctx.fillStyle = `rgba(190,190,255,${glow})`;
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
  }, []);

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

export const AnimeBackground: React.FC = () => {
  // Spawn sakura petals
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
