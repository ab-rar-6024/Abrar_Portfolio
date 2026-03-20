import React from 'react';
import { motion } from 'framer-motion';
import { useScrollTo } from '../hooks';
import { NAV_ITEMS, CONTACT_INFO } from '../data/portfolioData';

const Footer: React.FC = () => {
  const scrollTo = useScrollTo();
  return (
    <footer style={{background:'var(--dark)',borderTop:'1px solid var(--border)',padding:'3rem 6% 2rem',position:'relative',zIndex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'2rem',maxWidth:1200,margin:'0 auto',paddingBottom:'2rem',borderBottom:'1px solid var(--border)',marginBottom:'1.5rem'}}>
        <div>
          <div style={{fontFamily:'var(--font-title)',fontSize:'1.4rem',fontWeight:900,letterSpacing:'3px',background:'linear-gradient(135deg,#00f5ff,#9b59ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:'.5rem'} as React.CSSProperties}>MOHAMED ABRAR S A</div>
          <p style={{fontFamily:'var(--font-mono)',fontSize:'.72rem',color:'var(--muted)',letterSpacing:'2px'}}>// AI &amp; DATA SCIENCE ENGINEER</p>
          <p style={{fontSize:'.9rem',color:'var(--muted2)',marginTop:'.6rem'}}>📍 Chennai, Tamil Nadu, India</p>
        </div>
        <div>
          <p style={{fontFamily:'var(--font-mono)',fontSize:'.7rem',color:'var(--cyan)',letterSpacing:'3px',marginBottom:'1rem',textTransform:'uppercase'}}>// navigate</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.5rem 2rem'}}>
            {NAV_ITEMS.map(item => (
              <button key={item.href} onClick={()=>scrollTo(item.href)} style={{background:'none',border:'none',cursor:'none',color:'var(--muted)',fontSize:'.9rem',fontFamily:'var(--font-body)',fontWeight:600,textAlign:'left',padding:'.1rem 0',transition:'color .2s'}} onMouseEnter={(e:React.MouseEvent<HTMLButtonElement>)=>(e.currentTarget.style.color='var(--cyan)')} onMouseLeave={(e:React.MouseEvent<HTMLButtonElement>)=>(e.currentTarget.style.color='var(--muted)')}>{item.label}</button>
            ))}
          </div>
        </div>
        <div>
          <p style={{fontFamily:'var(--font-mono)',fontSize:'.7rem',color:'var(--cyan)',letterSpacing:'3px',marginBottom:'1rem',textTransform:'uppercase'}}>// connect</p>
          {[{label:'GitHub',href:CONTACT_INFO.github,icon:'🐙'},{label:'LinkedIn',href:CONTACT_INFO.linkedin,icon:'💼'},{label:'Email',href:`mailto:${CONTACT_INFO.email}`,icon:'📧'}].map(link=>(
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:'.6rem',color:'var(--muted)',textDecoration:'none',fontSize:'.9rem',marginBottom:'.55rem',transition:'color .2s'}} onMouseEnter={(e:React.MouseEvent<HTMLAnchorElement>)=>(e.currentTarget.style.color='var(--cyan)')} onMouseLeave={(e:React.MouseEvent<HTMLAnchorElement>)=>(e.currentTarget.style.color='var(--muted)')}>
              <span>{link.icon}</span> {link.label}
            </a>
          ))}
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem',maxWidth:1200,margin:'0 auto',fontFamily:'var(--font-mono)',fontSize:'.7rem',color:'var(--muted)'}}>
        <span>© 2025 <span style={{color:'var(--cyan)'}}>Mohamed Abrar S A</span>. All rights reserved.</span>
        <span>Built with <span style={{color:'var(--pink)'}}>♥</span> using React &amp; TypeScript</span>
        <motion.button onClick={()=>scrollTo('hero')} whileHover={{y:-3,borderColor:'var(--cyan)'}} whileTap={{scale:.95}} style={{background:'var(--dark3)',border:'1px solid var(--border)',borderRadius:8,padding:'.5rem 1rem',color:'var(--muted)',fontFamily:'var(--font-mono)',fontSize:'.68rem',cursor:'none',transition:'color .25s,border-color .25s',letterSpacing:'1px'}} onMouseEnter={(e:React.MouseEvent<HTMLButtonElement>)=>(e.currentTarget.style.color='var(--cyan)')} onMouseLeave={(e:React.MouseEvent<HTMLButtonElement>)=>(e.currentTarget.style.color='var(--muted)')}>
          ↑ BACK TO TOP
        </motion.button>
      </div>
    </footer>
  );
};
export default Footer;
