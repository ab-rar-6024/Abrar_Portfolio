import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { EXPERIENCE } from '../data/portfolioData';

const Experience: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref,{once:true,margin:'-80px'});
  return (
    <section id="experience" style={{background:'var(--dark)',position:'relative',zIndex:1}}>
      <div className="section-wrap" ref={ref}>
        <motion.div className="section-header" initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.7}}>
          <span className="section-tag">// experience.log</span>
          <h2 className="section-title">Experience &amp; <span className="gradient-text">Education</span></h2>
          <div className="section-divider"/>
        </motion.div>
        <div style={{maxWidth:820,margin:'0 auto',position:'relative'}}>
          <motion.div initial={{scaleY:0}} animate={inView?{scaleY:1}:{}} transition={{duration:1.2,ease:[.16,1,.3,1]}} style={{position:'absolute',left:'50%',top:0,bottom:0,width:1,background:'linear-gradient(to bottom,transparent,var(--cyan) 20%,var(--purple) 80%,transparent)',transformOrigin:'top'}} className="tl-line"/>
          {EXPERIENCE.map((item,i) => (
            <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',marginBottom:'3.5rem',position:'relative'}} className="tl-item">
              <motion.div initial={{scale:0,opacity:0}} animate={inView?{scale:1,opacity:1}:{}} transition={{delay:.4,duration:.5}} style={{position:'absolute',left:'calc(50% - 9px)',top:'1.8rem',width:18,height:18,borderRadius:'50%',background:'linear-gradient(135deg,var(--cyan),var(--purple))',boxShadow:'var(--glow-cyan)',zIndex:2}}/>
              <motion.div animate={{scale:[1,1.8,1],opacity:[.6,0,.6]}} transition={{duration:2.5,repeat:Infinity}} style={{position:'absolute',left:'calc(50% - 9px)',top:'1.8rem',width:18,height:18,borderRadius:'50%',background:'rgba(0,245,255,.35)',zIndex:1}}/>
              <motion.div initial={{opacity:0,x:40}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.7,delay:.25}} style={{gridColumn:2}}>
                <div style={{background:'var(--dark3)',border:'1px solid var(--border)',borderRadius:14,padding:'1.6rem'}} onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='rgba(0,245,255,.35)';(e.currentTarget as HTMLDivElement).style.boxShadow='var(--glow-cyan)';}} onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='var(--border)';(e.currentTarget as HTMLDivElement).style.boxShadow='none';}}>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:'.72rem',color:'var(--cyan)',marginBottom:'.5rem',letterSpacing:'1px'}}>📅 {item.date}</div>
                  <div style={{fontFamily:'var(--font-title)',fontSize:'1.05rem',fontWeight:700,color:'var(--text)',marginBottom:'.25rem'}}>{item.role}</div>
                  <div style={{fontSize:'.95rem',color:'var(--purple)',fontWeight:600,marginBottom:'1.1rem'}}>🏢 {item.company}</div>
                  <ul style={{listStyle:'none',padding:0,display:'grid',gap:'.55rem'}}>
                    {item.points.map((pt,pi)=>(
                      <li key={pi} style={{display:'flex',alignItems:'flex-start',gap:'.6rem',fontSize:'.9rem',color:'var(--muted2)',lineHeight:1.55}}>
                        <span style={{color:'var(--cyan)',flexShrink:0,marginTop:'.05rem'}}>▸</span>{pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
        <motion.div initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.7,delay:.5}} style={{maxWidth:520,margin:'2rem auto 0',textAlign:'center'}}>
          <div style={{background:'var(--dark3)',border:'1px solid var(--border)',borderRadius:16,padding:'2.5rem 2rem',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 0%,rgba(0,245,255,.07) 0%,transparent 65%)',pointerEvents:'none'}}/>
            <div style={{fontSize:'2.8rem',marginBottom:'1rem'}}>🎓</div>
            <div style={{fontFamily:'var(--font-title)',fontSize:'1rem',fontWeight:700,color:'var(--cyan)',marginBottom:'.5rem',lineHeight:1.35}}>B.Tech — Artificial Intelligence &amp; Data Science</div>
            <div style={{fontSize:'1rem',color:'var(--text)',fontWeight:600,marginBottom:'.4rem'}}>B. S. Abdur Rahman Crescent Institute of Science &amp; Technology</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'.78rem',color:'var(--muted)',letterSpacing:'2px'}}>2023 – 2027  ·  Chennai, Tamil Nadu</div>
            <div style={{display:'inline-flex',alignItems:'center',gap:'.5rem',marginTop:'1.2rem',padding:'.4rem 1.2rem',borderRadius:20,background:'rgba(0,245,255,.08)',border:'1px solid rgba(0,245,255,.2)',fontFamily:'var(--font-mono)',fontSize:'.72rem',color:'var(--cyan)'}}>📍 Active Student</div>
          </div>
        </motion.div>
      </div>
      <style>{`@media(max-width:700px){.tl-item{grid-template-columns:1fr!important;padding-left:40px}.tl-item>div{grid-column:1!important}.tl-line{left:16px!important}}`}</style>
    </section>
  );
};
export default Experience;
