import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTypingEffect, useScrollTo } from '../hooks';
import { HERO_ROLES } from '../data/portfolioData';

// ─── POWERSHELL LINES ─────────────────────────────────────────────
interface PSLine {
  delay: number;
  kind: 'cmd' | 'output' | 'blank' | 'prop' | 'bar' | 'prompt' | 'header';
  ps?: string;       // PS path shown before >
  cmd?: string;      // command text
  text?: string;     // plain output
  key?: string;      // property key
  val?: string;      // property value
  valColor?: string;
  pct?: number;      // 0–100 for bar
  barColor?: string;
}

const LINES: PSLine[] = [
  { delay: 300,  kind: 'header' },
  { delay: 800,  kind: 'cmd',   ps: 'C:\\Users\\Abrar', cmd: 'Get-Profile -Full' },
  { delay: 1300, kind: 'blank' },
  { delay: 1500, kind: 'prop',  key: 'Name    ', val: 'Mohamed Abrar S A',        valColor: '#ce9178' },
  { delay: 2000, kind: 'prop',  key: 'Role    ', val: 'AI & Data Science Engineer', valColor: '#ce9178' },
  { delay: 2500, kind: 'prop',  key: 'College ', val: 'BSACIST — B.Tech AI & DS',  valColor: '#ce9178' },
  { delay: 3000, kind: 'prop',  key: 'Stack   ', val: 'Python · SQL · R · TensorFlow', valColor: '#9cdcfe' },
  { delay: 3500, kind: 'blank' },
  { delay: 3700, kind: 'cmd',   ps: 'C:\\Users\\Abrar', cmd: 'Get-Skills | Format-Bar' },
  { delay: 4200, kind: 'blank' },
  { delay: 4400, kind: 'bar',   key: 'Python    ', pct: 88, barColor: '#0078d4' },
  { delay: 4700, kind: 'bar',   key: 'ML / AI   ', pct: 82, barColor: '#9b59ff' },
  { delay: 5000, kind: 'bar',   key: 'SQL       ', pct: 78, barColor: '#00f5ff' },
  { delay: 5300, kind: 'bar',   key: 'Power BI  ', pct: 72, barColor: '#f2c811' },
  { delay: 5600, kind: 'blank' },
  { delay: 5800, kind: 'prop',  key: 'Status  ', val: '● OPEN_TO_WORK', valColor: '#39d353' },
  { delay: 6200, kind: 'blank' },
  { delay: 6400, kind: 'prompt', ps: 'C:\\Users\\Abrar' },
];

// ─── TYPEWRITER HOOK ──────────────────────────────────────────────
function useTypewriter(text: string, speed = 32, startDelay = 0) {
  const [out, setOut] = useState('');
  const [go, setGo]   = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), startDelay); return () => clearTimeout(t); }, [startDelay]);
  useEffect(() => {
    if (!go || out.length >= text.length) return;
    const t = setTimeout(() => setOut(text.slice(0, out.length + 1)), speed);
    return () => clearTimeout(t);
  }, [go, out, text, speed]);
  return { out, done: out.length >= text.length };
}

// ─── BAR component ────────────────────────────────────────────────
const ProgressBar: React.FC<{ pct: number; color: string }> = ({ pct, color }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(pct), 80); return () => clearTimeout(t); }, [pct]);
  const filled = Math.round((width / 100) * 20);
  const empty  = 20 - filled;
  return (
    <span style={{ fontFamily: "'Courier New', monospace", fontSize: '0.8rem' }}>
      <span style={{ color }}>{`[${'█'.repeat(filled)}${'░'.repeat(empty)}]`}</span>
      <span style={{ color: 'rgba(255,255,255,.45)', marginLeft: 6 }}>{width}%</span>
    </span>
  );
};

// ─── SINGLE LINE ──────────────────────────────────────────────────
const Line: React.FC<{ line: PSLine }> = ({ line }) => {
  const cmdTyped  = useTypewriter(line.cmd  ?? '', 30);
  const valTyped  = useTypewriter(line.val  ?? '', 25);
  const keyTyped  = useTypewriter(line.key  ?? '', 20);

  const cur = <span style={{ display:'inline-block', width:7, height:'0.85em', background:'#aeafad', verticalAlign:'middle', animation:'psCaret .7s step-end infinite' }}/>;

  if (line.kind === 'blank') return <div style={{ height: 6 }} />;

  if (line.kind === 'header') return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ color: '#0078d4', fontFamily: "'Courier New',monospace", fontSize: '0.8rem', fontWeight: 700 }}>
        Windows PowerShell
      </div>
      <div style={{ color: 'rgba(255,255,255,.28)', fontFamily: "'Courier New',monospace", fontSize: '0.7rem' }}>
        Copyright (C) Microsoft Corporation. All rights reserved.
      </div>
    </div>
  );

  if (line.kind === 'cmd') return (
    <div style={{ marginBottom: 3, fontFamily: "'Courier New',monospace", fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0 }}>
      <span style={{ color: '#61d6d6' }}>PS </span>
      <span style={{ color: '#c3e88d' }}>{line.ps}</span>
      <span style={{ color: '#fff' }}>&gt; </span>
      <span style={{ color: '#dcdcaa' }}>{cmdTyped.out}</span>
      {!cmdTyped.done && cur}
    </div>
  );

  if (line.kind === 'prop') return (
    <div style={{ fontFamily: "'Courier New',monospace", fontSize: '0.78rem', marginBottom: 3, display: 'flex' }}>
      <span style={{ color: '#9cdcfe', minWidth: 80 }}>{line.key}</span>
      <span style={{ color: 'rgba(255,255,255,.35)', margin: '0 6px' }}>:</span>
      <span style={{ color: line.valColor ?? '#ce9178' }}>
        {valTyped.out}
        {!valTyped.done && cur}
      </span>
    </div>
  );

  if (line.kind === 'bar') return (
    <div style={{ fontFamily: "'Courier New',monospace", fontSize: '0.78rem', marginBottom: 3, display: 'flex', alignItems: 'center' }}>
      <span style={{ color: '#9cdcfe', minWidth: 90 }}>{line.key}</span>
      <ProgressBar pct={line.pct!} color={line.barColor!} />
    </div>
  );

  if (line.kind === 'prompt') return (
    <div style={{ fontFamily: "'Courier New',monospace", fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
      <span style={{ color: '#61d6d6' }}>PS </span>
      <span style={{ color: '#c3e88d' }}>{line.ps}</span>
      <span style={{ color: '#fff' }}>&gt; </span>
      {cur}
    </div>
  );

  return null;
};

// ─── POWERSHELL WINDOW ────────────────────────────────────────────
const PowerShell: React.FC = () => {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    LINES.forEach((line, i) => {
      const t = setTimeout(() => setVisible(i + 1), line.delay);
      return () => clearTimeout(t);
    });
  }, []);

  return (
    <div style={{
      width: '100%', maxWidth: 460,
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,.1)',
      boxShadow: '0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(0,120,212,.2)',
    }}>

      {/* ── Title bar ── */}
      <div style={{
        background: '#1e1e2e',
        padding: '9px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        userSelect: 'none',
      }}>
        {/* Left: icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 16, height: 16,
            background: 'linear-gradient(135deg,#0078d4,#00b4d8)',
            borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>PS</span>
          </div>
          <span style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,.6)' }}>
            Windows PowerShell
          </span>
        </div>

        {/* Tab bar style indicator */}
        <div style={{
          background: '#0078d4',
          borderRadius: '3px 3px 0 0',
          padding: '3px 14px',
          fontFamily: 'Segoe UI, sans-serif',
          fontSize: '0.68rem',
          color: '#fff',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 4,
        }}>
          abrar — pwsh
        </div>

        {/* Window controls */}
        <div style={{ display: 'flex', gap: 1 }}>
          {['—', '□', '✕'].map((s, i) => (
            <div key={i} style={{
              width: 28, height: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: i === 2 ? 11 : 12,
              color: 'rgba(255,255,255,.5)',
              borderRadius: 3,
              cursor: 'default',
              background: i === 2 ? 'transparent' : 'transparent',
              fontFamily: 'Segoe UI, sans-serif',
            }}>{s}</div>
          ))}
        </div>
      </div>

      {/* ── Terminal body ── */}
      <div style={{
        background: '#012456',   // classic PowerShell dark blue
        padding: '16px 18px 18px',
        minHeight: 280,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle scanline overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.04) 2px, rgba(0,0,0,.04) 4px)',
          zIndex: 0,
        }}/>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {LINES.slice(0, visible).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <Line line={line} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{
        background: '#0078d4',
        padding: '4px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'Segoe UI, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,.85)', letterSpacing: 1 }}>
          pwsh 7.4.0
        </span>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Python','UTF-8','CRLF'].map((t, i) => (
            <span key={i} style={{ fontFamily: 'Segoe UI, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,.7)' }}>{t}</span>
          ))}
        </div>
        <span style={{ fontFamily: 'Segoe UI, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,.7)' }}>
          Ln 18, Col 1
        </span>
      </div>
    </div>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────
const Hero: React.FC = () => {
  const typed    = useTypingEffect(HERO_ROLES, 75, 38, 2400);
  const scrollTo = useScrollTo();

  return (
    <section id="hero" style={{ minHeight:'100vh', display:'flex', alignItems:'center', padding:'0 6%', position:'relative', overflow:'hidden', zIndex:1 }}>

      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 70% 60% at 60% 50%, rgba(0,120,212,.06) 0%, transparent 70%)' }} />

      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:'4rem', alignItems:'center', width:'100%', maxWidth:1200, margin:'0 auto' }} className="hero-grid">

        {/* ── TEXT ── */}
        <motion.div initial="hidden" animate="visible" variants={{ hidden:{}, visible:{ transition:{ staggerChildren:.18 }}}}>

          <motion.p
            variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:.7}} }}
            style={{ fontFamily:'var(--font-mono)', fontSize:'.78rem', color:'var(--cyan)', letterSpacing:'4px', textTransform:'uppercase', marginBottom:'1.2rem' }}
          >
            // initializing portfolio.exe
          </motion.p>

          <motion.h1
            variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:.7}} }}
            style={{ fontFamily:'var(--font-title)', fontSize:'clamp(2rem,4vw,3.6rem)', fontWeight:900, lineHeight:1.1, marginBottom:'.8rem' }}
          >
            Mohamed<br />
            <span className="gradient-text" style={{ position:'relative' }}>
              Abrar S A
              <span aria-hidden style={{ position:'absolute',top:0,left:2,background:'linear-gradient(135deg,#00f5ff,#9b59ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'glitch1 4s infinite' } as React.CSSProperties}>Abrar S A</span>
              <span aria-hidden style={{ position:'absolute',top:0,left:-2,background:'linear-gradient(135deg,#00f5ff,#9b59ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'glitch2 4s infinite' } as React.CSSProperties}>Abrar S A</span>
            </span>
          </motion.h1>

          <motion.div
            variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:.7}} }}
            style={{ fontFamily:'var(--font-mono)', fontSize:'clamp(.9rem,1.6vw,1.15rem)', color:'var(--purple)', marginBottom:'1.5rem', minHeight:'1.6em', letterSpacing:'.5px' }}
          >
            ⚡ {typed}
            <span style={{ display:'inline-block', width:2, height:'1em', background:'var(--cyan)', marginLeft:3, verticalAlign:'middle', animation:'blink .7s step-end infinite' }} />
          </motion.div>

          <motion.p
            variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:.7}} }}
            style={{ fontSize:'1.05rem', lineHeight:1.75, color:'var(--muted2)', maxWidth:460, marginBottom:'2.5rem' }}
          >
            Aspiring Data Science Engineer passionate about building intelligent systems with{' '}
            <span style={{color:'var(--cyan)'}}>Machine Learning</span>,{' '}
            <span style={{color:'var(--purple)'}}>Deep Learning</span>, and{' '}
            <span style={{color:'var(--pink)'}}>Data Visualization</span>.
            Currently pursuing B.Tech in AI &amp; DS at BSACIST.
          </motion.p>

          <motion.div
            variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:.7}} }}
            style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}
          >
            <button className="btn btn-primary" onClick={() => scrollTo('projects')}>View Projects</button>
            <button className="btn btn-outline" onClick={() => scrollTo('contact')}>Hire Me ⚡</button>
          </motion.div>
        </motion.div>

        {/* ── POWERSHELL VISUAL ── */}
        <motion.div
          initial={{ opacity:0, y:32 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.9, delay:.5, ease:[.16,1,.3,1] }}
          style={{ display:'flex', justifyContent:'center', alignItems:'center' }}
        >
          <PowerShell />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}}
        style={{ position:'absolute', bottom:'2.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'.4rem' }}
      >
        <motion.div animate={{y:[0,8,0]}} transition={{duration:1.6,repeat:Infinity}}
          style={{width:1,height:55,background:'linear-gradient(to bottom,var(--cyan),transparent)'}}/>
        <span style={{fontFamily:'var(--font-mono)',fontSize:'.62rem',color:'var(--muted)',letterSpacing:'3px'}}>SCROLL</span>
      </motion.div>

      <style>{`
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes psCaret  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes glitch1  { 0%,93%,100%{clip-path:inset(0 0 100% 0)} 94%{clip-path:inset(25% 0 55% 0)} 97%{clip-path:inset(70% 0 10% 0)} }
        @keyframes glitch2  { 0%,94%,100%{clip-path:inset(0 0 100% 0)} 95%{clip-path:inset(45% 0 35% 0)} 98%{clip-path:inset(10% 0 78% 0)} }
        @media(max-width:900px){ .hero-grid{grid-template-columns:1fr!important} }
      `}</style>
    </section>
  );
};

export default Hero;