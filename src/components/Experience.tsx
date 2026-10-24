import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Award, BadgeCheck, GraduationCap, MapPin } from 'lucide-react';
import { awards, certifications, education, experiences, projects } from '../data';

const EASE = [0.22, 1, 0.36, 1] as const;
const DEGREE_START = new Date('2023-08-01').getTime();
const DEGREE_END = new Date('2027-05-31').getTime();

const Experience: React.FC = () => {
  const [active, setActive] = useState(0);
  const entryRefs = useRef<(HTMLElement | null)[]>([]);
  const degree = Math.round(Math.min(1, Math.max(0, (Date.now() - DEGREE_START) / (DEGREE_END - DEGREE_START))) * 100);
  const cTraining = certifications.find(c => c.name.startsWith('C Training'));

  // whichever entry crosses the middle of the screen drives the sticky panel
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      }),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    entryRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = experiences[active];
  const total = experiences.length;
  const freelanceCount = experiences.filter(e => e.engagement === 'Freelance').length;
  const internCount = total - freelanceCount;
  const liveFor = (id?: string) => projects.find(p => p.id === id)?.liveUrl;

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section id="experience" className="ex">
      <div className="ex-wrap">
        <motion.div className="ex-head" {...reveal()}>
          <span>(05) — experience</span>
          <span>where I’ve worked &amp; studied</span>
        </motion.div>

        <motion.p className="ex-lead" {...reveal(0.1)}>
          {freelanceCount} paid freelance clients and {internCount} internships — from AI web development to machine learning and data science, <em>backed by certificates and signed letters</em>.
        </motion.p>

        <div className="ex-grid">
          {/* sticky panel that follows the entry being read */}
          <aside className="ex-sticky" aria-hidden>
            <div className="ex-counter">
              {/* one reel of numbers that slides, so fast scrolling can't stack digits */}
              <span className="ex-reel-win">
                <span className="ex-reel" style={{ transform: `translateY(${(-active / total) * 100}%)` }}>
                  {experiences.map((e, i) => <span key={e.id}>{String(i + 1).padStart(2, '0')}</span>)}
                </span>
              </span>
              <small>/ {String(total).padStart(2, '0')}</small>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p className="ex-sticky-co">{current.company}</p>
                <p className="ex-sticky-when">{current.engagement} · {current.period}</p>
              </motion.div>
            </AnimatePresence>
            <div className="ex-progress">
              <i style={{ transform: `scaleY(${(active + 1) / total})` }} />
            </div>
          </aside>

          <ol className="ex-list">
            {experiences.map((e, i) => (
              <React.Fragment key={e.id}>
              {(i === 0 || experiences[i - 1].engagement !== e.engagement) && (
                <li className="ex-group">{e.engagement === 'Freelance' ? 'Freelance' : 'Internships'}<span>{e.engagement === 'Freelance' ? freelanceCount : internCount}</span></li>
              )}
              <motion.li
                ref={el => { entryRefs.current[i] = el; }}
                data-index={i}
                className={`ex-item${i === active ? ' on' : ''}`}
                {...reveal()}
              >
                <div className="ex-meta">
                  <span className="ex-idx">{String(i + 1).padStart(2, '0')}</span>
                  <span>{e.period}</span>
                  {e.duration && <span className="ex-dur">{e.duration}</span>}
                  <span className={`ex-type ${e.engagement === 'Freelance' ? 'free' : ''}`}>{e.engagement}</span>
                  {e.certified && (
                    <span className="ex-verified"><BadgeCheck size={14} /> {e.engagement === 'Freelance' ? 'Letter verified' : 'Certificate verified'}</span>
                  )}
                </div>
                <h3>{e.role}</h3>
                <p className="ex-co">{e.company}</p>
                <ul className="ex-points">
                  {e.points.map(pt => <li key={pt}>{pt}</li>)}
                </ul>
                {e.tech && (
                  <div className="ex-tech">{e.tech.map(t => <span key={t}>{t}</span>)}</div>
                )}
                {liveFor(e.projectId) && (
                  <a className="ex-live" href={liveFor(e.projectId)} target="_blank" rel="noopener noreferrer">
                    View the live site <ArrowUpRight size={14} />
                  </a>
                )}
              </motion.li>
              </React.Fragment>
            ))}
          </ol>
        </div>

        {/* education */}
        <motion.div className="ex-edu" {...reveal()}>
          <div className="ex-edu-label">
            <GraduationCap size={18} />
            <span>Education</span>
          </div>
          <div className="ex-edu-main">
            <p className="ex-edu-when">{education.period} · Final year</p>
            <h3>B.Tech — Artificial Intelligence <br />&amp; Data Science</h3>
            <p className="ex-edu-inst">{education.institution}</p>
            <p className="ex-edu-loc"><MapPin size={14} /> {education.location}</p>
            <div className="ex-edu-bar">
              <motion.i initial={{ width: 0 }} whileInView={{ width: `${degree}%` }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }} />
            </div>
            <div className="ex-edu-bar-meta"><span>{degree}% complete</span><span>Graduating 2027</span></div>
          </div>
          <div className="ex-edu-side">
            <p className="ex-edu-side-title">Along the way</p>
            <ul>
              {awards.map(a => (
                <li key={a.title}>
                  <Award size={16} />
                  <div><strong>{a.title}</strong><span>{a.date} · inter-college startup event</span></div>
                </li>
              ))}
              {cTraining && (
                <li>
                  <BadgeCheck size={16} />
                  <div><strong>C programming — scored 95%</strong><span>{cTraining.issuer} {cTraining.via} · {cTraining.date}</span></div>
                </li>
              )}
              <li>
                <BadgeCheck size={16} />
                <div><strong>{certifications.length} certifications alongside the degree</strong><span>Coursera, Udemy, Microsoft Learn, Infosys and more</span></div>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      <style>{`
        .ex{position:relative;z-index:1;background:#0b0b0c;color:#ededed;padding:7rem 0 6rem}
        .ex-wrap{max-width:1240px;margin:0 auto;padding:0 2.2%}
        .ex-head{display:flex;justify-content:space-between;padding-bottom:.8rem;border-bottom:1.5px solid #ededed;
          font-family:'Space Grotesk',sans-serif;font-size:.95rem}
        .ex-lead{margin:3rem 0 4rem;max-width:900px;font-family:'Space Grotesk',sans-serif;font-weight:500;
          font-size:clamp(1.5rem,2.8vw,2.5rem);line-height:1.2;letter-spacing:-.03em}
        .ex-lead em{font-style:italic;color:var(--cyan)}

        .ex-grid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.6fr);gap:3.5rem;align-items:start}
        .ex-sticky{position:sticky;top:7rem;padding-right:1rem}
        .ex-counter{display:flex;align-items:flex-end;gap:.5rem;font-family:'Space Grotesk',sans-serif;font-weight:500;line-height:.85}
        .ex-reel-win{display:block;height:.85em;overflow:hidden;font-size:clamp(5rem,10vw,9rem);letter-spacing:-.06em}
        .ex-reel{display:block;transition:transform .6s cubic-bezier(.22,1,.36,1)}
        .ex-reel span{display:block;height:.85em}
        .ex-counter small{font-size:1.2rem;color:#8a8f98;margin-bottom:.6rem}
        .ex-sticky-co{margin:1.4rem 0 .3rem;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:1.6rem;letter-spacing:-.03em}
        .ex-sticky-when{margin:0;font-family:'Space Mono',monospace;font-size:.72rem;letter-spacing:.08em;color:var(--cyan)}
        .ex-progress{width:2px;height:160px;margin-top:2rem;background:rgba(255,255,255,.1);overflow:hidden}
        .ex-progress i{display:block;width:100%;height:100%;transform-origin:top;background:linear-gradient(var(--cyan),var(--purple));
          transition:transform .6s cubic-bezier(.22,1,.36,1)}

        .ex-list{list-style:none;margin:0;padding:0;border-top:1px solid rgba(255,255,255,.12)}
        .ex-item{padding:2.2rem 0 2.4rem;border-bottom:1px solid rgba(255,255,255,.12);opacity:.45;transition:opacity .5s}
        .ex-item.on{opacity:1}
        .ex-meta{display:flex;align-items:center;flex-wrap:wrap;gap:.6rem 1.1rem;font-family:'Space Mono',monospace;font-size:.7rem;
          letter-spacing:.06em;color:#a1a6ae}
        .ex-idx{color:#ededed}
        .ex-dur{padding:.2rem .55rem;border-radius:999px;border:1px solid rgba(255,255,255,.18)}
        .ex-verified{display:inline-flex;align-items:center;gap:.3rem;color:#3ddc97}
        .ex-type{padding:.2rem .55rem;border-radius:999px;background:rgba(255,255,255,.08);color:#ededed}
        .ex-type.free{background:var(--cyan);color:#04131a}
        .ex-group{display:flex;align-items:baseline;gap:.6rem;padding:1.4rem 0 .2rem;font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:#8a8f98}
        .ex-group span{color:#ededed}
        .ex-live{display:inline-flex;align-items:center;gap:.3rem;margin-top:1.2rem;color:#ededed;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:.95rem;border-bottom:1px solid #ededed}
        .ex-live:hover{color:var(--cyan);border-color:var(--cyan)}
        .ex-item h3{margin:1rem 0 .3rem;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(1.7rem,3vw,2.6rem);
          letter-spacing:-.035em;line-height:1.05}
        .ex-co{margin:0;font-family:'Space Grotesk',sans-serif;font-size:1.1rem;color:var(--cyan)}
        .ex-points{margin:1.2rem 0 0;padding:0;list-style:none;display:grid;gap:.55rem;max-width:640px}
        .ex-points li{position:relative;padding-left:1.3rem;font-size:.98rem;line-height:1.6;color:#c4c8ce}
        .ex-points li::before{content:'';position:absolute;left:0;top:.7em;width:.6rem;height:1px;background:#ededed}
        .ex-tech{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:1.3rem}
        .ex-tech span{padding:.35rem .75rem;border-radius:999px;border:1px solid rgba(255,255,255,.14);font-size:.8rem;color:#d4d7dc}

        .ex-edu{display:grid;grid-template-columns:10rem minmax(0,1.4fr) minmax(0,1fr);gap:2.5rem;margin-top:6rem;padding:2.6rem 0 0;
          border-top:1.5px solid #ededed}
        .ex-edu-label{display:flex;align-items:center;gap:.5rem;font-family:'Space Grotesk',sans-serif;font-size:.95rem;align-self:start}
        .ex-edu-when{margin:0 0 1rem;font-family:'Space Mono',monospace;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--cyan)}
        .ex-edu-main h3{margin:0;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(2rem,3.6vw,3.2rem);
          letter-spacing:-.04em;line-height:1.02}
        .ex-edu-inst{margin:1.2rem 0 .3rem;font-size:1.02rem;color:#c4c8ce}
        .ex-edu-loc{display:flex;align-items:center;gap:.35rem;margin:0;font-size:.88rem;color:#8a8f98}
        .ex-edu-bar{height:6px;margin-top:1.8rem;border-radius:3px;background:rgba(255,255,255,.08);overflow:hidden}
        .ex-edu-bar i{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,var(--cyan),var(--purple))}
        .ex-edu-bar-meta{display:flex;justify-content:space-between;margin-top:.5rem;font-family:'Space Mono',monospace;font-size:.68rem;color:#8a8f98}
        .ex-edu-side{padding:1.6rem;border-radius:18px;border:1px solid rgba(255,255,255,.1);background:#121214;align-self:start}
        .ex-edu-side-title{margin:0 0 1rem;font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98}
        .ex-edu-side ul{list-style:none;margin:0;padding:0;display:grid;gap:1rem}
        .ex-edu-side li{display:flex;gap:.7rem;align-items:flex-start}
        .ex-edu-side li > svg{flex:none;margin-top:.15rem;color:#f2c811}
        .ex-edu-side strong{display:block;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:.98rem}
        .ex-edu-side span{font-size:.8rem;color:#8a8f98}

        @media (max-width:980px){
          .ex-grid{grid-template-columns:1fr}
          .ex-sticky{display:none}
          .ex-item{opacity:1}
          .ex-edu{grid-template-columns:1fr;gap:1.6rem}
        }
        @media (max-width:640px){
          .ex{padding:5rem 0 4rem}
          .ex-wrap{padding:0 1.2rem}
        }
      `}</style>
    </section>
  );
};

export default Experience;
