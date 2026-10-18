import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Award, Briefcase, Code2 } from 'lucide-react';
import { certifications, experiences, projects } from '../data';

const EASE = [0.22, 1, 0.36, 1] as const;

// How each skill is proven: project tags it matches, words in certificate names, and internship ids.
interface Skill { name: string; tags?: string[]; certs?: string[]; interns?: string[] }
interface Group { title: string; skills: Skill[] }

const GROUPS: Group[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', tags: ['Python'], certs: ['Python', 'Machine Learning A-Z', 'CNN'], interns: ['cognifyz-ml', 'cognifyz-ds', 'dp-world'] },
      { name: 'TypeScript', tags: ['TypeScript'], interns: ['apm', 'pabt'] },
      { name: 'JavaScript', tags: ['JavaScript', 'Node.js'] },
      { name: 'SQL', tags: ['PostgreSQL', 'MySQL'], certs: ['SQL'], interns: ['dp-world'] },
      { name: 'R', certs: ['with R', 'Python & R'] },
      { name: 'C / C++', certs: ['C Training', 'C++'] },
    ],
  },
  {
    title: 'Machine Learning & Vision',
    skills: [
      { name: 'Machine Learning', certs: ['Machine Learning'], interns: ['cognifyz-ml'] },
      { name: 'Deep Learning', tags: ['Deep Learning'], certs: ['Deep Learning'] },
      { name: 'Computer vision', tags: ['Computer Vision', 'OpenCV'] },
      { name: 'Explainable AI (GradCAM)', tags: ['GradCAM'] },
    ],
  },
  {
    title: 'NLP & Generative AI',
    skills: [
      { name: 'NLP', tags: ['NLP'], certs: ['Natural Language'] },
      { name: 'LLM APIs (Gemini)', tags: ['Gemini API'] },
      { name: 'Prompt engineering', certs: ['Prompt'] },
      { name: 'Generative AI', certs: ['Generative', 'GenAI', 'Applied AI', 'Claude'], interns: ['agnirva-ai'] },
    ],
  },
  {
    title: 'Data & BI',
    skills: [
      { name: 'Power BI', certs: ['Business Intelligence'] },
      { name: 'Data analysis', certs: ['Data Analy', 'Data Science'], interns: ['cognifyz-ds'] },
      { name: 'Data mining', certs: ['Data Mining'] },
      { name: 'Geospatial maps', tags: ['Leaflet'] },
    ],
  },
  {
    title: 'Web, Apps & Cloud',
    skills: [
      { name: 'React', tags: ['React'], interns: ['tracole', 'rr-events'] },
      { name: 'Next.js', tags: ['Next.js'], interns: ['apm', 'pabt'] },
      { name: 'Three.js / 3D', tags: ['Three.js', 'React Three Fiber'], interns: ['tracole', 'pabt', 'apm'] },
      { name: 'GSAP motion', tags: ['GSAP'], interns: ['tracole', 'pabt', 'rr-events'] },
      { name: 'Node.js & Express', tags: ['Node.js', 'Express'] },
      { name: 'Flask', tags: ['Flask'] },
      { name: 'React Native', tags: ['React Native'] },
      { name: 'Supabase', tags: ['Supabase'] },
      { name: 'AWS S3', certs: ['AWS'] },
    ],
  },
];

const SOFT = ['Problem solving', 'Analytical thinking', 'Team collaboration', 'Communication', 'Adaptability', 'Time management'];

function receiptsFor(s: Skill) {
  const lower = (x: string) => x.toLowerCase();
  return {
    projects: projects.filter(p => s.tags?.some(t => p.tags.map(lower).includes(lower(t)))),
    certs: certifications.filter(c => s.certs?.some(k => c.name.includes(k))),
    interns: experiences.filter(e => s.interns?.includes(e.id)),
  };
}

const Skills: React.FC = () => {
  const [active, setActive] = useState('Python');
  const panelRef = useRef<HTMLDivElement>(null);

  const all = useMemo(() => GROUPS.flatMap(g => g.skills), []);
  const proof = useMemo(() => Object.fromEntries(all.map(s => {
    const r = receiptsFor(s);
    return [s.name, r.projects.length + r.certs.length + r.interns.length];
  })), [all]);
  const maxProof = Math.max(...Object.values(proof));
  const current = all.find(s => s.name === active)!;
  const r = receiptsFor(current);

  const pick = (name: string, scroll = false) => {
    setActive(name);
    // on narrow screens the panel sits below the list, so bring it into view on tap
    if (scroll && window.innerWidth < 980) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section id="skills" className="sk">
      <div className="sk-wrap">
        <motion.div className="sk-head" {...reveal()}>
          <span>(03) — skills</span>
          <span>what I work with</span>
        </motion.div>

        <motion.p className="sk-lead" {...reveal(0.1)}>
          Skills are claims. These come with <em>receipts</em> — hover or tap any skill to see the projects,
          certificates and internships behind it.
        </motion.p>

        <div className="sk-grid">
          <div className="sk-groups">
            {GROUPS.map((g, gi) => (
              <motion.div key={g.title} className="sk-group" {...reveal(gi * 0.05)}>
                <div className="sk-group-head">
                  <span className="sk-idx">{String(gi + 1).padStart(2, '0')}</span>
                  <h3>{g.title}</h3>
                  <span className="sk-count">{g.skills.length}</span>
                </div>
                <div className="sk-pills">
                  {g.skills.map(s => (
                    <button
                      key={s.name}
                      className={`sk-pill${active === s.name ? ' on' : ''}`}
                      onMouseEnter={() => pick(s.name)}
                      onFocus={() => pick(s.name)}
                      onClick={() => pick(s.name, true)}
                      aria-pressed={active === s.name}
                    >
                      {s.name}
                      <sup>{proof[s.name]}</sup>
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
            <motion.p className="sk-soft" {...reveal()}>
              <span>also</span> {SOFT.join(' · ')}
            </motion.p>
          </div>

          <aside className="sk-panel" ref={panelRef} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p className="sk-label">Receipts for</p>
                <h3 className="sk-skill">{current.name}</h3>
                <div className="sk-meter">
                  <i style={{ width: `${(proof[active] / maxProof) * 100}%` }} />
                </div>
                <p className="sk-summary">
                  {r.projects.length} project{r.projects.length === 1 ? '' : 's'} · {r.certs.length} certificate{r.certs.length === 1 ? '' : 's'} · {r.interns.length} role{r.interns.length === 1 ? '' : 's'}
                </p>

                {r.projects.length > 0 && (
                  <div className="sk-block">
                    <p className="sk-block-title"><Code2 size={14} /> Projects</p>
                    <ul>
                      {r.projects.map(p => (
                        <li key={p.id}>
                          {p.githubUrl ? (
                            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">{p.title} <ArrowUpRight size={13} /></a>
                          ) : p.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {r.certs.length > 0 && (
                  <div className="sk-block">
                    <p className="sk-block-title"><Award size={14} /> Certificates</p>
                    <ul>
                      {r.certs.map(c => (
                        <li key={c.name}>
                          {c.url ? (
                            <a href={c.url} target="_blank" rel="noopener noreferrer">{c.name} <ArrowUpRight size={13} /></a>
                          ) : <span>{c.name}</span>}
                          <small>{c.issuer} · {c.date}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {r.interns.length > 0 && (
                  <div className="sk-block">
                    <p className="sk-block-title"><Briefcase size={14} /> Experience</p>
                    <ul>
                      {r.interns.map(e => (
                        <li key={e.id}><span>{e.role} — {e.company}</span><small>{e.period}</small></li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>
      </div>

      <style>{`
        .sk{position:relative;z-index:1;background:#0b0b0c;color:#ededed;padding:7rem 0 6rem}
        .sk-wrap{max-width:1240px;margin:0 auto;padding:0 2.2%}
        .sk-head{display:flex;justify-content:space-between;padding-bottom:.8rem;border-bottom:1.5px solid #ededed;
          font-family:'Space Grotesk',sans-serif;font-size:.95rem}
        .sk-lead{margin:3rem 0 3.5rem;max-width:980px;font-family:'Space Grotesk',sans-serif;font-weight:500;
          font-size:clamp(1.6rem,3.2vw,2.9rem);line-height:1.18;letter-spacing:-.03em}
        .sk-lead em{font-style:italic;color:var(--cyan)}

        .sk-grid{display:grid;grid-template-columns:1.45fr 1fr;gap:3rem;align-items:start}
        .sk-group{padding:1.5rem 0 1.6rem;border-top:1px solid rgba(255,255,255,.12)}
        .sk-group:last-of-type{border-bottom:1px solid rgba(255,255,255,.12)}
        .sk-group-head{display:flex;align-items:baseline;gap:1rem;margin-bottom:1.1rem}
        .sk-idx{font-family:'Space Mono',monospace;font-size:.72rem;color:#8a8f98}
        .sk-group-head h3{margin:0;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(1.3rem,2vw,1.7rem);letter-spacing:-.025em}
        .sk-count{margin-left:auto;font-family:'Space Mono',monospace;font-size:.7rem;color:#8a8f98}
        .sk-pills{display:flex;flex-wrap:wrap;gap:.55rem;padding-left:2.1rem}
        .sk-pill{position:relative;display:inline-flex;align-items:flex-start;gap:.25rem;padding:.6rem 1.05rem;border-radius:999px;cursor:pointer;
          border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.02);color:#d4d7dc;
          font-family:'Space Grotesk',sans-serif;font-size:.98rem;transition:background .25s,color .25s,border-color .25s,transform .25s}
        .sk-pill sup{font-family:'Space Mono',monospace;font-size:.58rem;opacity:.6;margin-top:.1rem}
        .sk-pill:hover{border-color:#ededed;transform:translateY(-2px)}
        .sk-pill.on{background:#ededed;color:#0b0b0c;border-color:#ededed}
        .sk-soft{margin:1.6rem 0 0;font-size:.9rem;line-height:1.7;color:#a1a6ae}
        .sk-soft span{font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98;margin-right:.6rem}

        .sk-panel{position:sticky;top:6.5rem;min-height:420px;max-height:calc(100vh - 8rem);overflow-y:auto;scrollbar-width:thin;padding:1.8rem;border-radius:20px;border:1px solid rgba(255,255,255,.1);
          background:radial-gradient(circle at 100% 0%,rgba(0,245,255,.10),transparent 50%),#121214;scroll-margin-top:6rem}
        .sk-label{margin:0;font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98}
        .sk-skill{margin:.4rem 0 1rem;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(1.9rem,3vw,2.6rem);
          letter-spacing:-.04em;line-height:1.05}
        .sk-meter{height:4px;border-radius:2px;background:rgba(255,255,255,.08);overflow:hidden}
        .sk-meter i{display:block;height:100%;border-radius:2px;background:linear-gradient(90deg,var(--cyan),var(--purple));transition:width .5s cubic-bezier(.22,1,.36,1)}
        .sk-summary{margin:.6rem 0 1.4rem;font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.04em;color:#a1a6ae}
        .sk-block{padding-top:1rem;margin-top:1rem;border-top:1px solid rgba(255,255,255,.08)}
        .sk-block-title{display:flex;align-items:center;gap:.4rem;margin:0 0 .6rem;font-family:'Space Mono',monospace;font-size:.66rem;
          letter-spacing:.12em;text-transform:uppercase;color:var(--cyan)}
        .sk-block ul{list-style:none;margin:0;padding:0;display:grid;gap:.55rem}
        .sk-block li{display:flex;flex-direction:column;gap:.1rem;font-size:.95rem}
        .sk-block a{display:inline-flex;align-items:center;gap:.25rem;color:#ededed;text-decoration:none;width:fit-content;
          border-bottom:1px solid rgba(255,255,255,.2);transition:border-color .25s,color .25s}
        .sk-block a:hover{color:var(--cyan);border-color:var(--cyan)}
        .sk-block small{font-size:.76rem;color:#8a8f98}

        @media (max-width:980px){
          .sk-grid{grid-template-columns:1fr}
          .sk-panel{position:relative;top:0;max-height:none}
        }
        @media (max-width:640px){
          .sk{padding:5rem 0 4rem}
          .sk-wrap{padding:0 1.2rem}
          .sk-pills{padding-left:0}
          .sk-pill{font-size:.9rem;padding:.5rem .9rem}
        }
      `}</style>
    </section>
  );
};

export default Skills;
