import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Images, Lock, Plus, X } from 'lucide-react';
import { projects, type Project, type ProjectCategory } from '../data';

const EASE = [0.22, 1, 0.36, 1] as const;
const FILTERS: ('All' | ProjectCategory)[] = ['All', 'Client Websites', 'AI & ML', 'Apps & Systems'];

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

const detectionLabel = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('finger')) return 'hand 0.97';
  if (t.includes('theft')) return 'person 0.94';
  return 'face 0.92';
};

// Live sites show their real screenshot in a browser frame; source-only projects get an
// animated stand-in picked from what the project does.
const Preview: React.FC<{ project: Project }> = ({ project: p }) => {
  if (p.image && p.liveUrl) {
    return (
      <div className="pv pv-site">
        <div className="pv-chrome">
          <span className="pv-dots"><i /><i /><i /></span>
          <span className="pv-url">{host(p.liveUrl)}</span>
          <span className="pv-live"><i /> live</span>
        </div>
        <img src={p.image} alt={`${p.title} website`} loading="lazy" />
      </div>
    );
  }
  if (p.image) {
    return (
      <div className="pv pv-photo">
        <img src={p.image} alt={`${p.title}`} loading="lazy" />
        <span className="pv-name"><Images size={11} /> {p.gallery?.length ?? 1} photo{(p.gallery?.length ?? 1) > 1 ? 's' : ''}</span>
      </div>
    );
  }
  const t = p.tags.join(' ').toLowerCase();
  const kind = /yolo|opencv|mediapipe|computer vision/.test(t) ? 'vision'
    : /nlp|speech/.test(t) ? 'voice'
    : /leaflet/.test(t) ? 'geo'
    : 'apps';
  return (
    <div className={`pv pv-${kind}`}>
      {kind === 'vision' && (
        <>
          <div className="pv-floor" />
          <span className="pv-rec"><i /> LIVE · {p.tags.find(x => /yolo|mediapipe|opencv/i.test(x)) ?? 'CV'}</span>
          <div className="pv-target"><b>{detectionLabel(p.title)}</b></div>
        </>
      )}
      {kind === 'voice' && (
        <>
          <div className="pv-orb" />
          <div className="pv-wave">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 6) * 0.1}s` }} />)}</div>
        </>
      )}
      {kind === 'geo' && (
        <div className="pv-map">
          {[[22, 30], [58, 48], [40, 70], [76, 26], [66, 72]].map(([x, y], i) => (
            <i key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }} />
          ))}
        </div>
      )}
      {kind === 'apps' && (
        <div className="pv-phone">{[0, 1, 2, 3].map(i => <i key={i} style={{ animationDelay: `${0.15 + i * 0.25}s` }} />)}</div>
      )}
      <span className="pv-name">{p.icon} {p.title}{p.privateRepo ? ' · private' : ''}</span>
    </div>
  );
};

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<'All' | ProjectCategory>('All');
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<Project | null>(null);
  const [viewer, setViewer] = useState<{ project: Project; index: number } | null>(null);

  useEffect(() => {
    if (!viewer) return;
    const count = viewer.project.gallery?.length ?? 1;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewer(null);
      if (e.key === 'ArrowRight') setViewer(v => v && { ...v, index: (v.index + 1) % count });
      if (e.key === 'ArrowLeft') setViewer(v => v && { ...v, index: (v.index - 1 + count) % count });
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [viewer]);

  // the floating preview trails the cursor and tilts with its horizontal speed
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });
  const rotate = useTransform(useVelocity(x), [-1500, 1500], [-8, 8]);

  const list = useMemo(() => (filter === 'All' ? projects : projects.filter(p => p.category === filter)), [filter]);
  const countFor = (f: 'All' | ProjectCategory) => (f === 'All' ? projects.length : projects.filter(p => p.category === f).length);
  const liveCount = projects.filter(p => p.liveUrl).length;

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section id="projects" className="pj">
      <div className="pj-wrap">
        <motion.div className="pj-head" {...reveal()}>
          <span>(04) — projects</span>
          <span>{liveCount} live · {projects.length} total</span>
        </motion.div>

        <div className="pj-intro">
          <motion.p className="pj-lead" {...reveal(0.1)}>
            Real products, <em>live on the web</em> — client websites, AI systems and apps.
            Hover to preview, tap or click to visit.
          </motion.p>
          <motion.div className="pj-filters" role="tablist" aria-label="Filter projects" {...reveal(0.15)}>
            {FILTERS.map(f => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={filter === f ? 'on' : ''}
                onClick={() => { setFilter(f); setOpen(null); }}
              >
                {f} <sup>{countFor(f)}</sup>
              </button>
            ))}
          </motion.div>
        </div>

        <ul
          className="pj-list"
          onMouseMove={e => { mx.set(e.clientX); my.set(e.clientY); }}
          onMouseLeave={() => setHover(null)}
        >
          <AnimatePresence initial={false}>
            {list.map((p, i) => {
              const isOpen = open === p.id;
              const href = p.liveUrl ?? (p.gallery ? undefined : p.githubUrl);
              const openPhotos = () => setViewer({ project: p, index: 0 });
              return (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={`pj-item${isOpen ? ' open' : ''}`}
                  onMouseEnter={() => setHover(p)}
                >
                  <div className="pj-row">
                    {/* the whole row opens the live site, the photos, or the repo */}
                    {React.createElement(href ? 'a' : 'button', {
                      className: 'pj-link',
                      ...(href
                        ? { href, target: '_blank', rel: 'noopener noreferrer' }
                        : { type: 'button', onClick: openPhotos }),
                      'aria-label': `${p.title} — ${p.liveUrl ? `visit ${host(p.liveUrl)}` : href ? 'view source on GitHub' : 'view photos'}`,
                    }, <>
                      <span className="pj-num">{String(i + 1).padStart(3, '0')}</span>
                      <span className="pj-title">
                        {p.title}
                        {p.liveUrl && <em className="pj-live">live</em>}
                        {p.freelance && <em className="pj-free">freelance</em>}
                      </span>
                      <span className="pj-kind">{p.liveUrl ? host(p.liveUrl) : p.gallery ? 'view photos' : 'source on GitHub'}</span>
                      <span className="pj-tech">{p.tags.slice(0, 3).join(' · ')}</span>
                      <span className="pj-go">{href ? <ArrowUpRight size={18} /> : <Images size={18} />}</span>
                    </>)}
                    <button className="pj-toggle" onClick={() => setOpen(isOpen ? null : p.id)} aria-expanded={isOpen}
                      aria-label={isOpen ? `Hide ${p.title} details` : `Show ${p.title} details`}>
                      <Plus size={18} />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="pj-detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                      >
                        <div className="pj-detail-in">
                          <div className="pj-detail-text">
                            <p className="pj-cat">{p.category}</p>
                            <p>{p.description}</p>
                            <div className="pj-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
                            <div className="pj-links">
                              {p.liveUrl && (
                                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="pj-btn solid">
                                  Visit {host(p.liveUrl)} <ArrowUpRight size={14} />
                                </a>
                              )}
                              {p.gallery && (
                                <button type="button" className="pj-btn solid" onClick={openPhotos}>
                                  <Images size={15} /> View photos
                                </button>
                              )}
                              {p.githubUrl && (
                                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="pj-btn">
                                  {p.privateRepo ? <Lock size={14} /> : <Github size={15} />} Source{p.privateRepo ? ' (private)' : ''} <ArrowUpRight size={14} />
                                </a>
                              )}
                            </div>
                          </div>
                          {href ? (
                            <a className="pj-detail-preview" href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
                              <Preview project={p} />
                            </a>
                          ) : (
                            <button type="button" className="pj-detail-preview" onClick={openPhotos} tabIndex={-1}>
                              <Preview project={p} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        <motion.p className="pj-more" {...reveal()}>
          More experiments on <a href="https://github.com/ab-rar-6024" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} /></a>
        </motion.p>
      </div>

      {/* floating cursor preview (mouse only) */}
      <motion.div className="pj-float" style={{ x, y, rotate }} aria-hidden>
        <AnimatePresence mode="wait">
          {hover && !open && (
            <motion.div
              key={hover.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <Preview project={hover} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* rendered at page level so it sits above the navbar and floating buttons, but under the custom cursor (z 99998-99999) */}
      {createPortal(<AnimatePresence>
        {viewer && (() => {
          const photos = viewer.project.gallery ?? [];
          const go = (d: number) => setViewer(v => v && { ...v, index: (v.index + d + photos.length) % photos.length });
          return (
            <motion.div
              className="pj-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`${viewer.project.title} photos`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewer(null)}
            >
              <motion.figure
                key={viewer.index}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                onClick={e => e.stopPropagation()}
              >
                <img src={photos[viewer.index]} alt={`${viewer.project.title} — photo ${viewer.index + 1}`} />
                <figcaption>
                  <span>{viewer.project.title}</span>
                  <span className="pj-lb-meta">
                    {viewer.project.githubUrl && (
                      <a href={viewer.project.githubUrl} target="_blank" rel="noopener noreferrer" className="pj-lb-gh">
                        {viewer.project.privateRepo ? <Lock size={13} /> : <Github size={13} />}
                        {viewer.project.privateRepo ? 'Code (private)' : 'View code'} <ArrowUpRight size={12} />
                      </a>
                    )}
                    <span>{viewer.index + 1} / {photos.length}</span>
                  </span>
                </figcaption>
              </motion.figure>
              {photos.length > 1 && (
                <>
                  <button className="pj-lb-nav prev" onClick={e => { e.stopPropagation(); go(-1); }} aria-label="Previous photo"><ChevronLeft size={22} /></button>
                  <button className="pj-lb-nav next" onClick={e => { e.stopPropagation(); go(1); }} aria-label="Next photo"><ChevronRight size={22} /></button>
                </>
              )}
              <button className="pj-lb-close" onClick={() => setViewer(null)} aria-label="Close"><X size={20} /></button>
            </motion.div>
          );
        })()}
      </AnimatePresence>, document.body)}

      <style>{`
        .pj{position:relative;z-index:1;background:#0b0b0c;color:#ededed;padding:7rem 0 6rem}
        .pj-wrap{max-width:1240px;margin:0 auto;padding:0 2.2%}
        .pj-head{display:flex;justify-content:space-between;padding-bottom:.8rem;border-bottom:1.5px solid #ededed;
          font-family:'Space Grotesk',sans-serif;font-size:.95rem}
        .pj-intro{display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;flex-wrap:wrap;margin:3rem 0 2.6rem}
        .pj-lead{margin:0;max-width:760px;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(1.5rem,2.8vw,2.5rem);
          line-height:1.2;letter-spacing:-.03em}
        .pj-lead em{font-style:italic;color:var(--cyan)}
        .pj-filters{display:flex;gap:.5rem;flex-wrap:wrap}
        .pj-filters button{padding:.45rem .9rem;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:none;color:#c4c8ce;
          font-family:'Space Grotesk',sans-serif;font-size:.85rem;cursor:pointer;transition:background .25s,color .25s,border-color .25s}
        .pj-filters button sup{font-family:'Space Mono',monospace;font-size:.6rem;opacity:.7}
        .pj-filters button:hover{border-color:#ededed}
        .pj-filters button.on{background:#ededed;color:#0b0b0c;border-color:#ededed}

        .pj-list{list-style:none;margin:0;padding:0;border-top:1px solid rgba(255,255,255,.14)}
        .pj-item{border-bottom:1px solid rgba(255,255,255,.14)}
        .pj-row{position:relative;display:flex;align-items:center;overflow:hidden;color:#ededed;transition:color .35s}
        .pj-row::before{content:'';position:absolute;inset:0;background:#ededed;transform:scaleY(0);transform-origin:bottom;
          transition:transform .5s cubic-bezier(.22,1,.36,1)}
        .pj-item:hover .pj-row,.pj-item.open .pj-row{color:#0b0b0c}
        .pj-item:hover .pj-row::before,.pj-item.open .pj-row::before{transform:scaleY(1)}
        .pj-link{position:relative;flex:1;min-width:0;display:grid;grid-template-columns:4rem minmax(0,1fr) 12rem 15rem 2.4rem;align-items:center;gap:1rem;
          padding:1.6rem .6rem;color:inherit;text-decoration:none}
        .pj-num{font-family:'Space Mono',monospace;font-size:.72rem;opacity:.6}
        .pj-title{display:flex;align-items:center;flex-wrap:wrap;gap:.5rem .8rem;font-family:'Space Grotesk',sans-serif;font-weight:500;
          font-size:clamp(1.4rem,2.9vw,2.6rem);letter-spacing:-.035em;line-height:1.05;transition:transform .5s cubic-bezier(.22,1,.36,1)}
        .pj-item:hover .pj-title{transform:translateX(.6rem)}
        .pj-live{font-style:normal;font-family:'Space Mono',monospace;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;
          padding:.25rem .55rem;border-radius:999px;background:#3ddc97;color:#04130c}
        .pj-free{font-style:normal;font-family:'Space Mono',monospace;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;
          padding:.22rem .55rem;border-radius:999px;border:1px solid currentColor;opacity:.8}
        .pj-kind{font-family:'Space Mono',monospace;font-size:.74rem;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pj-tech{font-family:'Space Mono',monospace;font-size:.7rem;opacity:.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pj-go{justify-self:end;transition:transform .35s cubic-bezier(.22,1,.36,1)}
        .pj-item:hover .pj-go{transform:rotate(45deg)}
        .pj-toggle{position:relative;flex:none;width:38px;height:38px;margin-right:.6rem;border-radius:50%;display:grid;place-items:center;
          border:1px solid currentColor;background:none;color:inherit;cursor:pointer;transition:transform .4s cubic-bezier(.22,1,.36,1)}
        .pj-item.open .pj-toggle{transform:rotate(45deg)}

        .pj-detail{overflow:hidden}
        .pj-detail-in{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:2.5rem;padding:2rem .6rem 2.4rem 5rem}
        .pj-cat{margin:0 0 .6rem!important;font-family:'Space Mono',monospace;font-size:.66rem!important;letter-spacing:.14em;text-transform:uppercase;color:var(--cyan)!important}
        .pj-detail-text p{margin:0 0 1.2rem;font-size:1.02rem;line-height:1.7;color:#c4c8ce;max-width:620px}
        .pj-tags{display:flex;flex-wrap:wrap;gap:.45rem;margin-bottom:1.5rem}
        .pj-tags span{padding:.35rem .75rem;border-radius:999px;border:1px solid rgba(255,255,255,.14);font-size:.8rem;color:#d4d7dc}
        .pj-links{display:flex;gap:.8rem;flex-wrap:wrap}
        .pj-btn{display:inline-flex;align-items:center;gap:.45rem;padding:.7rem 1.2rem;border-radius:999px;border:1px solid rgba(255,255,255,.25);
          color:#ededed;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:.92rem;transition:background .25s,color .25s,border-color .25s}
        .pj-btn:hover{border-color:#ededed;background:rgba(255,255,255,.06)}
        .pj-btn.solid{background:#ededed;color:#0b0b0c;border-color:#ededed}
        .pj-btn.solid:hover{background:var(--cyan);border-color:var(--cyan)}
        .pj-detail-preview{display:block;width:100%;padding:0;border:0;background:none;cursor:pointer;text-decoration:none;text-align:left}
        button.pj-link{width:100%;background:none;border:0;cursor:pointer;text-align:left;font:inherit}
        .pv-photo img{width:100%;height:100%;object-fit:cover;display:block}
        .pv-photo .pv-name{display:inline-flex;align-items:center;gap:.3rem}
        .pj-lightbox{position:fixed;inset:0;z-index:99990;display:grid;place-items:center;padding:4rem 1.2rem;
          background:rgba(5,5,7,.88);backdrop-filter:blur(10px)}
        .pj-lightbox figure{margin:0;max-width:min(1100px,92vw)}
        .pj-lightbox img{display:block;width:100%;max-height:78vh;object-fit:contain;border-radius:16px;
          border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 100px rgba(0,0,0,.6)}
        .pj-lightbox figcaption{display:flex;justify-content:space-between;margin-top:.9rem;font-family:'Space Mono',monospace;
          font-size:.72rem;letter-spacing:.08em;color:#a1a6ae}
        .pj-lb-meta{display:flex;align-items:center;gap:1rem}
        .pj-lb-gh{display:inline-flex;align-items:center;gap:.35rem;padding:.4rem .8rem;border-radius:999px;border:1px solid rgba(255,255,255,.2);
          color:#ededed;text-decoration:none;transition:background .25s,color .25s}
        .pj-lb-gh:hover{background:#ededed;color:#0b0b0c}
        .pj-lightbox figcaption > span:first-child{color:#ededed;font-family:'Space Grotesk',sans-serif;font-size:1rem;letter-spacing:-.01em}
        .pj-lb-close,.pj-lb-nav{position:absolute;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;cursor:pointer;
          border:1px solid rgba(255,255,255,.2);background:rgba(16,16,19,.8);color:#ededed;transition:background .25s,color .25s}
        .pj-lb-close:hover,.pj-lb-nav:hover{background:#ededed;color:#0b0b0c}
        .pj-lb-close{top:1.4rem;right:1.4rem}
        .pj-lb-nav.prev{left:1.4rem;top:50%;transform:translateY(-50%)}
        .pj-lb-nav.next{right:1.4rem;top:50%;transform:translateY(-50%)}
        .pj-detail-preview .pv{width:100%;height:auto;aspect-ratio:16/10}
        .pj-more{margin:2.4rem 0 0;font-family:'Space Grotesk',sans-serif;color:#a1a6ae}
        .pj-more a{display:inline-flex;align-items:center;gap:.25rem;color:#ededed;text-decoration:none;border-bottom:1px solid #ededed}

        .pj-float{position:fixed;left:0;top:0;z-index:50;pointer-events:none;margin:-130px 0 0 34px}
        .pj-float .pv{width:380px;height:238px;box-shadow:0 30px 80px rgba(0,0,0,.65)}

        /* previews */
        .pv{position:relative;overflow:hidden;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:#101218;font-family:'Space Mono',monospace}
        .pv-site{display:flex;flex-direction:column;background:#0f1115}
        .pv-chrome{flex:none;display:flex;align-items:center;gap:.6rem;padding:.5rem .7rem;background:#181a20;border-bottom:1px solid rgba(255,255,255,.08)}
        .pv-dots{display:flex;gap:4px}
        .pv-dots i{width:8px;height:8px;border-radius:50%;background:#ff5f57}
        .pv-dots i:nth-child(2){background:#febc2e}.pv-dots i:nth-child(3){background:#28c840}
        .pv-url{flex:1;padding:.2rem .6rem;border-radius:6px;background:#0f1115;font-size:.62rem;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pv-live{display:flex;align-items:center;gap:.3rem;font-size:.58rem;letter-spacing:.08em;text-transform:uppercase;color:#3ddc97}
        .pv-live i{width:6px;height:6px;border-radius:50%;background:#3ddc97;animation:pv-blink 1.4s steps(1) infinite}
        .pv-site img{flex:1;min-height:0;width:100%;object-fit:cover;object-position:top;display:block}
        .pv-name{position:absolute;left:12px;bottom:10px;z-index:2;font-size:.62rem;letter-spacing:.06em;color:#e2e8f0;
          padding:.25rem .55rem;border-radius:999px;background:rgba(0,0,0,.45);backdrop-filter:blur(6px)}
        .pv-vision{background:radial-gradient(ellipse at 50% 20%,#1b2540,#070b16 75%)}
        .pv-vision::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 2px,rgba(0,0,0,.18) 2px 3px)}
        .pv-floor{position:absolute;left:-20%;right:-20%;bottom:-35%;height:80%;transform:perspective(260px) rotateX(62deg);
          background-image:linear-gradient(rgba(0,245,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,.2) 1px,transparent 1px);background-size:28px 28px}
        .pv-rec{position:absolute;top:10px;left:12px;z-index:2;display:flex;align-items:center;gap:6px;font-size:.58rem;color:#cbd5e1;letter-spacing:.08em}
        .pv-rec i{width:6px;height:6px;border-radius:50%;background:#ff3b5c;animation:pv-blink 1s steps(1) infinite}
        .pv-target{position:absolute;top:30%;width:74px;height:84px;border:1.5px solid var(--cyan);animation:pv-scan 4s ease-in-out infinite}
        .pv-target b{position:absolute;bottom:100%;left:-1.5px;background:var(--cyan);color:#000;font-size:.52rem;padding:1px 4px;white-space:nowrap}
        .pv-voice{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle at 50% 35%,#1a1440,#080b18 70%)}
        .pv-orb{width:52px;height:52px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#00f5ff 30%,#9b59ff 75%);
          box-shadow:0 0 34px rgba(0,245,255,.5);animation:pv-pulse 1.6s ease-in-out infinite}
        .pv-wave{display:flex;gap:3px;align-items:center;height:34px}
        .pv-wave i{width:4px;height:100%;border-radius:2px;background:linear-gradient(#00f5ff,#9b59ff);animation:pv-wave .9s ease-in-out infinite alternate}
        .pv-geo{background:#0a1018}
        .pv-map{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);
          background-size:24px 24px}
        .pv-map i{position:absolute;width:12px;height:12px;margin:-6px;border-radius:50%;background:#ff5a1f;box-shadow:0 0 0 0 rgba(255,90,31,.7);animation:pv-hot 2s ease-out infinite}
        .pv-apps{background:linear-gradient(160deg,#101a2e,#090d19)}
        .pv-phone{position:absolute;left:50%;top:14px;bottom:-20px;width:120px;margin-left:-60px;border-radius:18px;border:2px solid #334155;background:#0b1120;
          padding:22px 10px;display:flex;flex-direction:column;gap:8px}
        .pv-phone i{height:22px;border-radius:7px;background:linear-gradient(90deg,rgba(0,245,255,.35),rgba(155,89,255,.2));opacity:0;animation:pv-row 3.2s ease-out infinite}

        @keyframes pv-blink{50%{opacity:.2}}
        @keyframes pv-scan{0%,100%{left:14%}50%{left:62%}}
        @keyframes pv-pulse{50%{transform:scale(1.12)}}
        @keyframes pv-wave{from{transform:scaleY(.15)}to{transform:scaleY(1)}}
        @keyframes pv-hot{0%{box-shadow:0 0 0 0 rgba(255,90,31,.7)}100%{box-shadow:0 0 0 22px rgba(255,90,31,0)}}
        @keyframes pv-row{0%{opacity:0;transform:translateX(-12px)}12%,85%{opacity:1;transform:none}100%{opacity:0}}

        @media (hover:none){.pj-float{display:none}}
        @media (max-width:1180px){
          .pj-link{grid-template-columns:3.4rem minmax(0,1fr) 11rem 2.4rem}
          .pj-tech{display:none}
        }
        @media (max-width:980px){
          .pj-link{grid-template-columns:3rem minmax(0,1fr) 2rem}
          .pj-kind,.pj-tech{display:none}
          .pj-detail-in{grid-template-columns:1fr;padding:1.4rem .6rem 2rem 3.6rem}
        }
        @media (max-width:640px){
          .pj{padding:5rem 0 4rem}
          .pj-wrap{padding:0 1.2rem}
          .pj-link{grid-template-columns:2.4rem minmax(0,1fr) 1.6rem;padding:1.2rem .3rem}
          .pj-title{font-size:1.3rem;flex-wrap:wrap;gap:.5rem}
          .pj-toggle{width:34px;height:34px;margin-right:.3rem}
          .pj-detail-in{padding:1.2rem .3rem 1.8rem}
          .pj-float{display:none}
        }
        @media (prefers-reduced-motion:reduce){.pv *{animation:none!important}}
      `}</style>
    </section>
  );
};

export default Projects;
