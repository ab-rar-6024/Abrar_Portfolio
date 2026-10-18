import React, { useEffect, useRef, useState } from 'react';
import {
  motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useScrollTo } from '../hooks';

const EASE = [0.22, 1, 0.36, 1] as const;
const LENS_R = 170;
const LENS_R_MOBILE = 110;
const HIDDEN = 'I teach machines to see, listen and decide — then I ship them. Cameras that catch theft as it happens, assistants that answer when you speak, websites that people actually remember.';
const COPIES = 4;

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// A line of giant type that drifts sideways forever. Scrolling speeds it up (and flips it
// when scrolling back up) and leans it with the scroll velocity.
const KineticRow: React.FC<{ speed: number; className: string; children: React.ReactNode; delay: number; from: number }> = ({ speed, className, children, delay, from }) => {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(velocity, [-2500, 2500], [10, -10]);
  const x = useTransform(base, v => `${wrap(-100 / COPIES, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (boost.get() < 0) dir.current = -1;
    else if (boost.get() > 0) dir.current = 1;
    const move = speed * dir.current * (1 + Math.abs(boost.get())) * (delta / 1000);
    base.set(base.get() + move);
  });

  return (
    <motion.div
      className="kh-row-wrap"
      initial={{ opacity: 0, x: from }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      <motion.div className={`kh-row ${className}`} style={{ x, skewX: skew }}>
        {Array.from({ length: COPIES }, (_, i) => <span key={i} aria-hidden={i > 0}>{children}</span>)}
      </motion.div>
    </motion.div>
  );
};

// circular "view work" badge that drifts towards the cursor
const Badge: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [off, setOff] = useState({ x: 0, y: 0 });
  return (
    <motion.button
      ref={ref}
      className="kh-badge"
      onClick={onClick}
      animate={off}
      transition={{ type: 'spring', stiffness: 200, damping: 14 }}
      onMouseMove={e => {
        const r = ref.current!.getBoundingClientRect();
        setOff({ x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35 });
      }}
      onMouseLeave={() => setOff({ x: 0, y: 0 })}
      aria-label="View my work"
    >
      <svg className="kh-ring" viewBox="0 0 120 120" aria-hidden>
        <defs><path id="kh-badge-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
        <text><textPath href="#kh-badge-path">VIEW WORK • VIEW WORK • VIEW WORK • </textPath></text>
      </svg>
      <ArrowDown size={22} />
    </motion.button>
  );
};

const Hero: React.FC = () => {
  const scrollTo = useScrollTo();
  const sectionRef = useRef<HTMLElement>(null);

  // hover lens: a light circle follows the cursor and reveals a hidden layer of text.
  // It shrinks away over buttons and links so it never hides something you're about to click.
  useEffect(() => {
    const el = sectionRef.current!;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0, r: 0 };
    let active = false;
    let placed = false;
    let raf = 0;
    let visible = true;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (!placed) { pos.x = target.x; pos.y = target.y; placed = true; }
      if (e.pointerType === 'mouse') active = !(e.target as Element).closest('button, a');
    };
    const onLeave = () => { active = false; };
    // touch: tap (or slide a finger) to peek through the lens; it fades out shortly after lifting
    let hideTimer = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || (e.target as Element).closest('button, a')) return;
      const rect = el.getBoundingClientRect();
      target.x = pos.x = e.clientX - rect.left;
      target.y = pos.y = e.clientY - rect.top;
      placed = true;
      active = true;
      clearTimeout(hideTimer);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => { active = false; }, 1400);
    };

    const frame = () => {
      const full = el.clientWidth < 760 ? LENS_R_MOBILE : LENS_R;
      pos.x += (target.x - pos.x) * 0.14;
      pos.y += (target.y - pos.y) * 0.14;
      pos.r += ((active ? full : 0) - pos.r) * 0.14;
      el.style.setProperty('--lx', `${pos.x}px`);
      el.style.setProperty('--ly', `${pos.y}px`);
      el.style.setProperty('--lr', `${pos.r}px`);
      el.style.setProperty('--lo', String(Math.min(1, pos.r / full)));
      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(el);
    raf = requestAnimationFrame(frame);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      io.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section id="hero" className="kh" ref={sectionRef}>
      <motion.div className="kh-top" {...rise(0.3)}>
        <span>(01) — hello</span>
        <span className="kh-mid">AI &amp; Data Science Engineer</span>
      </motion.div>

      <h1 className="kh-rows" aria-label="Mohamed Abrar — machine learning, computer vision, NLP and data. Builds AI that ships.">
        <KineticRow speed={-2.2} className="solid" delay={0.35} from={-120}>
          Mohamed Abrar<em>—</em>
        </KineticRow>
        <KineticRow speed={2.8} className="outline" delay={0.5} from={120}>
          Machine Learning<em>✦</em>Computer Vision<em>✦</em>NLP<em>✦</em>Data<em>✦</em>
        </KineticRow>
        <KineticRow speed={-1.8} className="accent" delay={0.65} from={-120}>
          Builds AI that ships<em>✦</em>
        </KineticRow>
      </h1>

      <div className="kh-bottom">
        <motion.p className="kh-pitch" {...rise(1)}>
          I design, train and ship machine-learning systems — from real-time YOLO surveillance and voice
          assistants to dashboards that turn raw data into decisions.
        </motion.p>
        <motion.div className="kh-actions" {...rise(1.15)}>
          <button className="kh-talk" onClick={() => scrollTo('contact')}>
            Start a conversation <ArrowUpRight size={16} />
          </button>
          <Badge onClick={() => scrollTo('projects')} />
        </motion.div>
      </div>

      {/* hidden layer, only visible inside the hover lens */}
      <div className="kh-lens" aria-hidden>
        <p className="kh-lens-text">{HIDDEN}</p>
        <p className="kh-egg e1">yes, the loader crash was on purpose 😉</p>
        <p className="kh-egg e2">psst — I also build mobile apps 📱</p>
        <p className="kh-egg e3">→ scroll down for the full story</p>
      </div>
      <div className="kh-lens-ring" aria-hidden>
        <svg viewBox="0 0 200 200">
          <defs><path id="kh-lens-path" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" /></defs>
          <text><textPath href="#kh-lens-path">MOVE · EXPLORE · MOVE · EXPLORE · MOVE · EXPLORE · </textPath></text>
        </svg>
      </div>

      <style>{`
        .kh{--lx:50%;--ly:50%;--lr:0px;--lo:0;position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;gap:2rem;
          padding:6.4rem 0 2.2rem;overflow:hidden;z-index:1;background:#0b0b0c;color:#ededed}
        .kh-top{display:grid;grid-template-columns:1fr auto;align-items:center;margin:0 2.2%;padding-bottom:.8rem;
          border-bottom:1.5px solid #ededed;font-family:'Space Grotesk',sans-serif;font-size:.95rem}
        .kh-top span:last-child{justify-self:end}

        .kh-rows{margin:0;display:flex;flex-direction:column;gap:.2rem;font-weight:500}
        .kh-row-wrap{overflow:hidden}
        .kh-row{display:flex;width:max-content;white-space:nowrap;will-change:transform;
          font-family:'Space Grotesk',sans-serif;font-size:clamp(3.4rem,10.5vw,10.5rem);line-height:.98;letter-spacing:-.045em;text-transform:uppercase}
        .kh-row span{display:inline-flex;align-items:center;padding-right:.35em}
        .kh-row em{font-style:normal;font-size:.55em;margin:0 .35em;opacity:.9}
        .kh-row.solid{color:#ededed}
        .kh-row.outline{color:transparent;-webkit-text-stroke:1.5px #ededed}
        .kh-row.outline em{color:var(--cyan);-webkit-text-stroke:0}
        .kh-row.accent{color:var(--cyan)}
        .kh-row.accent em{color:var(--purple)}

        .kh-bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;margin:0 2.2%}
        .kh-pitch{max-width:500px;margin:0;font-size:clamp(1rem,1.35vw,1.15rem);line-height:1.65;color:#a1a6ae}
        .kh-actions{display:flex;align-items:center;gap:2rem}
        .kh-talk{display:inline-flex;align-items:center;gap:.4rem;padding:0 0 .25rem;background:none;border:0;border-bottom:1px solid #ededed;
          cursor:pointer;color:#ededed;font-family:'Space Grotesk',sans-serif;font-size:1.05rem}
        .kh-talk svg{transition:transform .3s}
        .kh-talk:hover svg{transform:rotate(45deg)}
        .kh-badge{position:relative;width:118px;height:118px;border-radius:50%;display:grid;place-items:center;cursor:pointer;
          background:#ededed;color:#0b0b0c;border:0;transition:background .3s}
        .kh-badge:hover{background:var(--cyan)}
        .kh-badge .kh-ring{position:absolute;inset:6px;width:calc(100% - 12px);height:calc(100% - 12px);animation:kh-spin 12s linear infinite}
        .kh-badge text{font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:1.6px;fill:#0b0b0c}
        @keyframes kh-spin{to{transform:rotate(360deg)}}

        .kh-lens{position:absolute;inset:0;z-index:4;pointer-events:none;background:#ededed;color:#0b0b0c;
          clip-path:circle(var(--lr) at var(--lx) var(--ly));-webkit-clip-path:circle(var(--lr) at var(--lx) var(--ly))}
        .kh-lens-text{position:absolute;left:2.2%;right:2.2%;top:50%;transform:translateY(-50%);margin:0 auto;max-width:1100px;
          font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(1.7rem,3.6vw,3.3rem);line-height:1.15;letter-spacing:-.03em}
        .kh-egg{position:absolute;margin:0;font-family:'Space Mono',monospace;font-size:.78rem;letter-spacing:.02em}
        .kh-egg.e1{top:17%;left:2.2%}
        .kh-egg.e2{top:17%;right:2.2%}
        .kh-egg.e3{bottom:9%;left:2.2%}
        .kh-lens-ring{position:absolute;left:0;top:0;z-index:5;pointer-events:none;opacity:var(--lo);
          width:calc(var(--lr) * 2.28 + 40px);height:calc(var(--lr) * 2.28 + 40px);
          transform:translate(calc(var(--lx) - 50%),calc(var(--ly) - 50%))}
        .kh-lens-ring svg{width:100%;height:100%;overflow:visible;animation:kh-spin 18s linear infinite}
        .kh-lens-ring text{font-family:'Space Mono',monospace;font-size:7.4px;letter-spacing:1.6px;fill:#ededed;opacity:.7}
        @media (max-width:760px){
          .kh-egg{display:none}
          .kh{padding-top:5.6rem}
          .kh-top{grid-template-columns:1fr auto;margin:0 1.2rem;font-size:.8rem}
          .kh-mid{display:none}
          .kh-row{font-size:16vw}
          .kh-bottom{flex-direction:column;align-items:flex-start;margin:0 1.2rem}
          .kh-actions{width:100%;justify-content:space-between}
          .kh-badge{width:96px;height:96px}
        }
        @media (prefers-reduced-motion:reduce){.kh-badge .kh-ring,.kh-lens-ring svg{animation:none}}
      `}</style>
    </section>
  );
};

export default Hero;
