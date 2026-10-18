import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { NAV_ITEMS } from '../data/portfolioData';
import { personalInfo } from '../data';
import { useActiveSection, useNavScroll, useScrollTo } from '../hooks';

const EASE = [0.22, 1, 0.36, 1] as const;
const LINKS = NAV_ITEMS.filter(n => n.href !== 'hero');
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz_/<>';
const LOGO = 'abrar';

const istTime = () =>
  new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });

// scrambles to random glyphs, then resolves left to right
function useScramble(text: string) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const run = () => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const step = (now: number) => {
      const done = Math.floor(((now - t0) / 380) * text.length);
      setOut(text.split('').map((c, i) => (i < done ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''));
      if (done < text.length) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { out, run };
}

const Navbar: React.FC = () => {
  const scrolled = useNavScroll(60);
  const activeId = useActiveSection(NAV_ITEMS.map(n => n.href));
  const scrollTo = useScrollTo();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(istTime);
  const logo = useScramble(LOGO);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const id = setInterval(() => setTime(istTime()), 15_000);
    return () => clearInterval(id);
  }, []);

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = (href: string) => { setOpen(false); scrollTo(href); };

  return (
    <>
      <motion.header
        className={`nv${scrolled ? ' pill' : ''}`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      >
        <div className="nv-bar">
          <button className="nv-logo" onMouseEnter={logo.run} onClick={() => go('hero')} aria-label="Back to top">
            {logo.out}<span>.</span>
          </button>

          <nav className="nv-links" aria-label="Sections">
            {LINKS.map((l, i) => (
              <button key={l.href} onClick={() => go(l.href)} className={activeId === l.href ? 'on' : ''}>
                {activeId === l.href && (
                  <motion.span layoutId="nv-active" className="nv-active" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <sup>{String(i + 2).padStart(2, '0')}</sup>
                <span>{l.label}</span>
              </button>
            ))}
          </nav>

          <div className="nv-right">
            <span className="nv-time"><i /> CHN {time}</span>
            <button className="nv-cta" onClick={() => go('contact')}>
              Let’s talk <ArrowUpRight size={15} />
            </button>
            <button className={`nv-burger${open ? ' x' : ''}`} onClick={() => setOpen(o => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
              <span /><span />
            </button>
          </div>

          <motion.span className="nv-progress" style={{ scaleX: progress }} aria-hidden />
        </div>
      </motion.header>

      {/* full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="nv-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ul>
              {NAV_ITEMS.map((l, i) => (
                <li key={l.href}>
                  <motion.button
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.05 }}
                    onClick={() => go(l.href)}
                    className={activeId === l.href ? 'on' : ''}
                  >
                    <sup>{String(i + 1).padStart(2, '0')}</sup>{l.label}
                  </motion.button>
                </li>
              ))}
            </ul>
            <motion.div className="nv-menu-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
              <div>
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nv{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;justify-content:center;padding:0;pointer-events:none;
          transition:padding .5s cubic-bezier(.22,1,.36,1)}
        .nv-bar{position:relative;pointer-events:auto;width:100%;max-width:100%;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;
          padding:1.25rem 2.2%;border:1px solid transparent;border-radius:0;overflow:hidden;
          transition:max-width .6s cubic-bezier(.22,1,.36,1),padding .6s cubic-bezier(.22,1,.36,1),background .4s,border-color .4s,border-radius .6s}
        .nv.pill{padding-top:14px}
        .nv.pill .nv-bar{max-width:min(980px,94vw);padding:.55rem .6rem .55rem 1.3rem;border-radius:999px;
          background:rgba(16,16,19,.72);backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);
          border-color:rgba(255,255,255,.1);box-shadow:0 18px 50px rgba(0,0,0,.45)}

        .nv-logo{background:none;border:0;padding:0;cursor:pointer;color:#ededed;font-family:'Space Grotesk',sans-serif;font-weight:600;
          font-size:1.35rem;letter-spacing:-.04em;min-width:4.4ch;text-align:left}
        .nv-logo span{color:var(--cyan)}

        .nv-links{display:flex;gap:.2rem}
        .nv-links button{position:relative;display:flex;align-items:flex-start;gap:.2rem;padding:.5rem .85rem;border:0;border-radius:999px;background:none;
          cursor:pointer;color:#a1a6ae;font-family:'Space Grotesk',sans-serif;font-size:.92rem;transition:color .25s}
        .nv-links button:hover,.nv-links button.on{color:#ededed}
        .nv-links sup{position:relative;z-index:1;font-family:'Space Mono',monospace;font-size:.55rem;opacity:.6;margin-top:.15rem}
        .nv-links button > span:not(.nv-active){position:relative;z-index:1}
        .nv-active{position:absolute;inset:0;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08)}

        .nv-right{display:flex;align-items:center;gap:1rem}
        .nv-time{display:flex;align-items:center;gap:.45rem;font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.06em;color:#a1a6ae;white-space:nowrap}
        .nv-time i{width:6px;height:6px;border-radius:50%;background:#3ddc97;box-shadow:0 0 8px #3ddc97}
        .nv-cta{display:inline-flex;align-items:center;gap:.35rem;padding:.6rem 1.1rem;border-radius:999px;border:0;cursor:pointer;
          background:#ededed;color:#0b0b0c;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:.9rem;white-space:nowrap;
          transition:background .25s,transform .25s}
        .nv-cta:hover{background:var(--cyan);transform:translateY(-1px)}
        .nv-cta svg{transition:transform .3s}
        .nv-cta:hover svg{transform:rotate(45deg)}
        .nv-progress{position:absolute;left:0;right:0;bottom:0;height:1.5px;transform-origin:left;background:linear-gradient(90deg,var(--cyan),var(--purple));
          opacity:0;transition:opacity .4s}
        .nv.pill .nv-progress{opacity:1}

        .nv-burger{display:none;width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:none;cursor:pointer;
          flex-direction:column;justify-content:center;align-items:center;gap:6px}
        .nv-burger span{display:block;width:16px;height:1.5px;background:#ededed;transition:transform .35s cubic-bezier(.22,1,.36,1)}
        .nv-burger.x span:first-child{transform:translateY(3.75px) rotate(45deg)}
        .nv-burger.x span:last-child{transform:translateY(-3.75px) rotate(-45deg)}

        .nv-menu{position:fixed;inset:0;z-index:999;background:#0b0b0c;display:flex;flex-direction:column;justify-content:space-between;
          padding:6.5rem 1.4rem 2rem}
        .nv-menu ul{list-style:none;margin:0;padding:0}
        .nv-menu li{overflow:hidden;border-bottom:1px solid rgba(255,255,255,.1)}
        .nv-menu li button{display:flex;align-items:flex-start;gap:.5rem;width:100%;padding:.55rem 0;background:none;border:0;cursor:pointer;text-align:left;
          color:#ededed;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(2.4rem,11vw,3.6rem);letter-spacing:-.04em;line-height:1.05}
        .nv-menu li button.on{color:var(--cyan)}
        .nv-menu sup{font-family:'Space Mono',monospace;font-size:.75rem;letter-spacing:0;opacity:.5;margin-top:.6rem}
        .nv-menu-foot{display:flex;flex-direction:column;gap:.8rem;font-family:'Space Grotesk',sans-serif}
        .nv-menu-foot a{color:#a1a6ae;text-decoration:none}
        .nv-menu-foot div{display:flex;gap:1.4rem}

        @media (max-width:1060px){ .nv-time{display:none} }
        @media (max-width:860px){
          .nv-links,.nv-cta{display:none}
          .nv-burger{display:flex}
          .nv.pill .nv-bar{padding:.45rem .45rem .45rem 1.2rem}
        }
      `}</style>
    </>
  );
};

export default Navbar;
