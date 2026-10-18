import React, { useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const trailX = useRef(0);
  const trailY = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    // Touch screens have no cursor to replace; the elements are hidden with CSS too
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.body.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };

    const HOVER_SELECTORS = 'a, button, input, textarea, [role="button"], [role="tab"], [role="radio"]';

    // delegated, so elements that mount later (sections, menus, the photo viewer) still get the hover state
    const onOver = (e: MouseEvent) => {
      const hit = !!(e.target as Element).closest?.(HOVER_SELECTORS);
      dotRef.current?.classList.toggle('hovered', hit);
      ringRef.current?.classList.toggle('hovered', hit);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);

    // Trail animation
    let animId: number;
    const animate = () => {
      trailX.current += (mouseX.current - trailX.current) * 0.12;
      trailY.current += (mouseY.current - trailY.current) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${trailX.current}px`;
        ringRef.current.style.top  = `${trailY.current}px`;
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(animId);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          width: 10,
          height: 10,
          background: '#00f5ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'screen',
          transition: 'transform 0.15s, width 0.2s, height 0.2s',
        }}
        className="cursor-dot"
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: 36,
          height: 36,
          border: '1px solid rgba(0,245,255,0.5)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'screen',
          transition: 'width 0.3s, height 0.3s, border-color 0.3s',
        }}
        className="cursor-ring"
      />
      <style>{`
        .cursor-dot.hovered  { width: 16px !important; height: 16px !important; background: #9b59ff !important; }
        .cursor-ring.hovered { width: 56px !important; height: 56px !important; border-color: rgba(155,89,255,0.5) !important; }
        @media (hover: none), (pointer: coarse) { .cursor-dot, .cursor-ring { display: none !important; } }
      `}</style>
    </>
  );
};

export default CustomCursor;
