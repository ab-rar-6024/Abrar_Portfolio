import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CERTIFICATIONS } from '../data/portfolioData';

const STATS = [{num:'9+',label:'Projects Built'},{num:'7+',label:'Certifications'},{num:'1',label:'Internship'},{num:"'27",label:'Graduation'}];
const fadeUp = (delay=0) => ({ hidden:{opacity:0,y:35}, visible:{opacity:1,y:0,transition:{duration:.7,delay,ease:[.16,1,.3,1] as [number,number,number,number]}} });

const About: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref,{once:true,margin:'-80px'});
  return (
    <section id="about" style={{background:'var(--dark2)',position:'relative',zIndex:1}}>
      <div className="section-wrap" ref={ref}>
        <motion.div className="section-header" variants={fadeUp(0)} initial="hidden" animate={inView?'visible':'hidden'}>
          <span className="section-tag">// about.me</span>
          <h2 className="section-title">Who Am <span className="gradient-text">I?</span></h2>
          <div className="section-divider"/>
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)',gap:'4rem',alignItems:'start'}} className="about-grid">
          <motion.div variants={fadeUp(.15)} initial="hidden" animate={inView?'visible':'hidden'}>
            {[
              <React.Fragment key={0}>I'm <span style={{color:'var(--cyan)'}}>Mohamed Abrar S A</span>, a passionate AI and Data Science engineering student based in <span style={{color:'var(--cyan)'}}>Chennai, Tamil Nadu</span>. I thrive at the intersection of data, intelligence, and technology.</React.Fragment>,
              <React.Fragment key={1}>Currently in my second year of B.Tech at <span style={{color:'var(--purple)'}}>B. S. Abdur Rahman Crescent Institute of Science and Technology</span>, I've gained real-world experience through an IT internship at <span style={{color:'var(--cyan)'}}>DP World</span>.</React.Fragment>,
              <React.Fragment key={2}>I love building data-driven solutions — from <span style={{color:'var(--pink)'}}>interactive dashboards</span> to <span style={{color:'var(--purple)'}}>AI-powered systems</span> that solve real problems and create measurable impact.</React.Fragment>,
            ].map((text,i) => <p key={i} style={{fontSize:'1.05rem',lineHeight:1.8,color:'var(--muted2)',marginBottom:'1.2rem'}}>{text}</p>)}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginTop:'2rem'}}>
              {STATS.map((s,i) => (
                <motion.div key={i} initial={{opacity:0,scale:.9}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:.3+i*.1,duration:.5}} whileHover={{y:-4,borderColor:'rgba(0,245,255,.4)',boxShadow:'0 12px 40px rgba(0,0,0,.5)'}} style={{background:'var(--dark3)',border:'1px solid var(--border)',borderRadius:12,padding:'1.4rem',textAlign:'center',cursor:'default'}}>
                  <div style={{fontFamily:'var(--font-title)',fontSize:'2.2rem',fontWeight:900,background:'linear-gradient(135deg,#00f5ff,#9b59ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'} as React.CSSProperties}>{s.num}</div>
                  <div style={{fontSize:'.88rem',color:'var(--muted)',marginTop:'.3rem'}}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp(.3)} initial="hidden" animate={inView?'visible':'hidden'}>
            <p style={{fontFamily:'var(--font-mono)',fontSize:'.72rem',color:'var(--cyan)',letterSpacing:'3px',marginBottom:'1.5rem',textTransform:'uppercase'}}>// certifications</p>
            <div style={{display:'grid',gap:'.75rem'}}>
              {CERTIFICATIONS.map((cert,i) => (
                <motion.div key={i} initial={{opacity:0,x:30}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:.35+i*.07,duration:.5}} whileHover={{x:8,borderColor:'rgba(155,89,255,.5)'}} style={{display:'flex',alignItems:'center',gap:'1rem',background:'var(--dark3)',border:'1px solid var(--border)',borderRadius:12,padding:'.95rem 1.2rem',transition:'border-color .25s',cursor:'default'}}>
                  <span style={{fontSize:'1.4rem',flexShrink:0}}>{cert.icon}</span>
                  <div>
                    <div style={{fontSize:'.95rem',fontWeight:600,color:'var(--text)'}}>{cert.name}</div>
                    <div style={{fontSize:'.78rem',color:'var(--muted)',marginTop:'.15rem',fontFamily:'var(--font-mono)'}}>{cert.issuer}</div>
                  </div>
                  <div style={{marginLeft:'auto',color:'var(--cyan)',fontSize:'.9rem',flexShrink:0}}>✓</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.about-grid{grid-template-columns:1fr!important;gap:2.5rem!important}}`}</style>
    </section>
  );
};
export default About;
