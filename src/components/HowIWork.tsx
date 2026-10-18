import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, Database, Rocket, Zap } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

const PRINCIPLES = [
  { title: 'Start with the data', text: 'Clean it, explore it and question it before touching a model.', icon: 'data' },
  { title: 'Prototype fast', text: 'A rough working demo beats a perfect plan on paper.', icon: 'zap' },
  { title: 'Measure honestly', text: 'Accuracy, latency and edge cases — numbers over vibes.', icon: 'gauge' },
  { title: 'Ship it', text: 'Wrap it in an app or dashboard so real people can use it.', icon: 'rocket' },
] as const;

// small looping illustrations; each speeds up / plays its big move when the card is hovered
const Icon: React.FC<{ kind: typeof PRINCIPLES[number]['icon'] }> = ({ kind }) => {
  if (kind === 'data') {
    return (
      <span className="hw-ico hw-data">
        <i /><i /><i />
        <Database size={26} strokeWidth={1.6} />
      </span>
    );
  }
  if (kind === 'zap') return <span className="hw-ico hw-zap"><Zap size={26} strokeWidth={1.6} /></span>;
  if (kind === 'gauge') {
    return (
      <span className="hw-ico hw-gauge">
        <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden>
          <path d="M6 28 A15 15 0 1 1 34 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path className="hw-arc" d="M6 28 A15 15 0 1 1 34 28" fill="none" stroke="var(--cyan)" strokeWidth="2.4" strokeLinecap="round" />
          <line className="hw-needle" x1="20" y1="22" x2="20" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="20" cy="22" r="2.6" fill="currentColor" />
        </svg>
      </span>
    );
  }
  return (
    <span className="hw-ico hw-rocket">
      <Rocket size={26} strokeWidth={1.6} />
      <i className="hw-trail" />
    </span>
  );
};

// a node on the progress line lights up once the line reaches its step
const Node: React.FC<{ progress: MotionValue<number>; at: number }> = ({ progress, at }) => {
  const lit = useTransform(progress, [Math.max(0, at - 0.06), at], [0, 1]);
  const scale = useTransform(lit, [0, 1], [0.5, 1]);
  const opacity = useTransform(lit, [0, 1], [0.3, 1]);
  return <motion.i className="hw-node" style={{ left: `${at * 100}%`, scale, opacity }} />;
};

const Step: React.FC<{ p: typeof PRINCIPLES[number]; i: number; inView: boolean }> = ({ p, i, inView }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: (0.5 - py) * 8, y: (px - 0.5) * 10 });
    ref.current!.style.setProperty('--gx', `${px * 100}%`);
    ref.current!.style.setProperty('--gy', `${py * 100}%`);
  };

  return (
    <motion.div
      ref={ref}
      className="hw-step"
      initial={{ clipPath: 'inset(100% 0 0 0)', y: 40 }}
      animate={inView ? { clipPath: 'inset(0% 0 0 0)', y: 0 } : undefined}
      transition={{ duration: 1, ease: EASE, delay: i * 0.12 }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ rotateX: tilt.x, rotateY: tilt.y }}
    >
      <span className="hw-glare" aria-hidden />
      <div className="hw-top">
        <span className="hw-n">
          <motion.span
            initial={{ y: '110%' }}
            animate={inView ? { y: '0%' } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.12 }}
          >
            {String(i + 1).padStart(2, '0')}
          </motion.span>
        </span>
        <Icon kind={p.icon} />
      </div>
      <motion.h4
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, ease: EASE, delay: 0.4 + i * 0.12 }}
      >
        {p.title}
      </motion.h4>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 0.55 + i * 0.12 }}
      >
        {p.text}
      </motion.p>
      <span className="hw-foot">
        <span>step {i + 1}/{PRINCIPLES.length}</span>
        <ArrowRight size={16} className="hw-arrow" />
      </span>
    </motion.div>
  );
};

const HowIWork: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start 0.85', 'end 0.55'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  // observe the grid, not the cards: a card hidden by clip-path reports 0% visible and would never reveal
  const inView = useInView(gridRef, { once: true, amount: 0.15 });

  return (
    <>
      <div className="hw-grid" ref={gridRef}>
        <div className="hw-line" aria-hidden>
          <motion.span style={{ scaleX: progress }} />
          {PRINCIPLES.map((_, i) => <Node key={i} progress={progress} at={i / PRINCIPLES.length} />)}
        </div>
        {PRINCIPLES.map((p, i) => <Step key={p.title} p={p} i={i} inView={inView} />)}
      </div>

      <style>{`
        .hw-grid{position:relative;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid rgba(255,255,255,.12);perspective:1200px}
        .hw-line{position:absolute;left:0;right:0;top:0;height:1px;background:rgba(255,255,255,.12);z-index:3}
        .hw-line > span{position:absolute;inset:0;transform-origin:left;background:linear-gradient(90deg,var(--cyan),var(--purple))}
        .hw-node{position:absolute;top:-5px;width:11px;height:11px;margin-left:-1px;border-radius:50%;background:#0b0b0c;border:2px solid var(--cyan);
          box-shadow:0 0 12px rgba(0,245,255,.6)}

        .hw-step{--stroke:#ededed;--gx:50%;--gy:50%;position:relative;display:flex;flex-direction:column;padding:2.2rem 1.4rem 1.6rem;
          border-right:1px solid rgba(255,255,255,.12);overflow:hidden;color:#ededed;transform-style:preserve-3d;
          transition:color .35s;will-change:transform}
        .hw-step:last-child{border-right:0}
        .hw-step::before{content:'';position:absolute;inset:0;background:#ededed;transform:scaleY(0);transform-origin:bottom;
          transition:transform .55s cubic-bezier(.22,1,.36,1)}
        .hw-step:hover{color:#0b0b0c;--stroke:#0b0b0c}
        .hw-step:hover::before{transform:scaleY(1)}
        .hw-step > *{position:relative}
        .hw-glare{position:absolute!important;inset:0;pointer-events:none;opacity:0;transition:opacity .4s;
          background:radial-gradient(260px circle at var(--gx) var(--gy),rgba(0,245,255,.18),transparent 60%)}
        .hw-step:hover .hw-glare{opacity:1}

        .hw-top{display:flex;justify-content:space-between;align-items:flex-start}
        .hw-n{display:block;overflow:hidden;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:3.2rem;line-height:1;letter-spacing:-.05em}
        .hw-n > span{display:inline-block;color:transparent;-webkit-text-stroke:1px var(--stroke);
          transition:color .45s,-webkit-text-stroke-color .35s}
        .hw-step:hover .hw-n > span{color:#0b0b0c}
        .hw-step h4{margin:1.6rem 0 .5rem;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:1.18rem;letter-spacing:-.01em;
          transition:transform .45s cubic-bezier(.22,1,.36,1)}
        .hw-step:hover h4{transform:translateX(4px)}
        .hw-step p{margin:0;font-size:.88rem;line-height:1.6;color:inherit;opacity:.75}
        .hw-foot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:1.6rem;
          font-family:'Space Mono',monospace;font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;opacity:.55}
        .hw-arrow{transform:translateX(-10px);opacity:0;transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .3s}
        .hw-step:hover .hw-arrow{transform:none;opacity:1}

        /* icons */
        .hw-ico{position:relative;width:52px;height:52px;border-radius:50%;display:grid;place-items:center;border:1px solid currentColor;
          transition:transform .45s cubic-bezier(.22,1,.36,1)}
        .hw-step:hover .hw-ico{transform:rotate(-8deg) scale(1.06)}
        .hw-data i{position:absolute;top:-6px;width:4px;height:4px;border-radius:50%;background:var(--cyan);opacity:0;animation:hw-drop 2.4s ease-in infinite}
        .hw-data i:nth-child(1){left:16px}
        .hw-data i:nth-child(2){left:24px;animation-delay:.8s}
        .hw-data i:nth-child(3){left:32px;animation-delay:1.6s}
        .hw-step:hover .hw-data i{animation-duration:1s}
        .hw-zap svg{animation:hw-flicker 3s steps(1) infinite}
        .hw-step:hover .hw-zap{animation:hw-shake .4s ease-in-out}
        .hw-step:hover .hw-zap svg{fill:#f2c811;color:#0b0b0c;animation:none}
        .hw-needle{transform-origin:20px 22px;transform:rotate(-55deg);transition:transform 1s cubic-bezier(.34,1.56,.64,1);animation:hw-idle 3s ease-in-out infinite}
        .hw-step:hover .hw-needle{transform:rotate(58deg);animation:none}
        .hw-arc{stroke-dasharray:70;stroke-dashoffset:70;transition:stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)}
        .hw-step:hover .hw-arc{stroke-dashoffset:0}
        .hw-rocket svg{transition:transform .6s cubic-bezier(.34,1.56,.64,1);animation:hw-hover 2.4s ease-in-out infinite}
        .hw-trail{position:absolute;left:50%;top:62%;width:3px;height:0;margin-left:-6px;border-radius:2px;
          background:linear-gradient(var(--cyan),transparent);transform:rotate(45deg);transform-origin:top;transition:height .45s}
        .hw-step:hover .hw-rocket svg{transform:translate(4px,-6px);animation:none}
        .hw-step:hover .hw-trail{height:16px}

        @keyframes hw-drop{0%{opacity:0;transform:translateY(-6px)}25%{opacity:1}70%{opacity:1;transform:translateY(18px)}100%{opacity:0;transform:translateY(22px)}}
        @keyframes hw-flicker{0%,88%,100%{opacity:1}90%,94%{opacity:.25}92%,96%{opacity:1}}
        @keyframes hw-shake{0%,100%{transform:rotate(-8deg) scale(1.06)}25%{transform:rotate(-14deg) scale(1.06)}75%{transform:rotate(-2deg) scale(1.06)}}
        @keyframes hw-idle{0%,100%{transform:rotate(-55deg)}50%{transform:rotate(-35deg)}}
        @keyframes hw-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}

        @media (max-width:980px){
          .hw-grid{grid-template-columns:1fr 1fr}
          .hw-step:nth-child(3){border-right:0}
          .hw-step:nth-child(-n+3){border-bottom:1px solid rgba(255,255,255,.12)}
          .hw-node{display:none}
        }
        @media (max-width:640px){
          .hw-grid{grid-template-columns:1fr}
          .hw-step{border-right:0!important;border-bottom:1px solid rgba(255,255,255,.12)}
          .hw-step:last-child{border-bottom:0}
        }
        @media (prefers-reduced-motion:reduce){.hw-step *{animation:none!important}}
      `}</style>
    </>
  );
};

export default HowIWork;
