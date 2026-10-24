import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useScrollTo } from '../hooks';
import { NAV_ITEMS } from '../data/portfolioData';
import { personalInfo, projects } from '../data';
import { currentPath, navigate } from '../router';

const EASE = [0.22, 1, 0.36, 1] as const;
const WORD = 'abrar';
const WHATSAPP = personalInfo.phone.replace(/\D/g, '');

const Footer: React.FC = () => {
  const scrollTo = useScrollTo();
  const live = projects.filter(p => p.freelance && p.liveUrl);
  const year = new Date().getFullYear();

  const connect = [
    { label: 'GitHub', href: personalInfo.github },
    { label: 'LinkedIn', href: personalInfo.linkedin },
    { label: 'Email', href: `mailto:${personalInfo.email}` },
    { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP}` },
  ];

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <footer className="ft">
      <div className="ft-wrap">
        <div className="ft-cols">
          <motion.div className="ft-about" {...reveal()}>
            <p className="ft-logo">abrar<span>.</span></p>
            <p className="ft-bio">
              AI &amp; Data Science engineer building computer-vision, NLP and web products — from Chennai, for anywhere.
            </p>
            <p className="ft-avail"><i /> Open to internships, freelance &amp; full-time roles</p>
          </motion.div>

          <motion.div {...reveal(0.05)}>
            <p className="ft-title">Navigate</p>
            <ul>
              {NAV_ITEMS.filter(n => n.href !== 'hero').map(n => (
                <li key={n.href}>
                  <button onClick={() => (n.page ? navigate(n.page) : currentPath() === '/' ? scrollTo(n.href) : navigate(`/#${n.href}`))}>
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...reveal(0.1)}>
            <p className="ft-title">Connect</p>
            <ul>
              {connect.map(c => (
                <li key={c.label}>
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                    {c.label} <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...reveal(0.15)}>
            <p className="ft-title">Live work</p>
            <ul>
              {live.map(p => (
                <li key={p.id}>
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">{p.title} <ArrowUpRight size={13} /></a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* giant wordmark */}
        <p className="ft-word" aria-label="abrar">
          {[...WORD.split(''), '.'].map((ch, i) => (
            <span key={i} className="ft-mask" aria-hidden>
              <motion.span
                className={ch === '.' ? 'dot' : ''}
                initial={{ y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 1, ease: EASE, delay: i * 0.06 }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </p>

        <div className="ft-bar">
          <span>© {year} {personalInfo.name}</span>
          <span className="ft-built">Designed &amp; built from scratch — React · TypeScript · Framer Motion</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .ft{position:relative;z-index:1;background:#0b0b0c;color:#ededed;border-top:1px solid rgba(255,255,255,.12);overflow:hidden;
          animation:ft-drift 54s ease-in-out infinite}
        .ft-wrap{max-width:1240px;margin:0 auto;padding:4.5rem 2.2% 1.6rem}
        .ft-cols{display:grid;grid-template-columns:1.6fr 1fr 1fr 1.2fr;gap:2.5rem}
        .ft-logo{margin:0 0 1rem;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:1.6rem;letter-spacing:-.04em}
        .ft-logo span,.ft-word .dot{color:var(--cyan)}
        .ft-bio{margin:0 0 1.2rem;max-width:340px;font-size:.95rem;line-height:1.65;color:#a1a6ae}
        .ft-avail{display:flex;align-items:center;gap:.55rem;margin:0;font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.04em;color:#ededed}
        .ft-avail i{width:7px;height:7px;border-radius:50%;background:#3ddc97;animation:ft-ping 2s infinite}
        .ft-title{margin:0 0 1.1rem;font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:#8a8f98}
        .ft ul{list-style:none;margin:0;padding:0;display:grid;gap:.7rem}
        .ft ul a,.ft ul button{display:inline-flex;align-items:center;gap:.3rem;padding:0;background:none;border:0;cursor:pointer;
          color:#d4d7dc;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:1rem;
          background-image:linear-gradient(currentColor,currentColor);background-size:0 1px;background-repeat:no-repeat;background-position:0 100%;
          transition:background-size .4s cubic-bezier(.22,1,.36,1),color .25s}
        .ft ul a:hover,.ft ul button:hover{color:#fff;background-size:100% 1px}

        .ft-word{display:flex;justify-content:center;margin:3.5rem 0 1rem;font-family:'Space Grotesk',sans-serif;font-weight:600;
          font-size:clamp(6rem,29vw,34rem);line-height:.78;letter-spacing:-.06em;user-select:none}
        .ft-mask{display:inline-block;overflow:hidden;padding-bottom:.04em}
        .ft-mask > span{display:inline-block;transition:transform .45s cubic-bezier(.22,1,.36,1),color .3s}
        .ft-mask:hover > span{transform:translateY(-8%)!important;color:var(--cyan)}

        .ft-bar{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;padding-top:1.2rem;
          border-top:1px solid rgba(255,255,255,.12);font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.04em;color:#8a8f98}
        .ft-bar button{display:inline-flex;align-items:center;gap:.35rem;padding:.5rem .9rem;border-radius:999px;border:1px solid rgba(255,255,255,.18);
          background:none;color:#ededed;cursor:pointer;font-family:inherit;font-size:inherit;transition:background .25s,color .25s}
        .ft-bar button:hover{background:#ededed;color:#0b0b0c}
        @keyframes ft-ping{0%{box-shadow:0 0 0 0 rgba(61,220,151,.6)}80%,100%{box-shadow:0 0 0 8px rgba(61,220,151,0)}}
        /* the background drifts through deep tints slowly enough that the change is never noticed as it happens */
        @keyframes ft-drift{
          0%,100%{background-color:#0b0b0c}
          25%{background-color:#0a1326}
          50%{background-color:#170c26}
          75%{background-color:#06191c}
        }

        @media (max-width:900px){ .ft-cols{grid-template-columns:1fr 1fr} .ft-about{grid-column:1 / -1} }
        @media (max-width:560px){
          .ft-wrap{padding:3.5rem 1.2rem 1.4rem}
          .ft-built{display:none}
        }
        @media (prefers-reduced-motion:reduce){.ft-avail i,.ft{animation:none}}
      `}</style>
    </footer>
  );
};

export default Footer;
