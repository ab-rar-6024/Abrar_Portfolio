import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SKILL_GROUPS } from '../data/portfolioData';

const Skills: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref,{once:true,margin:'-80px'});
  return (
    <section id="skills" style={{background:'var(--dark)',position:'relative',zIndex:1}}>
      <div className="section-wrap" ref={ref}>
        <motion.div className="section-header" initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.7}}>
          <span className="section-tag">// tech.stack</span>
          <h2 className="section-title">Skills &amp; <span className="gradient-text">Expertise</span></h2>
          <div className="section-divider"/>
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.8rem'}}>
          {SKILL_GROUPS.map((group,gi) => (
            <motion.div key={gi} initial={{opacity:0,y:40}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.65,delay:gi*.15}} className="card-base glow-line-top" style={{padding:'2rem',position:'relative',overflow:'hidden'}} whileHover={{y:-6,boxShadow:'0 25px 70px rgba(0,0,0,.65)'}}>
              <div style={{position:'absolute',top:0,right:0,width:60,height:60,background:'linear-gradient(225deg,rgba(0,245,255,.08) 0%,transparent 60%)',borderRadius:'0 16px 0 0'}}/>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'.78rem',fontWeight:700,color:'var(--cyan)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'1.8rem'}}>// {group.title}</div>
              {group.skills.map((skill,si) => (
                <div key={si} style={{marginBottom:'1.3rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.5rem'}}>
                    <span style={{fontSize:'1rem',fontWeight:600,color:'var(--text)'}}>{skill.name}</span>
                    <span style={{fontFamily:'var(--font-mono)',fontSize:'.76rem',color:'var(--cyan)',letterSpacing:'1px'}}>{skill.pct}%</span>
                  </div>
                  <div style={{height:4,background:'rgba(255,255,255,.05)',borderRadius:2,overflow:'hidden'}}>
                    <motion.div initial={{width:0}} animate={inView?{width:`${skill.pct}%`}:{}} transition={{duration:1.4,delay:gi*.15+si*.1+.3,ease:[.34,1.56,.64,1]}} style={{height:'100%',borderRadius:2,background:'linear-gradient(to right,var(--cyan),var(--purple))',boxShadow:'0 0 10px rgba(0,245,255,.55)',position:'relative'}}>
                      <motion.div animate={{x:['-100%','200%']}} transition={{duration:1.8,delay:gi*.15+si*.1+1.2,ease:'easeInOut'}} style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)',borderRadius:2}}/>
                    </motion.div>
                  </div>
                </div>
              ))}
              {group.tags && (
                <div style={{marginTop:'1.5rem'}}>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:'.7rem',color:'var(--muted)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'.9rem'}}>// Soft Skills</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'.55rem'}}>
                    {group.tags.map((tag,ti) => (
                      <motion.span key={ti} initial={{opacity:0,scale:.85}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:.6+ti*.07}} whileHover={{borderColor:'var(--cyan)',color:'var(--cyan)',background:'rgba(0,245,255,.06)'}} style={{padding:'.38rem .85rem',fontSize:'.75rem',fontFamily:'var(--font-mono)',borderRadius:20,border:'1px solid var(--border)',color:'var(--muted2)',transition:'all .25s',cursor:'default'}}>{tag}</motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Skills;
