import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { receiptsFor, SKILL_COUNT, SKILL_GROUPS, SOFT_SKILLS, type Skill } from '../data/skills';
import { Link } from '../router';

const EASE = [0.22, 1, 0.36, 1] as const;
const LINE_TIME = 0.075; // seconds the printer spends on each line

// barcode bars derived from the skill name, so each receipt gets its own stable code
const barcode = (text: string) =>
  Array.from({ length: 64 }, (_, i) => 1 + ((text.charCodeAt(i % text.length) * (i + 7)) % 4));

const printedAt = () =>
  new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });

interface Entry { skill: Skill; code: string; proofs: number }

// The paper grows out of the slot in small jerky steps, one line at a time, like a thermal printer.
const Receipt: React.FC<{ entry: Entry; onPrinted: () => void }> = ({ entry, onPrinted }) => {
  const { skill, code } = entry;
  const r = receiptsFor(skill);
  const total = r.projects.length + r.certs.length + r.interns.length;
  const [stamp] = useState(printedAt);
  const sections: { title: string; items: { label: string; sub?: string; href?: string }[] }[] = [
    {
      title: 'Projects',
      items: r.projects.map(p => ({ label: p.title, href: p.liveUrl ?? (p.privateRepo ? undefined : p.githubUrl) })),
    },
    { title: 'Certificates', items: r.certs.map(c => ({ label: c.name, sub: `${c.issuer} · ${c.date}`, href: c.url })) },
    { title: 'Experience', items: r.interns.map(e => ({ label: e.company, sub: `${e.role} · ${e.period}` })) },
  ];
  const lines = 12 + sections.reduce((n, s) => n + 1 + Math.max(1, s.items.length) * 1.6, 0);
  const steps = Math.round(lines);

  return (
    <motion.div
      className="rc-feed"
      initial={{ height: 0 }}
      animate={{ height: 'auto', transition: { duration: steps * LINE_TIME, ease: (t: number) => Math.ceil(t * steps) / steps } }}
      exit={{ y: 90, rotate: -7, opacity: 0, transition: { duration: 0.38, ease: [0.55, 0, 1, 0.45] } }}
      onAnimationComplete={def => { if (typeof def === 'object' && 'height' in def) onPrinted(); }}
    >
      <div className="rc">
        <div className="rc-top">
          <span className="rc-logo">abrar<span>.</span></span>
          <span>No. {code}</span>
        </div>
        <p className="rc-meta"><span>Chennai, IN</span><span>{stamp} IST</span></p>
        <p className="rc-kicker">*** Proof of skill ***</p>
        <h2 className="rc-skill">{skill.name}</h2>
        {skill.note && <p className="rc-note">({skill.note})</p>}
        <hr />
        {sections.map(s => (
          <div key={s.title} className="rc-sec">
            <p className="rc-row rc-head"><span>{s.title}</span><span>x{String(s.items.length).padStart(2, '0')}</span></p>
            {s.items.length === 0 && <p className="rc-none">— none listed</p>}
            {s.items.map(it => (
              <div key={`${it.label}|${it.sub ?? ''}`} className="rc-item">
                {it.href ? (
                  <a href={it.href} target="_blank" rel="noopener noreferrer"><span>{it.label}</span><i /><ArrowUpRight size={12} /></a>
                ) : (
                  <p><span>{it.label}</span></p>
                )}
                {it.sub && <small>{it.sub}</small>}
              </div>
            ))}
          </div>
        ))}
        <hr />
        <p className="rc-row rc-total"><span>Total proofs</span><span>{total}</span></p>
        <div className="rc-bars" aria-hidden>
          {barcode(skill.name).map((w, i) => <i key={i} style={{ width: w, marginRight: i % 3 === 0 ? 3 : 2 }} />)}
        </div>
        <p className="rc-thanks">Thanks for checking the receipts</p>
      </div>
    </motion.div>
  );
};

const SkillsPage: React.FC = () => {
  const [active, setActive] = useState('Python');
  const [job, setJob] = useState(0);
  const [status, setStatus] = useState<'printing' | 'ready'>('printing');
  const sideRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  // the first receipt only starts printing once the machine scrolls into view
  const started = useInView(sideRef, { once: true, margin: '-120px' });

  const index = useMemo(() => {
    const out: Record<string, Entry> = {};
    SKILL_GROUPS.forEach((g, gi) => g.skills.forEach((s, si) => {
      const r = receiptsFor(s);
      out[s.name] = {
        skill: s,
        code: `${String(gi + 1).padStart(2, '0')}-${String(si + 1).padStart(2, '0')}`,
        proofs: r.projects.length + r.certs.length + r.interns.length,
      };
    }));
    return out;
  }, []);
  const current = index[active];

  const print = (name: string) => {
    setActive(name);
    setJob(j => j + 1);
    setStatus('printing');
    outRef.current?.scrollTo({ top: 0 });
  };
  const pick = (name: string) => {
    print(name);
    // on narrow screens the printer sits below the list, so bring it into view on tap
    if (window.innerWidth < 980) sideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <main className="skp">
      <div className="skp-wrap">
        <motion.div className="skp-crumb" {...reveal()}>
          <Link to="/"><ArrowLeft size={14} /> Back home</Link>
          <span>{SKILL_COUNT} skills · {SKILL_GROUPS.length} areas</span>
        </motion.div>

        <h1 className="skp-title">
          <span className="skp-mask">
            <motion.span initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease: EASE }}>Skills</motion.span>
          </span>
          <span className="skp-mask">
            <motion.span initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}>
              <em>come with receipts.</em>
            </motion.span>
          </span>
        </h1>
        <motion.p className="skp-lead" {...reveal(0.2)}>
          Anyone can list skills. Pick one below and the machine prints a receipt of the projects, certificates and internships that prove it.
        </motion.p>

        <motion.nav className="skp-areas" aria-label="Skill areas" {...reveal(0.25)}>
          {SKILL_GROUPS.map((g, gi) => (
            <a key={g.title} href={`#area-${gi}`} onClick={e => {
              e.preventDefault();
              const el = document.getElementById(`area-${gi}`);
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
            }}>
              <sup>{String(gi + 1).padStart(2, '0')}</sup>{g.title}<span>{g.skills.length}</span>
            </a>
          ))}
        </motion.nav>

        <div className="skp-grid">
          <div className="skp-list">
            {SKILL_GROUPS.map((g, gi) => (
              <motion.section key={g.title} id={`area-${gi}`} className="skp-area" {...reveal()}>
                <div className="skp-area-head">
                  <span className="skp-num">{String(gi + 1).padStart(2, '0')}</span>
                  <h2>{g.title}</h2>
                </div>
                <ul>
                  {g.skills.map(s => {
                    const { proofs } = index[s.name];
                    const on = active === s.name;
                    return (
                      <li key={s.name}>
                        <button className={`skp-row${on ? ' on' : ''}`} aria-pressed={on} onClick={() => pick(s.name)}>
                          <span className="skp-name">{s.name}{s.note && <small>{s.note}</small>}</span>
                          <span className="skp-count">{proofs} {proofs === 1 ? 'proof' : 'proofs'}</span>
                          <span className="skp-print">Print</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.section>
            ))}
            <motion.p className="skp-soft" {...reveal()}>
              <span>Also</span>{SOFT_SKILLS.join(' · ')}
            </motion.p>
          </div>

          <aside className="skp-side" ref={sideRef} aria-live="polite">
            <div className={`pm${status === 'printing' && started ? ' busy' : ''}`}>
              <div className="pm-head">
                <span className="pm-brand">ABRAR<b>·</b>POS <small>TP-27</small></span>
                <span className="pm-led" aria-hidden />
              </div>
              <div className="pm-body">
                <div className="pm-screen">
                  <span>{!started ? 'READY' : status === 'printing' ? 'PRINTING' : 'DONE'}</span>
                  <span>{!started ? 'SELECT A SKILL' : status === 'printing' ? `${current.code} …` : `${current.proofs} PROOFS`}</span>
                </div>
                <button className="pm-feed" onClick={() => print(active)} disabled={status === 'printing'} aria-label={`Print the ${active} receipt again`}>
                  Feed
                </button>
              </div>
              <div className="pm-slot" aria-hidden><i /></div>
            </div>
            <div className="pm-out" ref={outRef}>
              <AnimatePresence mode="wait">
                {started && (
                  <Receipt
                    key={`${active}-${job}`}
                    entry={current}
                    onPrinted={() => setStatus('ready')}
                  />
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>

        <motion.div className="skp-next" {...reveal()}>
          <Link to="/certifications" className="skp-next-card">
            <span className="skp-next-label">Next page</span>
            <span className="skp-next-title">Certifications <ArrowRight size={28} /></span>
          </Link>
          <Link to="/#projects" className="skp-next-card">
            <span className="skp-next-label">See them in action</span>
            <span className="skp-next-title">Projects <ArrowRight size={28} /></span>
          </Link>
        </motion.div>
      </div>

      <style>{`
        .skp{position:relative;z-index:1;min-height:100vh;background:#0b0b0c;color:#ededed;padding:8.5rem 0 6rem}
        .skp-wrap{max-width:1240px;margin:0 auto;padding:0 2.2%}
        .skp-crumb{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding-bottom:.8rem;border-bottom:1.5px solid #ededed;
          font-family:'Space Mono',monospace;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#a1a6ae}
        .skp-crumb a{display:inline-flex;align-items:center;gap:.4rem;min-height:44px;color:#ededed;text-decoration:none}
        .skp-crumb a:hover{color:var(--cyan)}

        .skp-title{margin:2.6rem 0 0;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(3.4rem,10vw,9.5rem);
          line-height:.92;letter-spacing:-.055em}
        .skp-mask{display:block;overflow:hidden;padding-bottom:.08em}
        .skp-mask > span{display:block}
        .skp-title em{font-style:italic;font-weight:400;color:var(--cyan)}
        .skp-lead{margin:1.8rem 0 0;max-width:620px;font-size:1.15rem;line-height:1.6;color:#a1a6ae}

        .skp-areas{display:flex;flex-wrap:wrap;gap:.5rem;margin:3rem 0 3.5rem}
        .skp-areas a{display:inline-flex;gap:.35rem;min-height:44px;align-items:center;padding:0 1.05rem;border-radius:999px;
          border:1px solid rgba(255,255,255,.14);color:#d4d7dc;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:.95rem;
          transition:border-color .25s,background .25s,color .25s}
        .skp-areas a:hover{border-color:#ededed;background:#ededed;color:#0b0b0c}
        .skp-areas sup{font-family:'Space Mono',monospace;font-size:.58rem;opacity:.6}
        .skp-areas a > span{font-family:'Space Mono',monospace;font-size:.7rem;opacity:.6;margin-left:.2rem}

        .skp-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:4rem;align-items:start}
        .skp-area{padding-bottom:2.6rem}
        .skp-area-head{display:flex;align-items:baseline;gap:1rem;padding-bottom:.9rem;border-bottom:1px solid rgba(255,255,255,.12)}
        .skp-num{font-family:'Space Mono',monospace;font-size:.75rem;color:var(--cyan)}
        .skp-area-head h2{margin:0;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(1.6rem,2.6vw,2.2rem);letter-spacing:-.035em}
        .skp-area ul{list-style:none;margin:0;padding:0}
        .skp-row{position:relative;width:100%;display:grid;grid-template-columns:minmax(0,1fr) 5.2rem 3.6rem;gap:1.1rem;align-items:center;
          padding:1rem .6rem;background:none;border:0;border-bottom:1px solid rgba(255,255,255,.08);color:#d4d7dc;text-align:left;cursor:pointer;
          transition:color .3s,padding .4s cubic-bezier(.22,1,.36,1)}
        .skp-row::before{content:'';position:absolute;left:0;top:50%;width:6px;height:6px;margin-top:-3px;border-radius:50%;background:var(--cyan);
          transform:scale(0);transition:transform .35s cubic-bezier(.22,1,.36,1)}
        .skp-row:hover,.skp-row.on{color:#fff;padding-left:1.4rem}
        .skp-row.on::before{transform:scale(1)}
        .skp-name{font-family:'Space Grotesk',sans-serif;font-size:1.15rem;letter-spacing:-.01em}
        .skp-name small{margin-left:.6rem;font-family:'Space Mono',monospace;font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;color:#8a8f98}
        .skp-count{font-family:'Space Mono',monospace;font-size:.68rem;letter-spacing:.06em;color:#8a8f98;text-align:right}
        .skp-print{justify-self:end;padding:.25rem .55rem;border-radius:999px;border:1px solid rgba(255,255,255,.2);
          font-family:'Space Mono',monospace;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:#a1a6ae;
          opacity:0;transform:translateX(-6px);transition:opacity .3s,transform .3s,background .3s,color .3s}
        .skp-row:hover .skp-print,.skp-row:focus-visible .skp-print{opacity:1;transform:none}
        .skp-row.on .skp-print{opacity:1;transform:none;background:var(--cyan);border-color:var(--cyan);color:#0b0b0c}
        .skp-soft{margin:.6rem 0 0;font-size:.95rem;line-height:1.7;color:#a1a6ae}
        .skp-soft span{font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98;margin-right:.8rem}

        /* the receipt printer */
        .skp-side{position:sticky;top:6rem;scroll-margin-top:6rem}
        .pm{position:relative;z-index:2;padding:.9rem 1.1rem 0;border-radius:22px 22px 14px 14px;
          background:linear-gradient(180deg,#2a2a30 0%,#1b1b20 55%,#141418 100%);
          border:1px solid rgba(255,255,255,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 24px 50px rgba(0,0,0,.55)}
        .pm-head{display:flex;justify-content:space-between;align-items:center}
        .pm-brand{font-family:'Space Mono',monospace;font-weight:700;font-size:.72rem;letter-spacing:.18em;color:#cfd2d8}
        .pm-brand b{color:var(--cyan)}
        .pm-brand small{margin-left:.5rem;font-weight:400;font-size:.6rem;letter-spacing:.1em;color:#6f737b}
        .pm-led{width:9px;height:9px;border-radius:50%;background:#3ddc97;box-shadow:0 0 10px #3ddc97}
        .pm.busy .pm-led{background:#f2a33a;box-shadow:0 0 12px #f2a33a;animation:pm-blink .45s steps(2) infinite}
        .pm-body{display:flex;align-items:center;gap:.8rem;margin-top:.75rem}
        .pm-screen{flex:1;display:flex;justify-content:space-between;gap:1rem;padding:.55rem .75rem;border-radius:8px;
          background:#0d1a14;border:1px solid #0a120e;box-shadow:inset 0 2px 6px rgba(0,0,0,.7);
          font-family:'Space Mono',monospace;font-size:.68rem;letter-spacing:.12em;color:#7dffb5;text-shadow:0 0 6px rgba(125,255,181,.55)}
        .pm.busy .pm-screen span:first-child{animation:pm-blink 1s steps(2) infinite}
        .pm-feed{min-height:36px;padding:0 .9rem;border-radius:8px;border:1px solid rgba(255,255,255,.14);cursor:pointer;
          background:linear-gradient(180deg,#34343b,#24242a);color:#cfd2d8;font-family:'Space Mono',monospace;font-size:.62rem;
          letter-spacing:.16em;text-transform:uppercase;box-shadow:0 2px 0 #0e0e11;transition:transform .1s,box-shadow .1s,color .2s}
        .pm-feed:hover:not(:disabled){color:var(--cyan)}
        .pm-feed:active:not(:disabled){transform:translateY(2px);box-shadow:0 0 0 #0e0e11}
        .pm-feed:disabled{opacity:.45;cursor:wait}
        .pm-slot{position:relative;height:22px;margin:.9rem -1.1rem 0;border-radius:0 0 14px 14px;background:linear-gradient(180deg,#1b1b20,#101013)}
        .pm-slot i{position:absolute;left:7%;right:7%;top:8px;height:6px;border-radius:3px;background:#030304;box-shadow:inset 0 2px 3px rgba(0,0,0,.9)}
        .pm-out{position:relative;z-index:1;margin:-12px 7.5% 0;max-height:calc(100vh - 6rem - 150px);overflow-y:auto;overflow-x:hidden;
          scrollbar-width:none;padding-bottom:12px}
        .pm-out::-webkit-scrollbar{display:none}

        .rc-feed{overflow:hidden;transform-origin:top center}
        .rc{position:relative;padding:1.5rem 1.3rem 2rem;background:#f3f1ea;color:#121212;
          font-family:'Space Mono',monospace;font-size:.74rem;line-height:1.45;
          background-image:linear-gradient(180deg,rgba(0,0,0,.18),transparent 18px);
          -webkit-mask:conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/14px 100%;
          mask:conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/14px 100%}
        .rc-top{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;font-size:.66rem;color:#55534e}
        .rc-logo{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:1.1rem;letter-spacing:-.04em;color:#121212}
        .rc-logo span{color:#0aa3ab}
        .rc-meta{display:flex;justify-content:space-between;margin:.3rem 0 0;font-size:.62rem;color:#55534e}
        .rc-kicker{margin:1rem 0 .15rem;font-size:.64rem;letter-spacing:.14em;text-transform:uppercase;text-align:center;color:#55534e}
        .rc-skill{margin:0;text-align:center;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:clamp(1.5rem,2.4vw,2.1rem);
          letter-spacing:-.04em;line-height:1.05}
        .rc-note{margin:.2rem 0 0;text-align:center;font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;color:#55534e}
        .rc hr{margin:.9rem 0;border:0;border-top:1.5px dashed rgba(18,18,18,.35)}
        .rc-sec + .rc-sec{margin-top:.8rem}
        .rc-row{display:flex;justify-content:space-between;gap:1rem;margin:0}
        .rc-head{font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:.68rem}
        .rc-none{margin:.2rem 0 0;color:#55534e}
        .rc-item{margin-top:.3rem}
        .rc-item a,.rc-item p{display:flex;align-items:center;gap:.4rem;margin:0;color:#121212;text-decoration:none}
        .rc-item a span,.rc-item p span{flex:none;max-width:85%}
        .rc-item a i{flex:1;align-self:flex-end;margin-bottom:.35em;border-bottom:1.5px dotted rgba(18,18,18,.35)}
        .rc-item a:hover span{text-decoration:underline}
        .rc-item small{display:block;font-size:.64rem;color:#55534e}
        .rc-total{font-weight:700;font-size:.82rem;text-transform:uppercase;letter-spacing:.08em}
        .rc-bars{display:flex;align-items:stretch;height:40px;margin-top:1rem;overflow:hidden}
        .rc-bars i{flex:none;display:block;background:#121212}
        .rc-thanks{margin:.6rem 0 0;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;text-align:center;color:#55534e}
        @keyframes pm-blink{50%{opacity:.25}}

        .skp-next{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-top:5rem}
        .skp-next-card{display:flex;flex-direction:column;gap:1.2rem;padding:1.8rem;border-radius:20px;border:1px solid rgba(255,255,255,.1);
          background:#121214;color:#ededed;text-decoration:none;transition:border-color .3s,background .3s}
        .skp-next-card:hover{border-color:rgba(255,255,255,.3);background:#17171a}
        .skp-next-label{font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98}
        .skp-next-title{display:flex;justify-content:space-between;align-items:center;font-family:'Space Grotesk',sans-serif;font-weight:500;
          font-size:clamp(1.8rem,3.4vw,2.8rem);letter-spacing:-.045em}
        .skp-next-title svg{transition:transform .4s cubic-bezier(.22,1,.36,1)}
        .skp-next-card:hover .skp-next-title svg{transform:translateX(6px)}

        @media (max-width:980px){
          .skp-grid{grid-template-columns:1fr;gap:2.5rem}
          .skp-side{position:relative;top:0}
          .pm-out{max-height:none}
        }
        @media (max-width:640px){
          .skp{padding:7rem 0 4rem}
          .skp-wrap{padding:0 1.2rem}
          .skp-row{grid-template-columns:minmax(0,1fr) auto auto;gap:1rem}
          .skp-print{opacity:1;transform:none}
          .skp-next{grid-template-columns:1fr}
          .pm-out{margin:-12px 4% 0}
          .rc{padding:1.3rem 1.1rem 1.8rem}
        }
        @media (prefers-reduced-motion:reduce){ .pm-led,.pm-screen span{animation:none!important} }
      `}</style>
    </main>
  );
};

export default SkillsPage;
