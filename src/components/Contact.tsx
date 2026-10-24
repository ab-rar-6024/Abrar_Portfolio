import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, MessageCircle, MessageCircleMore, Phone, Send } from 'lucide-react';
import { personalInfo } from '../data';
import DotMatrix from './DotMatrix';

const EASE = [0.22, 1, 0.36, 1] as const;
const TOPICS = ['Freelance project', 'Internship', 'Full-time role', 'Just saying hi'];
const WHATSAPP = personalInfo.phone.replace(/\D/g, '');

// one icon per channel: shown on its card and drawn in dots on hover
const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  email: <Mail size={28} strokeWidth={2.25} />,
  phone: <Phone size={28} strokeWidth={2.25} />,
  whatsapp: <MessageCircleMore size={28} strokeWidth={2.25} />,
  linkedin: <Linkedin size={28} strokeWidth={2.25} />,
  github: <Github size={28} strokeWidth={2.25} />,
};

const istTime = () =>
  new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });

interface Form { name: string; email: string; message: string }

const Contact: React.FC = () => {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [form, setForm] = useState<Form>({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState(istTime);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // the message box grows with its text (no drag handle), up to a cap where it scrolls instead
  useEffect(() => {
    const el = messageRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 260)}px`;
  }, [form.message]);

  useEffect(() => {
    const id = setInterval(() => setTime(istTime()), 15_000);
    return () => clearInterval(id);
  }, []);

  const errors = {
    name: !form.name.trim() ? 'Tell me your name' : '',
    email: !/^\S+@\S+\.\S+$/.test(form.email) ? 'A valid email so I can reply' : '',
    message: form.message.trim().length < 10 ? 'A few words about what you need' : '',
  };
  const valid = !errors.name && !errors.email && !errors.message;

  // the site has no backend, so messages go out through the visitor's own email app or WhatsApp
  const body = () => `Hi Abrar,\n\n${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`;
  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    const subject = `${topic} — from ${form.name.trim()}`;
    window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body())}`;
  };
  const sendWhatsApp = () => {
    setTouched(true);
    if (!valid) return;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`[${topic}] ${body()}`)}`, '_blank', 'noopener,noreferrer');
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked: the mailto link still works */ }
  };

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const [hovered, setHovered] = useState<string | null>(null);
  const channels = [
    { id: 'email', kicker: 'Direct inquiries', label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { id: 'phone', kicker: 'Call me', label: 'Phone', value: personalInfo.phone, href: `tel:+${WHATSAPP}` },
    { id: 'whatsapp', kicker: 'Quick chat', label: 'WhatsApp', value: 'Message me directly', href: `https://wa.me/${WHATSAPP}` },
    { id: 'linkedin', kicker: 'Professional network', label: 'LinkedIn', value: personalInfo.linkedinHandle, href: personalInfo.linkedin },
    { id: 'github', kicker: 'Open source', label: 'GitHub', value: personalInfo.githubHandle, href: personalInfo.github },
  ];

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section id="contact" className="ct">
      <div className="ct-wrap">
        <motion.div className="ct-head" {...reveal()}>
          <span>(06) — contact</span>
          <span>let’s build something</span>
        </motion.div>

        <h2 className="ct-title">
          {['Got an idea?', 'Let’s talk.'].map((line, i) => (
            <span key={line} className="ct-mask">
              <motion.span
                initial={{ y: '105%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: EASE, delay: i * 0.12 }}
                className={i === 1 ? 'ct-accent' : ''}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.div className="ct-mail-row" {...reveal(0.2)}>
          <a href={`mailto:${personalInfo.email}`} className="ct-mail">{personalInfo.email}</a>
          <button className="ct-copy" onClick={copyEmail} aria-label="Copy email address">
            {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}
          </button>
        </motion.div>

        <motion.div className="ct-status" {...reveal(0.3)}>
          <span><i /> Available for internships, freelance &amp; full-time roles</span>
          <span>Chennai, IN · {time} IST</span>
        </motion.div>

        {/* direct channels: hovering a card redraws the dot display as that channel's icon */}
        <div className="ct-reach">
          <motion.div className="ct-reach-side" {...reveal()}>
            <h3 className="ct-reach-title">Stay in <span>touch.</span></h3>
            <DotMatrix icons={CHANNEL_ICONS} active={hovered} idleText="HI" />
          </motion.div>
          <ul className="ct-cards">
            {channels.map((c, i) => (
              <motion.li key={c.id} {...reveal(i * 0.06)}>
                <a
                  className="ct-card"
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(c.id)}
                  onBlur={() => setHovered(null)}
                >
                  <span className="ct-card-ico">{CHANNEL_ICONS[c.id]}</span>
                  <span className="ct-card-text">
                    <small>{c.kicker}</small>
                    <strong>{c.label}</strong>
                    <span className="ct-card-value">{c.value}</span>
                  </span>
                  <span className="ct-card-go" aria-hidden><ArrowUpRight size={22} /></span>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="ct-grid">
          <motion.div className="ct-form-intro" {...reveal()}>
            <h3>Or send a <span>message.</span></h3>
            <p>Pick a topic, add a few lines, and it opens in your email app or WhatsApp ready to send.</p>
          </motion.div>

          {/* form */}
          <motion.form className="ct-form" onSubmit={sendEmail} noValidate {...reveal()}>
            <p className="ct-label">I want to talk about</p>
            <div className="ct-topics" role="radiogroup" aria-label="Topic">
              {TOPICS.map(t => (
                <button type="button" key={t} role="radio" aria-checked={topic === t}
                  className={topic === t ? 'on' : ''} onClick={() => setTopic(t)}>
                  {t}
                </button>
              ))}
            </div>

            <div className="ct-fields">
              <label className={touched && errors.name ? 'err' : ''}>
                <span>Your name</span>
                <input value={form.name} onChange={set('name')} autoComplete="name" placeholder="Jane Doe" />
                {touched && errors.name && <small>{errors.name}</small>}
              </label>
              <label className={touched && errors.email ? 'err' : ''}>
                <span>Your email</span>
                <input type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="jane@company.com" />
                {touched && errors.email && <small>{errors.email}</small>}
              </label>
              <label className={`full${touched && errors.message ? ' err' : ''}`}>
                <span>Message</span>
                <textarea ref={messageRef} rows={4} value={form.message} onChange={set('message')} placeholder="Tell me about the project, role or idea…" />
                {touched && errors.message && <small>{errors.message}</small>}
              </label>
            </div>

            <div className="ct-actions">
              <button type="submit" className="ct-btn solid">
                <Send size={16} /> Send via email
              </button>
              <button type="button" className="ct-btn" onClick={sendWhatsApp}>
                <MessageCircle size={16} /> Send on WhatsApp
              </button>
            </div>
            <p className="ct-note">Opens your email app or WhatsApp with the message ready to send.</p>
          </motion.form>
        </div>
      </div>

      <style>{`
        .ct{position:relative;z-index:1;background:#0b0b0c;color:#ededed;padding:7rem 0 6rem}
        .ct-wrap{max-width:1240px;margin:0 auto;padding:0 2.2%}
        .ct-head{display:flex;justify-content:space-between;padding-bottom:.8rem;border-bottom:1.5px solid #ededed;
          font-family:'Space Grotesk',sans-serif;font-size:.95rem}
        .ct-title{margin:3rem 0 0;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(3.2rem,9vw,8.5rem);
          line-height:.95;letter-spacing:-.05em}
        .ct-mask{display:block;overflow:hidden;padding-bottom:.06em}
        .ct-mask > span{display:block}
        .ct-accent{color:var(--cyan)}

        .ct-mail-row{display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap;margin-top:2.2rem}
        .ct-mail{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:clamp(1.3rem,3vw,2.4rem);letter-spacing:-.03em;
          color:#ededed;text-decoration:none;background:linear-gradient(var(--cyan),var(--cyan)) 0 100%/0 2px no-repeat;
          padding-bottom:.15rem;transition:background-size .5s cubic-bezier(.22,1,.36,1),color .3s;word-break:break-all}
        .ct-mail:hover{background-size:100% 2px;color:var(--cyan)}
        .ct-copy{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem 1rem;border-radius:999px;border:1px solid rgba(255,255,255,.2);
          background:none;color:#ededed;font-family:'Space Mono',monospace;font-size:.72rem;cursor:pointer;transition:background .25s,color .25s}
        .ct-copy:hover{background:#ededed;color:#0b0b0c}
        .ct-status{display:flex;justify-content:space-between;flex-wrap:wrap;gap:.8rem;margin:2.4rem 0 3.5rem;padding:1rem 0;
          border-top:1px solid rgba(255,255,255,.12);border-bottom:1px solid rgba(255,255,255,.12);
          font-family:'Space Mono',monospace;font-size:.72rem;letter-spacing:.06em;color:#a1a6ae}
        .ct-status span:first-child{display:flex;align-items:center;gap:.55rem;color:#ededed}
        .ct-status i{width:7px;height:7px;border-radius:50%;background:#3ddc97;animation:ct-ping 2s infinite}

        .ct-grid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.4fr);gap:4rem;align-items:start}
        .ct-label{margin:0 0 .8rem;font-family:'Space Mono',monospace;font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98}
        .ct-topics{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:2rem}
        .ct-topics button{padding:.6rem 1.05rem;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:none;color:#d4d7dc;cursor:pointer;
          font-family:'Space Grotesk',sans-serif;font-size:.95rem;transition:background .25s,color .25s,border-color .25s}
        .ct-topics button:hover{border-color:#ededed}
        .ct-topics button.on{background:#ededed;color:#0b0b0c;border-color:#ededed}
        .ct-fields{display:grid;grid-template-columns:1fr 1fr;gap:1.6rem 1.4rem}
        .ct-fields label{display:flex;flex-direction:column;gap:.4rem}
        .ct-fields label.full{grid-column:1 / -1}
        .ct-fields label > span{font-family:'Space Mono',monospace;font-size:.66rem;letter-spacing:.12em;text-transform:uppercase;color:#8a8f98}
        .ct-fields input,.ct-fields textarea{width:100%;padding:.75rem 0;border:0;border-bottom:1px solid rgba(255,255,255,.2);background:transparent;
          color:#ededed;font-family:'Space Grotesk',sans-serif;font-size:1.1rem;outline:none;resize:none;transition:border-color .3s}
        .ct-fields textarea{min-height:7.5rem;max-height:260px;overflow-y:auto;line-height:1.5}
        .ct-fields input::placeholder,.ct-fields textarea::placeholder{color:#4b5058}
        .ct-fields input:focus,.ct-fields textarea:focus{border-bottom-color:var(--cyan)}
        .ct-fields label.err input,.ct-fields label.err textarea{border-bottom-color:#ff5a6e}
        .ct-fields small{font-size:.75rem;color:#ff7a8a}
        .ct-actions{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:2rem}
        .ct-btn{display:inline-flex;align-items:center;gap:.55rem;padding:.9rem 1.5rem;border-radius:999px;border:1px solid rgba(255,255,255,.25);
          background:none;color:#ededed;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:1rem;
          transition:background .25s,color .25s,border-color .25s,transform .25s}
        .ct-btn:hover{border-color:#ededed;transform:translateY(-2px)}
        .ct-btn.solid{background:#ededed;color:#0b0b0c;border-color:#ededed}
        .ct-btn.solid:hover{background:var(--cyan);border-color:var(--cyan)}
        .ct-note{margin:.9rem 0 0;font-size:.8rem;color:#8a8f98}

        .ct-reach{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:4rem;align-items:start;margin-bottom:6rem}
        .ct-reach-side{position:sticky;top:7rem;display:flex;flex-direction:column;gap:2.4rem}
        .ct-reach-title,.ct-form-intro h3{margin:0;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(2.4rem,4.6vw,4rem);
          line-height:.95;letter-spacing:-.05em;text-transform:uppercase}
        .ct-reach-title span,.ct-form-intro h3 span{color:#3a3a3f}
        .ct-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:minmax(0,1fr);gap:1.1rem}
        .ct-reach > *,.ct-cards li{min-width:0}
        .ct-card{display:flex;align-items:center;gap:1.4rem;padding:1.5rem 1.6rem;border-radius:36px;background:#111113;
          border:1px solid rgba(255,255,255,.08);color:#ededed;text-decoration:none;
          transition:border-color .35s,background .35s,box-shadow .45s}
        .ct-card:hover,.ct-card:focus-visible{border-color:rgba(255,255,255,.3);background:#151518;box-shadow:0 22px 50px rgba(0,0,0,.55)}
        .ct-card-ico{flex:none;width:72px;height:72px;border-radius:50%;display:grid;place-items:center;background:#232327;color:#ededed}
        .ct-card-text{display:flex;flex-direction:column;gap:.2rem;min-width:0}
        .ct-card-text small{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#7a7f87}
        .ct-card-text strong{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(1.6rem,2.6vw,2.2rem);line-height:1.05;letter-spacing:-.045em}
        .ct-card-value{max-height:0;overflow:hidden;opacity:0;font-family:'Space Mono',monospace;font-size:.74rem;color:#a1a6ae;
          white-space:nowrap;text-overflow:ellipsis;transition:max-height .4s cubic-bezier(.22,1,.36,1),opacity .3s}
        .ct-card:hover .ct-card-value,.ct-card:focus-visible .ct-card-value{max-height:1.4rem;opacity:1}
        .ct-card-go{flex:none;margin-left:auto;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:#ededed;color:#0b0b0c;
          transform:scale(0);transition:transform .45s cubic-bezier(.34,1.56,.64,1)}
        .ct-card:hover .ct-card-go,.ct-card:focus-visible .ct-card-go{transform:scale(1)}
        @media (hover:none){
          .ct-card-go{transform:scale(.75)}
          .ct-card-value{max-height:1.4rem;opacity:1}
        }
        .ct-form-intro{display:flex;flex-direction:column;gap:1.2rem}
        .ct-form-intro p{margin:0;max-width:340px;font-size:1rem;line-height:1.6;color:#a1a6ae}
        @keyframes ct-ping{0%{box-shadow:0 0 0 0 rgba(61,220,151,.6)}80%,100%{box-shadow:0 0 0 9px rgba(61,220,151,0)}}

        @media (max-width:980px){
          .ct-grid,.ct-reach{grid-template-columns:1fr;gap:2.5rem}
          .ct-reach-side{position:relative;top:0}
          .dm{max-width:320px}
        }
        @media (max-width:640px){
          .ct{padding:5rem 0 4rem}
          .ct-wrap{padding:0 1.2rem}
          .ct-fields{grid-template-columns:1fr}
          .ct-mail{font-size:clamp(1rem,5.2vw,1.3rem);word-break:normal;overflow-wrap:anywhere}
          .ct-card{gap:1rem;padding:1.1rem 1.2rem;border-radius:28px}
          .ct-reach-side .dm{display:none}
          .ct-card-ico{width:54px;height:54px}
          .ct-card-go{width:48px;height:48px}
        }
        @media (prefers-reduced-motion:reduce){.ct-status i{animation:none}}
      `}</style>
    </section>
  );
};

export default Contact;
