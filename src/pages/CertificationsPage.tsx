import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { certifications, type CertCategory, type Certification } from '../data';
import { CAT_COLOR } from '../data/certColors';
import { Link } from '../router';

const EASE = [0.22, 1, 0.36, 1] as const;
const AREAS = Object.keys(CAT_COLOR) as CertCategory[];
const thumb = (src: string) => src.replace(/\.jpg$/, '-thumb.jpg');

// full-size viewer: arrows or ← → keys to flip, Esc or the backdrop to close
const Viewer: React.FC<{ list: Certification[]; index: number; onMove: (i: number) => void; onClose: () => void }> = ({ list, index, onMove, onClose }) => {
  const c = list[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove((index + 1) % list.length);
      if (e.key === 'ArrowLeft') onMove((index - 1 + list.length) % list.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [index, list.length, onMove, onClose]);

  return (
    <motion.div
      className="cg-view"
      role="dialog"
      aria-modal="true"
      aria-label={`${c.name} certificate`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="cg-view-bar" onClick={e => e.stopPropagation()}>
        <span className="cg-view-count">{String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
        <button className="cg-round" onClick={onClose} aria-label="Close"><X size={20} /></button>
      </div>

      <div className="cg-view-stage" onClick={e => e.stopPropagation()}>
        <button className="cg-round cg-arrow" onClick={() => onMove((index - 1 + list.length) % list.length)} aria-label="Previous certificate">
          <ChevronLeft size={22} />
        </button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={c.name}
            src={c.image}
            alt={`${c.name} — certificate from ${c.issuer}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
          />
        </AnimatePresence>
        <button className="cg-round cg-arrow" onClick={() => onMove((index + 1) % list.length)} aria-label="Next certificate">
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="cg-view-info" onClick={e => e.stopPropagation()}>
        <div>
          <p className="cg-view-name">{c.name}</p>
          <p className="cg-view-sub">{c.issuer}{c.via ? ` · via ${c.via}` : ''} · {c.date}</p>
        </div>
        {c.url && (
          <a className="cg-verify" href={c.url} target="_blank" rel="noopener noreferrer">Verify with issuer <ArrowUpRight size={15} /></a>
        )}
      </div>
    </motion.div>
  );
};

const CertificationsPage: React.FC = () => {
  const [area, setArea] = useState<'All' | CertCategory>('All');
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const list = useMemo(() => (area === 'All' ? certifications : certifications.filter(c => c.category === area)), [area]);
  const countFor = (a: 'All' | CertCategory) => (a === 'All' ? certifications.length : certifications.filter(c => c.category === a).length);
  const verifiable = certifications.filter(c => c.url).length;
  const issuers = new Set(certifications.map(c => c.issuer)).size;

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <main className="cg">
      <div className="cg-wrap">
        <motion.div className="cg-crumb" {...reveal()}>
          <Link to="/"><ArrowLeft size={14} /> Back home</Link>
          <span>{certifications.length} certificates · {issuers} issuers</span>
        </motion.div>

        <h1 className="cg-title">
          <span className="cg-mask">
            <motion.span initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease: EASE }}>Certificates,</motion.span>
          </span>
          <span className="cg-mask">
            <motion.span initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}>
              <em>the real ones.</em>
            </motion.span>
          </span>
        </h1>

        <div className="cg-intro">
          <motion.p {...reveal(0.2)}>
            Every certificate I’ve earned alongside the degree — the actual documents, not a list. Click any one to see it full size;
            {' '}{verifiable} of them can be checked directly with the issuer.
          </motion.p>
          <motion.dl className="cg-stats" {...reveal(0.25)}>
            <div><dt>Certificates</dt><dd>{certifications.length}</dd></div>
            <div><dt>Issuers</dt><dd>{issuers}</dd></div>
            <div><dt>Verify online</dt><dd>{String(verifiable).padStart(2, '0')}</dd></div>
          </motion.dl>
        </div>

        <motion.div className="cg-filters" role="tablist" aria-label="Filter by area" {...reveal(0.3)}>
          {(['All', ...AREAS] as const).map(a => (
            <button
              key={a}
              role="tab"
              aria-selected={area === a}
              className={area === a ? 'on' : ''}
              onClick={() => setArea(a)}
              style={a === 'All' ? undefined : { ['--c' as string]: CAT_COLOR[a] }}
            >
              {a !== 'All' && <i />}{a} <sup>{countFor(a)}</sup>
            </button>
          ))}
        </motion.div>

        <motion.ul className="cg-grid" layout>
          <AnimatePresence mode="popLayout">
            {list.map((c, i) => (
              <motion.li
                key={c.name}
                layout
                className="cg-card"
                style={{ ['--c' as string]: CAT_COLOR[c.category] }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 8) * 0.03 }}
              >
                <button className="cg-shot" onClick={() => setOpen(i)} aria-label={`View the ${c.name} certificate`}>
                  {c.image && <img src={thumb(c.image)} alt="" loading="lazy" />}
                  <span className="cg-zoom"><Expand size={16} /> View</span>
                </button>
                <div className="cg-meta">
                  <span className="cg-cat"><i />{c.category}</span>
                  <span>{c.date}</span>
                </div>
                <h2>{c.name}</h2>
                <p>{c.issuer}{c.via ? ` · via ${c.via}` : ''}</p>
                {c.url && (
                  <a className="cg-link" href={c.url} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${c.name} with the issuer`}>
                    Verify <ArrowUpRight size={13} />
                  </a>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <motion.div className="cg-next" {...reveal()}>
          <Link to="/skills" className="cg-next-card">
            <span className="cg-next-label">What they back up</span>
            <span className="cg-next-title">Skills <ArrowRight size={28} /></span>
          </Link>
          <Link to="/#contact" className="cg-next-card">
            <span className="cg-next-label">Let’s build something</span>
            <span className="cg-next-title">Contact <ArrowRight size={28} /></span>
          </Link>
        </motion.div>
      </div>

      {/* rendered on <body> so it sits above the fixed navbar instead of inside this page's stacking context */}
      {createPortal(
        <AnimatePresence>
          {open !== null && list[open] && (
            <Viewer list={list} index={open} onMove={setOpen} onClose={close} />
          )}
        </AnimatePresence>,
        document.body,
      )}

      <style>{`
        .cg{position:relative;z-index:1;min-height:100vh;background:#0b0b0c;color:#ededed;padding:8.5rem 0 6rem}
        .cg-wrap{max-width:1240px;margin:0 auto;padding:0 2.2%}
        .cg-crumb{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding-bottom:.8rem;border-bottom:1.5px solid #ededed;
          font-family:'Space Mono',monospace;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#a1a6ae}
        .cg-crumb a{display:inline-flex;align-items:center;gap:.4rem;min-height:44px;color:#ededed;text-decoration:none}
        .cg-crumb a:hover{color:var(--cyan)}

        .cg-title{margin:2.6rem 0 0;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(3.2rem,9.5vw,9rem);
          line-height:.92;letter-spacing:-.055em}
        .cg-mask{display:block;overflow:hidden;padding-bottom:.08em}
        .cg-mask > span{display:block}
        .cg-title em{font-style:italic;font-weight:400;color:#b48cff}
        .cg-intro{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:3rem;align-items:end;margin-top:2rem}
        .cg-intro p{margin:0;max-width:620px;font-size:1.12rem;line-height:1.6;color:#a1a6ae}
        .cg-stats{display:flex;justify-content:flex-end;gap:2.4rem;margin:0}
        .cg-stats div{display:flex;flex-direction:column-reverse;gap:.3rem}
        .cg-stats dt{font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98}
        .cg-stats dd{margin:0;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(2.2rem,4vw,3.4rem);line-height:1;letter-spacing:-.05em}

        .cg-filters{display:flex;flex-wrap:wrap;gap:.5rem;margin:3rem 0 2rem;padding-top:2rem;border-top:1px solid rgba(255,255,255,.12)}
        .cg-filters button{display:inline-flex;align-items:center;gap:.45rem;min-height:44px;padding:0 1rem;border-radius:999px;
          border:1px solid rgba(255,255,255,.14);background:none;color:#c4c8ce;font-family:'Space Grotesk',sans-serif;font-size:.92rem;cursor:pointer;
          transition:background .25s,color .25s,border-color .25s}
        .cg-filters button i{width:8px;height:8px;border-radius:50%;background:var(--c)}
        .cg-filters button sup{font-family:'Space Mono',monospace;font-size:.6rem;opacity:.7}
        .cg-filters button:hover{border-color:#ededed}
        .cg-filters button.on{background:#ededed;color:#0b0b0c;border-color:#ededed}

        .cg-grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2.2rem 1.4rem}
        .cg-card{display:flex;flex-direction:column}
        .cg-shot{position:relative;display:block;width:100%;aspect-ratio:1.38 / 1;padding:0;border:1px solid rgba(255,255,255,.1);border-radius:14px;
          overflow:hidden;background:#f4f3ef;cursor:zoom-in;transition:border-color .3s,transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s}
        .cg-shot img{width:100%;height:100%;object-fit:contain;display:block;transition:transform .6s cubic-bezier(.22,1,.36,1)}
        .cg-shot:hover{border-color:var(--c);transform:translateY(-4px);box-shadow:0 18px 40px rgba(0,0,0,.45)}
        .cg-shot:hover img{transform:scale(1.03)}
        .cg-zoom{position:absolute;right:.7rem;bottom:.7rem;display:inline-flex;align-items:center;gap:.35rem;padding:.45rem .8rem;border-radius:999px;
          background:rgba(11,11,12,.85);color:#ededed;font-family:'Space Grotesk',sans-serif;font-size:.8rem;opacity:0;transform:translateY(6px);
          transition:opacity .3s,transform .3s}
        .cg-shot:hover .cg-zoom,.cg-shot:focus-visible .cg-zoom{opacity:1;transform:none}
        .cg-meta{display:flex;justify-content:space-between;gap:1rem;margin-top:1rem;font-family:'Space Mono',monospace;font-size:.66rem;
          letter-spacing:.08em;text-transform:uppercase;color:#8a8f98}
        .cg-cat{display:inline-flex;align-items:center;gap:.4rem}
        .cg-cat i{width:7px;height:7px;border-radius:50%;background:var(--c)}
        .cg-card h2{margin:.5rem 0 .3rem;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:1.12rem;line-height:1.3;letter-spacing:-.015em}
        .cg-card p{margin:0;font-size:.88rem;color:#a1a6ae}
        .cg-link{align-self:flex-start;display:inline-flex;align-items:center;gap:.3rem;min-height:32px;margin-top:.4rem;color:#3ddc97;
          font-family:'Space Mono',monospace;font-size:.72rem;text-decoration:none}
        .cg-link:hover{text-decoration:underline}

        .cg-view{position:fixed;inset:0;z-index:2000;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:1rem;padding:1.2rem 1.4rem 1.6rem;
          background:rgba(8,8,9,.94);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
        .cg-view-bar{display:flex;justify-content:space-between;align-items:center}
        .cg-view-count{font-family:'Space Mono',monospace;font-size:.8rem;letter-spacing:.12em;color:#a1a6ae}
        .cg-round{width:48px;height:48px;flex:none;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(255,255,255,.22);
          background:rgba(11,11,12,.6);color:#ededed;cursor:pointer;transition:background .25s,color .25s}
        .cg-round:hover{background:#ededed;color:#0b0b0c}
        .cg-view-stage{position:relative;display:flex;align-items:center;justify-content:center;gap:1rem;min-height:0}
        .cg-view-stage img{max-width:min(1200px,100%);max-height:100%;object-fit:contain;border-radius:8px;box-shadow:0 30px 80px rgba(0,0,0,.6);background:#fff}
        .cg-view-info{display:flex;justify-content:space-between;align-items:center;gap:1.5rem;flex-wrap:wrap;max-width:1200px;width:100%;margin:0 auto}
        .cg-view-name{margin:0;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:1.3rem;letter-spacing:-.02em}
        .cg-view-sub{margin:.25rem 0 0;font-size:.9rem;color:#a1a6ae}
        .cg-verify{display:inline-flex;align-items:center;gap:.35rem;min-height:44px;padding:0 1.2rem;border-radius:999px;background:#3ddc97;color:#0b0b0c;
          font-family:'Space Grotesk',sans-serif;font-weight:500;text-decoration:none;transition:transform .25s}
        .cg-verify:hover{transform:translateY(-2px)}

        .cg-next{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-top:5rem}
        .cg-next-card{display:flex;flex-direction:column;gap:1.2rem;padding:1.8rem;border-radius:20px;border:1px solid rgba(255,255,255,.1);
          background:#121214;color:#ededed;text-decoration:none;transition:border-color .3s,background .3s}
        .cg-next-card:hover{border-color:rgba(255,255,255,.3);background:#17171a}
        .cg-next-label{font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98}
        .cg-next-title{display:flex;justify-content:space-between;align-items:center;font-family:'Space Grotesk',sans-serif;font-weight:500;
          font-size:clamp(1.8rem,3.4vw,2.8rem);letter-spacing:-.045em}
        .cg-next-title svg{transition:transform .4s cubic-bezier(.22,1,.36,1)}
        .cg-next-card:hover .cg-next-title svg{transform:translateX(6px)}

        @media (max-width:980px){
          .cg-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
          .cg-intro{grid-template-columns:1fr;gap:1.6rem}
          .cg-stats{justify-content:flex-start}
        }
        @media (max-width:640px){
          .cg{padding:7rem 0 4rem}
          .cg-wrap{padding:0 1.2rem}
          .cg-grid{grid-template-columns:1fr}
          .cg-zoom{opacity:1;transform:none}
          .cg-next{grid-template-columns:1fr}
          .cg-view{padding:1rem .8rem 1.2rem}
          .cg-view-stage{gap:.4rem}
          .cg-arrow{width:40px;height:40px}
          .cg-view-stage img{max-width:calc(100% - 88px)}
        }
      `}</style>
    </main>
  );
};

export default CertificationsPage;
