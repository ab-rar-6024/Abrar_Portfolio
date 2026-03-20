import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTypingEffect, useScrollTo } from '../hooks';
import { HERO_ROLES } from '../data/portfolioData';

const CHIPS = ['Python 🐍','ML / AI','Power BI','SQL ⚡','Deep Learning','R / ggplot2'];

const Hero: React.FC = () => {
  const typed    = useTypingEffect(HERO_ROLES, 75, 38, 2400);
  const scrollTo = useScrollTo();
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!orbitRef.current) return;
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
      orbitRef.current.style.transform = `rotateX(${dy * 8}deg) rotateY(${dx * -8}deg)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section id="hero" style={{ minHeight:'100vh',display:'flex',alignItems:'center',padding:'0 6%',position:'relative',overflow:'hidden',zIndex:1 }}>
      <div style={{ position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(ellipse 70% 60% at 60% 50%, rgba(155,89,255,.07) 0%, transparent 70%)' }} />

      <div style={{ display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)',gap:'4rem',alignItems:'center',width:'100%',maxWidth:1200,margin:'0 auto' }} className="hero-grid">

        {/* TEXT */}
        <motion.div initial="hidden" animate="visible" variants={{ hidden:{}, visible:{ transition:{ staggerChildren:.18 }} }}>

          <motion.p
            variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:.7}} }}
            style={{ fontFamily:'var(--font-mono)',fontSize:'.78rem',color:'var(--cyan)',letterSpacing:'4px',textTransform:'uppercase',marginBottom:'1.2rem' }}
          >
            // initializing portfolio.exe
          </motion.p>

          <motion.h1
            variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:.7}} }}
            style={{ fontFamily:'var(--font-title)',fontSize:'clamp(2rem,4vw,3.6rem)',fontWeight:900,lineHeight:1.1,marginBottom:'.8rem' }}
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
            style={{ fontFamily:'var(--font-mono)',fontSize:'clamp(.9rem,1.6vw,1.15rem)',color:'var(--purple)',marginBottom:'1.5rem',minHeight:'1.6em',letterSpacing:'.5px' }}
          >
            ⚡ {typed}
            <span style={{ display:'inline-block',width:2,height:'1em',background:'var(--cyan)',marginLeft:3,verticalAlign:'middle',animation:'blink .7s step-end infinite' }} />
          </motion.div>

          <motion.p
            variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:.7}} }}
            style={{ fontSize:'1.05rem',lineHeight:1.75,color:'var(--muted2)',maxWidth:460,marginBottom:'2.5rem' }}
          >
            Aspiring Data Science Engineer passionate about building intelligent systems with{' '}
            <span style={{color:'var(--cyan)'}}>Machine Learning</span>,{' '}
            <span style={{color:'var(--purple)'}}>Deep Learning</span>, and{' '}
            <span style={{color:'var(--pink)'}}>Data Visualization</span>.
            Currently pursuing B.Tech in AI &amp; DS at BSACIST.
          </motion.p>

          <motion.div
            variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:.7}} }}
            style={{ display:'flex',gap:'1rem',flexWrap:'wrap' }}
          >
            <button className="btn btn-primary" onClick={() => scrollTo('projects')}>View Projects</button>
            <button className="btn btn-outline" onClick={() => scrollTo('contact')}>Hire Me ⚡</button>
          </motion.div>
        </motion.div>

        {/* VISUAL */}
        <motion.div
          initial={{ opacity:0, scale:.85 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:1, delay:.4 }}
          style={{ display:'flex',justifyContent:'center',alignItems:'center',perspective:800 }}
        >
          <div ref={orbitRef} style={{ width:380,height:380,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',transition:'transform .1s linear',transformStyle:'preserve-3d' }} className="orbit-container">
            {[
              { size:'100%', color:'rgba(0,245,255,.25)', dur:'14s', rev:false },
              { size:'78%',  color:'rgba(155,89,255,.35)', dur:'9s',  rev:true  },
              { size:'56%',  color:'rgba(255,45,120,.25)', dur:'6s',  rev:false },
            ].map((ring, i) => (
              <div key={i} style={{ position:'absolute',width:ring.size,height:ring.size,borderRadius:'50%',border:`1px solid ${ring.color}`,animation:`spinRing ${ring.dur} linear infinite${ring.rev?' reverse':''}` }}>
                <div style={{ position:'absolute',top:-5,left:'50%',transform:'translateX(-50%)',width:10,height:10,borderRadius:'50%',background:i===0?'var(--cyan)':i===1?'var(--purple)':'var(--pink)',boxShadow:i===0?'var(--glow-cyan)':i===1?'var(--glow-purple)':'0 0 12px var(--pink)' }} />
              </div>
            ))}

            <div style={{ position:'relative',zIndex:2,width:185,height:185,borderRadius:'50%',background:'linear-gradient(135deg,var(--dark3),var(--dark5))',border:'2px solid rgba(0,245,255,.45)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 60px rgba(0,245,255,.18),inset 0 0 40px rgba(155,89,255,.12)' }}>
              <span style={{ fontFamily:'var(--font-title)',fontSize:'3.8rem',fontWeight:900,background:'linear-gradient(135deg,#00f5ff,#9b59ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' } as React.CSSProperties}>MA</span>
            </div>

            {CHIPS.map((chip, i) => {
              const angles = [340,50,120,200,270,160];
              const radii  = [195,185,200,190,188,195];
              const angle  = (angles[i] * Math.PI) / 180;
              const r      = radii[i];
              return (
                <motion.div
                  key={chip}
                  animate={{ y:[0,-10,0] }}
                  transition={{ duration:2.8+i*.4, repeat:Infinity, ease:'easeInOut', delay:i*.35 }}
                  style={{ position:'absolute',left:`calc(50% + ${r*Math.cos(angle)}px)`,top:`calc(50% + ${r*Math.sin(angle)}px)`,transform:'translate(-50%,-50%)',background:'rgba(13,18,36,.9)',border:'1px solid rgba(0,245,255,.2)',borderRadius:8,padding:'.4rem .85rem',fontFamily:'var(--font-mono)',fontSize:'.7rem',color:i%3===0?'var(--cyan)':i%3===1?'var(--purple)':'var(--pink)',whiteSpace:'nowrap',backdropFilter:'blur(6px)',zIndex:3 }}
                >
                  {chip}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.2}} style={{ position:'absolute',bottom:'2.5rem',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'.4rem' }}>
        <motion.div animate={{y:[0,8,0]}} transition={{duration:1.6,repeat:Infinity}} style={{width:1,height:55,background:'linear-gradient(to bottom,var(--cyan),transparent)'}}/>
        <span style={{fontFamily:'var(--font-mono)',fontSize:'.62rem',color:'var(--muted)',letterSpacing:'3px'}}>SCROLL</span>
      </motion.div>

      <style>{`
        @keyframes spinRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes glitch1{0%,93%,100%{clip-path:inset(0 0 100% 0)}94%{clip-path:inset(25% 0 55% 0)}97%{clip-path:inset(70% 0 10% 0)}}
        @keyframes glitch2{0%,94%,100%{clip-path:inset(0 0 100% 0)}95%{clip-path:inset(45% 0 35% 0)}98%{clip-path:inset(10% 0 78% 0)}}
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important}.orbit-container{width:280px!important;height:280px!important}}
      `}</style>
    </section>
  );
};

export default Hero;
