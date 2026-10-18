import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

type Phase = 'count' | 'crash' | 'fix' | 'leave';

const EASE = [0.76, 0, 0.24, 1] as const;
const COUNT_MS = 2600;
const COLUMNS = 5;
const WORDS = ['Mohamed', 'Abrar'];
const GLYPHS = '01{}[]<>/\\#$%&*+=;:_|~';

const BUILD_LOG = [
  'booting kernel  ai-engineer@2027',
  'import torch, cv2, mediapipe',
  'loading yolov8n.pt ........ 6.2MB',
  'training epoch 37/50  loss=0.0342',
  'connecting power-bi dashboards',
  'compiling 9 projects',
  'npm run build  ✓ 448 modules',
  'deploying portfolio → vercel',
];

const STACK = [
  'Uncaught RuntimeError: talent overflow in portfolio.tsx:404',
  '    at MohamedAbrar.build (ai-engineer.ts:2027)',
  '    at Coffee.drink (fuel.js:∞)',
];

// Counts quickly, hesitates twice, then lands — feels like real loading, not a linear timer.
const curve = (t: number) => {
  const base = 1 - Math.pow(1 - t, 3);
  const hitch = Math.max(0, Math.sin(t * Math.PI * 2.5)) * 0.03 * (1 - t);
  return Math.min(1, Math.max(0, base - hitch));
};

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// When each letter stops scrambling, in ms from mount — just after it has risen into view.
const settleAt = (w: number, i: number) => (0.35 + w * 0.12 + i * 0.04) * 1000 + 650;

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>('count');
  const [elapsed, setElapsed] = useState(0);
  const mountedAt = useRef(performance.now());
  const finished = useRef(false);
  const reduced = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onComplete();
  }, [onComplete]);

  // counter + scramble clock
  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced.current ? 400 : COUNT_MS;
    let raf = 0;
    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      setProgress(curve(t) * 100);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    const delay = setTimeout(() => { raf = requestAnimationFrame(step); }, reduced.current ? 0 : 500);
    const scramble = setInterval(() => {
      const ms = performance.now() - mountedAt.current;
      setElapsed(ms);
      if (ms > settleAt(1, WORDS[1].length)) clearInterval(scramble);
    }, 45);
    return () => { clearTimeout(delay); cancelAnimationFrame(raf); clearInterval(scramble); };
  }, []);

  // 100% → crash → hotfix → leave
  useEffect(() => {
    if (progress < 100) return;
    if (reduced.current) {
      setPhase('leave');
      const t = setTimeout(finish, 500);
      return () => clearTimeout(t);
    }
    const timers = [
      setTimeout(() => setPhase('crash'), 250),
      setTimeout(() => setPhase('fix'), 1350),
      setTimeout(() => setPhase('leave'), 2350),
      setTimeout(finish, 3050),
    ];
    return () => timers.forEach(clearTimeout);
  }, [progress, finish]);

  const pct = Math.round(progress);
  const leaving = phase === 'leave';
  const crashed = phase === 'crash';
  const fade = { opacity: leaving ? 0 : 1, transition: { duration: 0.4 } };
  const logCount = Math.min(BUILD_LOG.length, Math.floor(progress / (100 / BUILD_LOG.length)) + 1);

  return (
    <motion.div className={`ldr${crashed ? ' glitch' : ''}`} role="status" aria-label={`Loading ${pct}%`}>
      {/* curtain columns — they slide up one after another to reveal the site */}
      <div className="ldr-cols" aria-hidden>
        {Array.from({ length: COLUMNS }, (_, i) => (
          <motion.span
            key={i}
            initial={{ y: 0 }}
            exit={{ y: '-100%', transition: { duration: 0.9, ease: EASE, delay: i * 0.07 } }}
          />
        ))}
      </div>

      <motion.div className="ldr-grain" aria-hidden exit={{ opacity: 0, transition: { duration: 0.3 } }} />
      {crashed && (
        <div className="ldr-bars" aria-hidden>
          <i /><i /><i /><i />
        </div>
      )}

      {/* everything on top of the curtain fades fast on exit, so no text is left over the site */}
      <motion.div className="ldr-ui" exit={{ opacity: 0, transition: { duration: 0.25 } }}>
      {/* corners */}
      <motion.div className="ldr-corner tl" initial={{ opacity: 0 }} animate={fade}>
        Portfolio <span>©{new Date().getFullYear()}</span>
      </motion.div>
      <motion.div className="ldr-corner br" initial={{ opacity: 0 }} animate={fade}>
        AI &amp; Data Science Engineer
      </motion.div>

      {/* live build log */}
      <motion.ol className="ldr-log" initial={{ opacity: 0 }} animate={fade} aria-hidden>
        {BUILD_LOG.slice(0, logCount).slice(-5).map((line, i, arr) => (
          <li key={line} style={{ opacity: 0.35 + (0.65 * (i + 1)) / arr.length }}>
            <span>[{(BUILD_LOG.indexOf(line) * 0.29 + 0.12).toFixed(2).padStart(5, '0')}]</span> ▸ {line}
          </li>
        ))}
      </motion.ol>

      {/* name, rising through masks while it decodes from glyphs */}
      <h1 className="ldr-name">
        {WORDS.map((word, w) => (
          <span key={word} className="ldr-line">
            {word.split('').map((ch, i) => (
              <motion.span
                key={i}
                className="ldr-char"
                // Each letter shows its slice of one gradient so the word reads as a single sweep.
                style={w === 1 ? {
                  backgroundSize: `${word.length * 100}% 100%`,
                  backgroundPosition: `${(i / (word.length - 1)) * 100}% 0`,
                } : undefined}
                initial={{ y: '110%' }}
                animate={{ y: leaving ? '-110%' : '0%' }}
                transition={{
                  duration: leaving ? 0.6 : 0.9,
                  ease: EASE,
                  delay: leaving ? (w * word.length + i) * 0.015 : 0.35 + w * 0.12 + i * 0.04,
                }}
              >
                {elapsed < settleAt(w, i) ? randomGlyph() : ch}
              </motion.span>
            ))}
          </span>
        ))}
      </h1>

      {/* crash → hotfix console */}
      {(phase === 'crash' || phase === 'fix') && (
        <div className="ldr-console" aria-hidden>
          {STACK.map(line => (
            <p key={line} className={`err${phase === 'fix' ? ' fixed' : ''}`}>{line}</p>
          ))}
          {phase === 'fix' && (
            <>
              <p className="cmd ldr-type">$ git commit -m "hotfix: contain the awesomeness"</p>
              <p className="ok">✓ deployed in 0.42s</p>
            </>
          )}
        </div>
      )}

      {/* counter */}
      <div className="ldr-count-mask">
        <motion.div
          className={`ldr-count${crashed ? ' err' : ''}`}
          initial={{ y: '100%' }}
          animate={{ y: leaving ? '100%' : '0%' }}
          transition={{ duration: 0.7, ease: EASE, delay: leaving ? 0 : 0.2 }}
        >
          {crashed ? 'ERR' : pct}<sup>{crashed ? '!' : '%'}</sup>
        </motion.div>
      </div>

      {/* progress line */}
      <motion.div className="ldr-track" animate={fade}>
        <div className={`ldr-fill${crashed ? ' err' : ''}`} style={{ transform: `scaleX(${progress / 100})` }} />
      </motion.div>

      </motion.div>

      <style>{`
        .ldr{position:fixed;inset:0;z-index:99999;color:#ededed;font-family:'Space Grotesk',sans-serif;pointer-events:all}
        .ldr-cols{position:absolute;inset:0;display:flex}
        .ldr-ui{position:absolute;inset:0}
        .ldr-cols span{flex:1;height:100%;background:#050505;margin-right:-1px}
        .ldr-grain{position:absolute;inset:0;opacity:.07;pointer-events:none;mix-blend-mode:screen;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        .ldr-corner{position:absolute;font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:#8a8a8a;display:flex;gap:.9rem}
        .ldr-corner span{color:#ededed}
        .ldr-corner.tl{top:clamp(1.1rem,3vw,2rem);left:clamp(1.1rem,3vw,2rem)}
        .ldr-corner.br{bottom:clamp(1.6rem,4vw,2.6rem);right:clamp(1.1rem,3vw,2rem)}
        .ldr-log{position:absolute;right:clamp(1.1rem,3vw,2rem);bottom:clamp(3.4rem,7vw,4.6rem);margin:0;padding:0;list-style:none;
          font-family:'Space Mono',monospace;font-size:.68rem;line-height:1.75;color:#9a9a9a;text-align:left;width:min(340px,40vw)}
        .ldr-log span{color:#555}
        .ldr-log li:last-child{color:#00f5ff}
        .ldr-name{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);margin:0;text-align:center;
          font-weight:500;font-size:clamp(3.2rem,11vw,10rem);line-height:.9;letter-spacing:-.045em;white-space:nowrap}
        .ldr-line{display:block;overflow:hidden;padding-bottom:.06em}
        .ldr-line + .ldr-line .ldr-char{background-image:linear-gradient(90deg,#00f5ff,#9b59ff);-webkit-background-clip:text;background-clip:text;color:transparent}
        .ldr-char{display:inline-block;will-change:transform;min-width:.3em}
        .ldr-count-mask{position:absolute;left:clamp(1.1rem,3vw,2rem);bottom:clamp(1rem,3vw,1.8rem);overflow:hidden}
        .ldr-count{font-weight:300;font-size:clamp(4.5rem,13vw,11rem);line-height:.85;letter-spacing:-.05em;font-variant-numeric:tabular-nums}
        .ldr-count sup{font-size:.22em;font-weight:500;letter-spacing:0;vertical-align:top;margin-left:.15em;color:#00f5ff;position:relative;top:.35em}
        .ldr-count.err,.ldr-count.err sup{color:#ff3b5c}
        .ldr-track{position:absolute;left:0;right:0;bottom:0;height:2px;background:rgba(255,255,255,.08)}
        .ldr-fill{height:100%;transform-origin:left;background:linear-gradient(90deg,#00f5ff,#9b59ff)}
        .ldr-fill.err{background:#ff3b5c}

        /* crash */
        .ldr-console{position:absolute;left:50%;top:70%;transform:translateX(-50%);width:min(620px,90vw);
          font-family:'Space Mono',monospace;font-size:clamp(.66rem,1.1vw,.8rem);line-height:1.7;text-align:left}
        .ldr-console p{margin:0;white-space:pre-wrap}
        .ldr-console .err{color:#ff3b5c;transition:opacity .4s,color .4s}
        .ldr-console .err.fixed{color:#555;text-decoration:line-through;opacity:.6}
        .ldr-console .cmd{color:#ededed;margin-top:.6em}
        .ldr-console .ok{color:#3ddc97;animation:ldr-in .3s .45s both}
        .ldr-type{overflow:hidden;white-space:nowrap!important;width:0;animation:ldr-typing .45s steps(48) forwards}
        .ldr.glitch .ldr-name{animation:ldr-glitch .32s steps(1) infinite;text-shadow:.04em 0 #ff2d78,-.04em 0 #00f5ff}
        .ldr.glitch .ldr-corner,.ldr.glitch .ldr-log{animation:ldr-jitter .18s steps(1) infinite}
        .ldr.glitch::after{content:'';position:absolute;inset:0;background:#ff1744;mix-blend-mode:overlay;animation:ldr-flash .5s ease-out both;pointer-events:none}
        .ldr-bars i{position:absolute;left:0;right:0;height:var(--h);top:var(--t);background:rgba(0,245,255,.12);animation:ldr-bar .2s steps(1) infinite}
        .ldr-bars i:nth-child(1){--t:22%;--h:6px}
        .ldr-bars i:nth-child(2){--t:47%;--h:18px;background:rgba(255,45,120,.14);animation-delay:.05s}
        .ldr-bars i:nth-child(3){--t:63%;--h:3px;animation-delay:.1s}
        .ldr-bars i:nth-child(4){--t:81%;--h:10px;background:rgba(255,45,120,.1);animation-delay:.15s}
        @keyframes ldr-glitch{
          0%{transform:translate(-50%,-50%);clip-path:inset(0 0 0 0)}
          20%{transform:translate(calc(-50% - 8px),-50%) skewX(-6deg);clip-path:inset(12% 0 58% 0)}
          40%{transform:translate(calc(-50% + 10px),calc(-50% + 3px));clip-path:inset(55% 0 8% 0)}
          60%{transform:translate(calc(-50% - 4px),calc(-50% - 4px)) skewX(4deg);clip-path:inset(0 0 0 0)}
          80%{transform:translate(calc(-50% + 6px),-50%);clip-path:inset(30% 0 30% 0)}
        }
        @keyframes ldr-jitter{0%{transform:translate(0)}33%{transform:translate(-3px,1px)}66%{transform:translate(2px,-2px)}}
        @keyframes ldr-flash{0%{opacity:.55}100%{opacity:0}}
        @keyframes ldr-bar{0%{transform:translateX(0)}50%{transform:translateX(-4%)}}
        @keyframes ldr-typing{to{width:100%}}
        @keyframes ldr-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        @media (max-width:640px){
          .ldr-corner.br,.ldr-log{display:none}
          .ldr-name{top:40%}
          .ldr-console{top:62%}
        }
      `}</style>
    </motion.div>
  );
};

export default Loader;
