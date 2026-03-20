import React, { useEffect, useRef, useState } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 18);
    const drops: number[] = Array(cols).fill(1);
    const chars = 'アイウエオカキクケコ0123456789ABCDEF<>{}[]';
    const draw = () => {
      ctx.fillStyle = 'rgba(3,7,18,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = Math.random() * 0.6 + 0.15;
        ctx.fillStyle = `rgba(0,245,255,${alpha})`;
        ctx.fillText(char, i * 18, y * 18);
        if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const steps = [
      { target: 30, delay: 40 },
      { target: 60, delay: 25 },
      { target: 85, delay: 35 },
      { target: 100, delay: 18 },
    ];
    let current = 0;
    let stepIdx = 0;
    const tick = () => {
      if (stepIdx >= steps.length) return;
      const { target, delay } = steps[stepIdx];
      if (current < target) {
        current++;
        setProgress(current);
        setTimeout(tick, delay + Math.random() * 15);
      } else {
        stepIdx++;
        if (stepIdx < steps.length) setTimeout(tick, 250);
      }
    };
    setTimeout(tick, 300);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setPhase('done'), 500);
      setTimeout(onComplete, 1100);
    }
  }, [progress, onComplete]);

  const BOOT_LINES = [
    '> Initializing AI core modules...',
    '> Loading neural network layers...',
    '> Connecting to data pipeline...',
    '> Rendering portfolio interface...',
  ];
  const activeLine = Math.floor((progress / 100) * BOOT_LINES.length);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999, background: '#030712',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity .6s ease, transform .6s ease',
      opacity: phase === 'done' ? 0 : 1,
      transform: phase === 'done' ? 'scale(1.04)' : 'scale(1)',
      pointerEvents: phase === 'done' ? 'none' : 'all',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.35 }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3,7,18,.85) 100%)',
      }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: 'min(480px, 90%)' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 90, height: 90, borderRadius: '50%',
            border: '2px solid rgba(0,245,255,.4)',
            boxShadow: '0 0 40px rgba(0,245,255,.25), inset 0 0 40px rgba(155,89,255,.1)',
            background: 'rgba(13,18,36,.8)',
            fontFamily: "'Orbitron', sans-serif", fontSize: '2rem', fontWeight: 900,
          } as React.CSSProperties}>
            <span style={{
              background: 'linear-gradient(135deg, #00f5ff, #9b59ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            } as React.CSSProperties}>MA</span>
          </div>
        </div>
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900,
          marginBottom: '.4rem',
          background: 'linear-gradient(135deg,#00f5ff,#9b59ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          letterSpacing: '3px',
        } as React.CSSProperties}>
          MOHAMED ABRAR S A
        </h1>
        <p style={{
          fontFamily: "'Space Mono',monospace", fontSize: '.75rem',
          color: '#64748b', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '3rem',
        }}>
          // AI &amp; DATA SCIENCE ENGINEER
        </p>
        <div style={{
          textAlign: 'left', marginBottom: '2rem',
          background: 'rgba(0,0,0,.4)', border: '1px solid rgba(0,245,255,.12)',
          borderRadius: 10, padding: '1rem 1.2rem',
        }}>
          {BOOT_LINES.map((line, i) => (
            <div key={i} style={{
              fontFamily: "'Space Mono',monospace", fontSize: '.72rem',
              color: i < activeLine ? '#00f5ff' : i === activeLine ? 'rgba(0,245,255,.65)' : '#1e293b',
              marginBottom: '.4rem', transition: 'color .4s',
            }}>
              {line}
              {i === activeLine && (
                <span style={{
                  display: 'inline-block', width: 8, height: 12, background: '#00f5ff',
                  marginLeft: 4, verticalAlign: 'middle', animation: 'blink .7s step-end infinite',
                }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '.8rem' }}>
          <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`,
              background: 'linear-gradient(to right,#00f5ff,#9b59ff)', borderRadius: 2,
              transition: 'width .12s linear', boxShadow: '0 0 12px rgba(0,245,255,.6)',
            }} />
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'Space Mono',monospace", fontSize: '.72rem', color: '#64748b',
        }}>
          <span>LOADING PORTFOLIO</span>
          <span style={{ color: '#00f5ff' }}>{progress}%</span>
        </div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
};

export default Loader;
