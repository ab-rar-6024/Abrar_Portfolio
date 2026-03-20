import React, { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { PROJECTS, type Project } from '../data/portfolioData';

const TAG_BG:Record<string,string>={cyan:'rgba(0,245,255,.12)',purple:'rgba(155,89,255,.12)',pink:'rgba(255,45,120,.12)'};
const TAG_BD:Record<string,string>={cyan:'rgba(0,245,255,.35)',purple:'rgba(155,89,255,.35)',pink:'rgba(255,45,120,.35)'};
const TAG_TX:Record<string,string>={cyan:'#00f5ff',purple:'#9b59ff',pink:'#ff2d78'};

const ProjectCard:React.FC<{project:Project;index:number;inView:boolean}>=({project,index,inView})=>{
  const cardRef=useRef<HTMLDivElement>(null);
  const [tilt,setTilt]=useState({rx:0,ry:0});
  const [glow,setGlow]=useState({x:50,y:50});
  const [hover,setHover]=useState(false);
  const onMouseMove=useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
    const card=cardRef.current; if(!card) return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
    setTilt({rx:(y-.5)*-10,ry:(x-.5)*10}); setGlow({x:x*100,y:y*100});
  },[]);
  const col=project.color;
  return (
    <motion.div
      initial={{opacity:0,y:50}}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:.65,delay:(index%3)*.12+Math.floor(index/3)*.18}}
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={()=>{setTilt({rx:0,ry:0});setHover(false);}}
      onMouseEnter={()=>setHover(true)}
      style={{
        background:'var(--dark3)',
        border:`1px solid ${hover?TAG_BD[col]:'var(--border)'}`,
        borderRadius:16,
        padding:'2rem',
        cursor:'default',
        transform:`perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${hover?'translateY(-8px)':'translateY(0)'}`,
        transitionProperty:'transform,border-color,box-shadow',
        transitionDuration:hover?'.05s,.3s,.3s':'.5s,.3s,.3s',
        boxShadow:hover?'0 25px 70px rgba(0,0,0,.7)':'none',
        position:'relative',
        overflow:'hidden',
        display:'flex',
        flexDirection:'column',
      }}
    >
      {/* Glow overlay */}
      <div style={{position:'absolute',inset:0,borderRadius:16,pointerEvents:'none',background:`radial-gradient(circle at ${glow.x}% ${glow.y}%,${TAG_BG[col]},transparent 60%)`,opacity:hover?1:0,transition:'opacity .3s'}}/>
      {/* Top accent line */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(to right,${TAG_TX[col]},transparent)`,borderRadius:'16px 16px 0 0',opacity:hover?1:0,transition:'opacity .3s'}}/>

      {/* Project number */}
      <div style={{fontFamily:'var(--font-mono)',fontSize:'.68rem',color:TAG_TX[col],letterSpacing:'3px',marginBottom:'1rem',opacity:.8}}>
        PROJECT // {String(project.id).padStart(3,'0')}
      </div>

      {/* Icon + Title */}
      <div style={{display:'flex',alignItems:'flex-start',gap:'1rem',marginBottom:'.9rem'}}>
        <div style={{width:46,height:46,borderRadius:10,flexShrink:0,background:TAG_BG[col],border:`1px solid ${TAG_BD[col]}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem'}}>
          {project.icon}
        </div>
        <h3 style={{fontFamily:'var(--font-title)',fontSize:'1rem',fontWeight:700,color:'var(--text)',lineHeight:1.3,marginTop:'.3rem'}}>
          {project.title}
        </h3>
      </div>

      {/* Description */}
      <p style={{fontSize:'.97rem',lineHeight:1.65,color:'var(--muted2)',marginBottom:'1.4rem',flex:1}}>
        {project.desc}
      </p>

      {/* Tags */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'.45rem',marginBottom:'1.4rem'}}>
        {project.tags.map(tag=>(
          <span key={tag} style={{padding:'.3rem .75rem',fontSize:'.72rem',fontFamily:'var(--font-mono)',borderRadius:5,background:TAG_BG[col],border:`1px solid ${TAG_BD[col]}`,color:TAG_TX[col]}}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: links + project number */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:'1rem',borderTop:'1px solid var(--border)'}}>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{display:'flex',alignItems:'center',gap:'.4rem',fontFamily:'var(--font-mono)',fontSize:'.8rem',color:TAG_TX[col],textDecoration:'none'}}
              whileHover={{x:4}}
              transition={{duration:.2}}
            >
              GitHub <span>→</span>
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{display:'flex',alignItems:'center',gap:'.4rem',fontFamily:'var(--font-mono)',fontSize:'.8rem',color:TAG_TX[col],textDecoration:'none',opacity:.8}}
              whileHover={{x:4}}
              transition={{duration:.2}}
            >
              Live <span>↗</span>
            </motion.a>
          )}
        </div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:'.68rem',color:'var(--muted)',letterSpacing:'1px'}}>
          #{project.id.toString().padStart(2,'0')}
        </div>
      </div>
    </motion.div>
  );
};

const Projects:React.FC=()=>{
  const ref=useRef<HTMLDivElement>(null);
  const inView=useInView(ref,{once:true,margin:'-60px'});
  return (
    <section id="projects" style={{background:'var(--dark2)',position:'relative',zIndex:1}}>
      <div className="section-wrap" ref={ref}>
        <motion.div className="section-header" initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.7}}>
          <span className="section-tag">// projects.log</span>
          <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
          <div className="section-divider"/>
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(330px,1fr))',gap:'1.8rem'}}>
          {PROJECTS.map((p,i)=><ProjectCard key={p.id} project={p} index={i} inView={inView}/>)}
        </div>
      </div>
    </section>
  );
};

export default Projects;