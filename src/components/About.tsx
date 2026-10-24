import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ArrowRight, Award, GraduationCap, Sparkles } from 'lucide-react';
import { useScrollTo } from '../hooks';
import HowIWork from './HowIWork';
import { awards, certifications, education, experiences, stats, type CertCategory } from '../data';
import { CAT_COLOR } from '../data/certColors';
import { SKILL_COUNT, SKILL_GROUPS } from '../data/skills';
import { Link } from '../router';

const EASE = [0.22, 1, 0.36, 1] as const;
const STATEMENT =
  "I'm Mohamed Abrar, a final-year AI & Data Science student at BSACIST, Chennai. Four freelance clients and five internships in, I've learned one thing: a model only matters once it ships. So I work end to end — from messy data and training runs to the interface people actually use.";

// milestones drawn from education, certificates and internships
const JOURNEY = [
  { when: '2023', title: 'Started B.Tech', text: 'AI & Data Science at BSACIST, Chennai' },
  { when: '2024', title: 'First certifications', text: 'Python, SQL, HackerRank SQL and C (scored 95%)' },
  { when: 'Jan 2025', title: 'First internship', text: 'Agnirva AI programme, 100+ hours hands-on' },
  { when: 'Apr–Jul 2025', title: 'Three internships', text: 'Cognifyz (ML + Data Science) and DP World' },
  { when: 'Mar–May 2026', title: 'Medfits internship', text: 'IT internship, plus GenAI & Deep Learning certifications' },
  { when: 'May–Oct 2026', title: 'Going freelance', text: 'Paid AI web development for APM, Tracole, PABT and RR Events' },
  { when: '2027', title: 'Graduating', text: 'Open to full-time AI / ML roles' },
];

const EXPLORING = ['Agentic AI', 'Deep Learning', 'Generative AI apps', 'Prompt engineering'];
const CERT_SPLIT = (Object.keys(CAT_COLOR) as CertCategory[]).map(cat => ({
  cat, color: CAT_COLOR[cat], n: certifications.filter(c => c.category === cat).length,
}));
const CERT_AREAS = CERT_SPLIT.filter(s => s.n).length;
const DEGREE_START = new Date('2023-08-01').getTime();
const DEGREE_END = new Date('2027-05-31').getTime();

// each word brightens as its slice of the paragraph scrolls past
const Word: React.FC<{ progress: MotionValue<number>; range: [number, number]; children: string }> = ({ progress, range, children }) => {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
};

const Milestone: React.FC<{ progress: MotionValue<number>; at: number; item: typeof JOURNEY[number] }> = ({ progress, at, item }) => {
  const lit = useTransform(progress, [Math.max(0, at - 0.08), at], [0, 1]);
  const opacity = useTransform(lit, [0, 1], [0.35, 1]);
  const scale = useTransform(lit, [0, 1], [0.6, 1]);
  return (
    <motion.li className="ab-mile" style={{ opacity }}>
      <motion.span className="ab-node" style={{ scale }} />
      <span className="ab-when2">{item.when}</span>
      <strong>{item.title}</strong>
      <span className="ab-mile-text">{item.text}</span>
    </motion.li>
  );
};

const Counter: React.FC<{ value: string; start: boolean }> = ({ value, start }) => {
  const target = parseInt(value, 10) || 0;
  const suffix = value.replace(/^\d+/, '');
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 1400);
      setN(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);
  return <>{n}{suffix}</>;
};

const About: React.FC = () => {
  const scrollTo = useScrollTo();
  const statementRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsIn = useInView(statsRef, { once: true, margin: '-60px' });

  const { scrollYProgress } = useScroll({ target: statementRef, offset: ['start 0.85', 'end 0.45'] });
  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: journeyProgress } = useScroll({ target: journeyRef, offset: ['start 0.8', 'end 0.55'] });
  const words = STATEMENT.split(' ');

  const degree = Math.round(Math.min(1, Math.max(0, (Date.now() - DEGREE_START) / (DEGREE_END - DEGREE_START))) * 100);
  const award = awards[0];

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section id="about" className="ab">
      <div className="ab-wrap">
        <motion.div className="ab-head" {...reveal()}>
          <span>(02) — about</span>
          <span>who I am</span>
        </motion.div>

        <p className="ab-statement" ref={statementRef}>
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
          ))}
        </p>

        <div className="ab-stats" ref={statsRef}>
          {stats.map((s, i) => (
            <motion.div key={s.label} {...reveal(i * 0.08)}>
              <strong><Counter value={s.value} start={statsIn} /></strong>
              <span>{s.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div className="ab-sub ab-journey-head" {...reveal()}>
          <h3>The journey so far</h3>
          <span className="ab-mono">2023 → 2027</span>
        </motion.div>
        <div className="ab-journey" ref={journeyRef}>
          <div className="ab-track"><motion.i style={{ scaleX: journeyProgress }} /></div>
          <ol>
            {JOURNEY.map((m, i) => (
              <Milestone key={m.when} progress={journeyProgress} at={i / (JOURNEY.length - 1)} item={m} />
            ))}
          </ol>
        </div>

        <div className="ab-cols">
          {/* internships */}
          <motion.div {...reveal()}>
            <div className="ab-sub">
              <h3>Where I’ve worked <em>({String(experiences.length).padStart(2, '0')})</em></h3>
              <button onClick={() => scrollTo('experience')}>full timeline <ArrowDown size={14} /></button>
            </div>
            <ol className="ab-intern">
              {experiences.map((e, i) => (
                <li key={e.id}>
                  <span className="ab-idx">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ab-co">{e.company}</span>
                  <span className="ab-role">{e.role}</span>
                  <span className="ab-when">{e.period}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* award + degree */}
          <div className="ab-side">
            <motion.div className="ab-card ab-award" {...reveal(0.1)}>
              <span className="ab-ico"><Award size={18} /></span>
              <p className="ab-label">Award · {award.date}</p>
              <h4>{award.title}</h4>
              <p className="ab-muted">{award.org}</p>
              <p className="ab-muted">{award.note}</p>
            </motion.div>
            <motion.div className="ab-card" {...reveal(0.2)}>
              <span className="ab-ico"><GraduationCap size={18} /></span>
              <p className="ab-label">Education · {education.period}</p>
              <h4>B.Tech, AI &amp; Data Science</h4>
              <p className="ab-muted">{education.institution}</p>
              <div className="ab-bar">
                <motion.i initial={{ width: 0 }} whileInView={{ width: `${degree}%` }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }} />
              </div>
              <p className="ab-mono">{degree}% complete · graduating 2027</p>
            </motion.div>
            <motion.div className="ab-card ab-now" {...reveal(0.3)}>
              <span className="ab-ico"><Sparkles size={18} /></span>
              <p className="ab-label"><i className="ab-live" /> Now exploring</p>
              <div className="ab-chips">
                {EXPLORING.map(t => <span key={t}>{t}</span>)}
              </div>
              <p className="ab-mono">from my latest certifications</p>
            </motion.div>
          </div>
        </div>

        {/* how I work */}
        <motion.div className="ab-sub ab-how-head" {...reveal()}>
          <h3>How I work</h3>
          <span className="ab-mono">four habits I bring to every project</span>
        </motion.div>
        <HowIWork />

        {/* skills and certifications live on their own pages */}
        <motion.div className="ab-sub ab-go-head" {...reveal()}>
          <h3>Go deeper</h3>
          <span className="ab-mono">each opens its own page</span>
        </motion.div>
        <div className="ab-go">
          <motion.div {...reveal()}>
            <Link to="/skills" className="ab-go-card">
              <div className="ab-go-top">
                <span className="ab-label">{SKILL_COUNT} skills · {SKILL_GROUPS.length} areas</span>
                <span className="ab-go-arrow"><ArrowRight size={20} /></span>
              </div>
              <h4>Skills <em>with receipts</em></h4>
              <p className="ab-muted">Pick any skill and see the projects, certificates and internships that prove it.</p>
              <div className="ab-go-chips">
                {SKILL_GROUPS.flatMap(g => g.skills).slice(0, 7).map(s => <span key={s.name}>{s.name}</span>)}
              </div>
            </Link>
          </motion.div>
          <motion.div {...reveal(0.1)}>
            <Link to="/certifications" className="ab-go-card cert">
              <div className="ab-go-top">
                <span className="ab-label">{certifications.length} certificates · {CERT_AREAS} areas</span>
                <span className="ab-go-arrow"><ArrowRight size={20} /></span>
              </div>
              <h4>Certifications <em>by year</em></h4>
              <p className="ab-muted">Illinois Tech, Vanderbilt, Microsoft, Anthropic, IIT Bombay, BCG X and more — with links to verify.</p>
              <div className="ab-go-bar" aria-hidden>
                {CERT_SPLIT.map(s => <i key={s.cat} style={{ flex: s.n, background: s.color }} />)}
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        .ab{position:relative;z-index:1;background:#0b0b0c;color:#ededed;padding:7rem 0 6rem}
        .ab-wrap{max-width:1240px;margin:0 auto;padding:0 2.2%}
        .ab-head{display:flex;justify-content:space-between;padding-bottom:.8rem;border-bottom:1.5px solid #ededed;
          font-family:'Space Grotesk',sans-serif;font-size:.95rem}
        .ab-statement{margin:3.2rem 0 4rem;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(1.7rem,3.6vw,3.3rem);
          line-height:1.18;letter-spacing:-.03em;max-width:1100px}

        .ab-stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(255,255,255,.12);border-bottom:1px solid rgba(255,255,255,.12)}
        .ab-stats > div{padding:2rem 1rem 1.8rem 0;border-right:1px solid rgba(255,255,255,.12)}
        .ab-stats > div:last-child{border-right:0}
        .ab-stats > div:not(:first-child){padding-left:1.6rem}
        .ab-stats strong{display:block;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(2.6rem,5vw,4.4rem);line-height:1;
          letter-spacing:-.05em;font-variant-numeric:tabular-nums}
        .ab-stats span{display:block;margin-top:.6rem;font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98}

        .ab-cols{display:grid;grid-template-columns:1.35fr 1fr;gap:3rem;margin-top:4.5rem}
        .ab-sub{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;flex-wrap:wrap;margin-bottom:1.2rem}
        .ab-sub h3{margin:0;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(1.4rem,2.2vw,1.9rem);letter-spacing:-.025em}
        .ab-sub h3 em{font-style:normal;color:#8a8f98;font-size:.6em;vertical-align:super;margin-left:.2rem}
        .ab-sub > button{display:inline-flex;align-items:center;gap:.35rem;background:none;border:0;border-bottom:1px solid currentColor;padding:0 0 .15rem;
          color:#ededed;font-family:'Space Grotesk',sans-serif;font-size:.9rem;cursor:pointer}
        .ab-sub > button:hover{opacity:.6}

        .ab-intern{list-style:none;margin:0;padding:0;border-top:1px solid rgba(255,255,255,.12)}
        .ab-intern li{position:relative;display:grid;grid-template-columns:2.6rem 1.2fr 1.3fr auto;gap:1rem;align-items:baseline;padding:1.15rem .4rem;
          border-bottom:1px solid rgba(255,255,255,.12);overflow:hidden;transition:color .35s}
        .ab-intern li::before{content:'';position:absolute;inset:0;background:#ededed;transform:scaleY(0);transform-origin:bottom;
          transition:transform .45s cubic-bezier(.22,1,.36,1);z-index:0}
        .ab-intern li:hover{color:#0b0b0c}
        .ab-intern li:hover::before{transform:scaleY(1)}
        .ab-intern li > *{position:relative;z-index:1}
        .ab-idx{font-family:'Space Mono',monospace;font-size:.72rem;opacity:.6}
        .ab-co{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:1.15rem;letter-spacing:-.01em}
        .ab-role{font-size:.92rem;opacity:.8}
        .ab-when{font-family:'Space Mono',monospace;font-size:.7rem;opacity:.7;white-space:nowrap}

        .ab-side{display:grid;gap:1rem;align-content:start;margin-top:3.1rem}
        .ab-card{position:relative;padding:1.5rem;border-radius:18px;border:1px solid rgba(255,255,255,.1);background:#121214}
        .ab-award{background:radial-gradient(circle at 90% 0%,rgba(242,200,17,.14),transparent 55%),#121214}
        .ab-ico{position:absolute;top:1.3rem;right:1.3rem;width:36px;height:36px;border-radius:10px;display:grid;place-items:center;
          background:rgba(255,255,255,.06);color:#ededed}
        .ab-award .ab-ico{background:#f2c811;color:#111}
        .ab-label{margin:0 0 .5rem;font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98}
        .ab-card h4{margin:0 0 .4rem;padding-right:2.6rem;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:1.15rem;letter-spacing:-.01em}
        .ab-muted{margin:.2rem 0 0;font-size:.86rem;line-height:1.55;color:#a1a6ae}
        .ab-mono{margin:.4rem 0 0;font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.06em;color:#8a8f98}
        .ab-bar{height:5px;margin-top:1rem;border-radius:3px;background:rgba(255,255,255,.08);overflow:hidden}
        .ab-bar i{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,var(--cyan),var(--purple))}

        .ab-go-head{margin-top:5rem;padding-bottom:1.2rem;border-bottom:1px solid rgba(255,255,255,.12)}
        .ab-go{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-top:1.6rem}
        .ab-go > div{height:100%}
        .ab-go-card{position:relative;height:100%;display:flex;flex-direction:column;gap:.8rem;padding:1.8rem;border-radius:20px;
          border:1px solid rgba(255,255,255,.1);color:#ededed;text-decoration:none;overflow:hidden;
          background:radial-gradient(circle at 100% 0%,rgba(0,245,255,.12),transparent 55%),#121214;
          transition:border-color .35s,transform .45s cubic-bezier(.22,1,.36,1)}
        .ab-go-card.cert{background:radial-gradient(circle at 100% 0%,rgba(155,89,255,.16),transparent 55%),#121214}
        .ab-go-card:hover{border-color:rgba(255,255,255,.32);transform:translateY(-4px)}
        .ab-go-top{display:flex;justify-content:space-between;align-items:center;gap:1rem}
        .ab-go-top .ab-label{margin:0}
        .ab-go-arrow{width:44px;height:44px;flex:none;border-radius:50%;display:grid;place-items:center;background:#ededed;color:#0b0b0c;
          transition:transform .45s cubic-bezier(.22,1,.36,1),background .3s}
        .ab-go-card:hover .ab-go-arrow{transform:rotate(-45deg);background:var(--cyan)}
        .ab-go-card h4{margin:1.2rem 0 0;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(2rem,3.6vw,3rem);
          letter-spacing:-.045em;line-height:1}
        .ab-go-card h4 em{font-style:italic;color:var(--cyan)}
        .ab-go-card.cert h4 em{color:#b48cff}
        .ab-go-card .ab-muted{max-width:440px;font-size:.95rem}
        .ab-go-chips{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:auto;padding-top:.6rem}
        .ab-go-chips span{padding:.35rem .75rem;border-radius:999px;border:1px solid rgba(255,255,255,.14);font-size:.8rem;color:#d4d7dc}
        .ab-go-bar{display:flex;gap:3px;height:8px;margin-top:auto;padding-top:0;border-radius:4px;overflow:hidden}
        .ab-go-bar i{display:block;height:8px;border-radius:2px}


        .ab-journey-head{margin-top:4.5rem}
        .ab-journey{position:relative;margin-top:1.4rem}
        .ab-track{position:absolute;left:0;right:0;top:7px;height:2px;background:rgba(255,255,255,.1)}
        .ab-track i{display:block;height:100%;transform-origin:left;background:linear-gradient(90deg,var(--cyan),var(--purple))}
        .ab-journey ol{position:relative;list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(7,1fr);gap:1.2rem}
        .ab-mile{display:flex;flex-direction:column;gap:.35rem;padding-top:1.9rem;position:relative}
        .ab-node{position:absolute;top:0;left:0;width:16px;height:16px;border-radius:50%;background:#0b0b0c;border:2px solid var(--cyan);
          box-shadow:0 0 14px rgba(0,245,255,.6)}
        .ab-when2{font-family:'Space Mono',monospace;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--cyan)}
        .ab-mile strong{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:1.05rem;letter-spacing:-.01em}
        .ab-mile-text{font-size:.84rem;line-height:1.5;color:#a1a6ae}

        .ab-now{background:radial-gradient(circle at 90% 0%,rgba(155,89,255,.16),transparent 55%),#121214}
        .ab-now .ab-label{display:flex;align-items:center;gap:.45rem}
        .ab-live{width:7px;height:7px;border-radius:50%;background:#3ddc97;animation:ab-ping 2s infinite}
        .ab-chips{display:flex;flex-wrap:wrap;gap:.45rem;margin:.3rem 0 .2rem;padding-right:2.4rem}
        .ab-chips span{padding:.35rem .75rem;border-radius:999px;border:1px solid rgba(155,89,255,.35);background:rgba(155,89,255,.08);
          font-size:.82rem;color:#e4dcff}

        .ab-how-head{margin-top:5rem}
        @keyframes ab-ping{0%{box-shadow:0 0 0 0 rgba(61,220,151,.6)}80%,100%{box-shadow:0 0 0 8px rgba(61,220,151,0)}}

        @media (max-width:980px){
          .ab-journey ol{grid-template-columns:repeat(3,1fr);row-gap:2rem}
          .ab-track{display:none}
        }
        @media (max-width:640px){
          .ab-journey ol{grid-template-columns:1fr;row-gap:1.4rem;padding-left:1.4rem;border-left:2px solid rgba(255,255,255,.1)}
          .ab-mile{padding-top:0}
          .ab-node{left:calc(-1.4rem - 9px);top:2px}
        }
        @media (max-width:980px){
          .ab-cols{grid-template-columns:1fr}
          .ab-side{margin-top:0;grid-template-columns:1fr 1fr}
          .ab-go{grid-template-columns:1fr}
        }
        @media (max-width:640px){
          .ab{padding:5rem 0 4rem}
          .ab-wrap{padding:0 1.2rem}
          .ab-stats{grid-template-columns:1fr 1fr}
          .ab-stats > div{padding:1.4rem .8rem 1.3rem 0!important}
          .ab-stats > div:nth-child(2){border-right:0}
          .ab-stats > div:nth-child(-n+2){border-bottom:1px solid rgba(255,255,255,.12)}
          .ab-stats > div:nth-child(even){padding-left:1rem!important}
          .ab-intern li{grid-template-columns:2rem 1fr;row-gap:.2rem}
          .ab-role{grid-column:2}
          .ab-when{grid-column:2}
          .ab-side{grid-template-columns:1fr}
          .ab-go-card{padding:1.4rem}
        }
      `}</style>
    </section>
  );
};

export default About;
