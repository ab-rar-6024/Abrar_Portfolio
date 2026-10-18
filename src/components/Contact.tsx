import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { personalInfo } from '../data';

const EASE = [0.22, 1, 0.36, 1] as const;
const TOPICS = ['Freelance project', 'Internship', 'Full-time role', 'Just saying hi'];
const WHATSAPP = personalInfo.phone.replace(/\D/g, '');

const istTime = () =>
  new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });

interface Form { name: string; email: string; message: string }

const Contact: React.FC = () => {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [form, setForm] = useState<Form>({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState(istTime);

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

  const channels = [
    { icon: <Mail size={18} />, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { icon: <Phone size={18} />, label: 'Phone', value: personalInfo.phone, href: `tel:+${WHATSAPP}` },
    { icon: <MessageCircle size={18} />, label: 'WhatsApp', value: 'Message me directly', href: `https://wa.me/${WHATSAPP}` },
    { icon: <Linkedin size={18} />, label: 'LinkedIn', value: personalInfo.linkedinHandle, href: personalInfo.linkedin },
    { icon: <Github size={18} />, label: 'GitHub', value: personalInfo.githubHandle, href: personalInfo.github },
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

        <div className="ct-grid">
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
                <textarea rows={5} value={form.message} onChange={set('message')} placeholder="Tell me about the project, role or idea…" />
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

          {/* direct channels */}
          <motion.ul className="ct-channels" {...reveal(0.1)}>
            {channels.map(c => (
              <li key={c.label}>
                <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  <span className="ct-ico">{c.icon}</span>
                  <span className="ct-ch-label">{c.label}</span>
                  <span className="ct-ch-value">{c.value}</span>
                  <ArrowUpRight size={18} className="ct-ch-go" />
                </a>
              </li>
            ))}
          </motion.ul>
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

        .ct-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:3.5rem;align-items:start}
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
          color:#ededed;font-family:'Space Grotesk',sans-serif;font-size:1.1rem;outline:none;resize:vertical;transition:border-color .3s}
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

        .ct-channels{list-style:none;margin:0;padding:0;border-top:1px solid rgba(255,255,255,.14)}
        .ct-channels li{border-bottom:1px solid rgba(255,255,255,.14)}
        .ct-channels a{position:relative;display:grid;grid-template-columns:2.4rem 6rem minmax(0,1fr) 1.4rem;align-items:center;gap:.8rem;
          padding:1.3rem .5rem;color:#ededed;text-decoration:none;overflow:hidden;transition:color .35s}
        .ct-channels a::before{content:'';position:absolute;inset:0;background:#ededed;transform:scaleY(0);transform-origin:bottom;
          transition:transform .45s cubic-bezier(.22,1,.36,1)}
        .ct-channels a:hover{color:#0b0b0c}
        .ct-channels a:hover::before{transform:scaleY(1)}
        .ct-channels a > *{position:relative}
        .ct-ico{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;border:1px solid currentColor}
        .ct-ch-label{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:1.05rem}
        .ct-ch-value{font-family:'Space Mono',monospace;font-size:.74rem;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .ct-ch-go{transition:transform .35s cubic-bezier(.22,1,.36,1)}
        .ct-channels a:hover .ct-ch-go{transform:rotate(45deg)}
        @keyframes ct-ping{0%{box-shadow:0 0 0 0 rgba(61,220,151,.6)}80%,100%{box-shadow:0 0 0 9px rgba(61,220,151,0)}}

        @media (max-width:980px){ .ct-grid{grid-template-columns:1fr} }
        @media (max-width:640px){
          .ct{padding:5rem 0 4rem}
          .ct-wrap{padding:0 1.2rem}
          .ct-fields{grid-template-columns:1fr}
          .ct-mail{font-size:clamp(1rem,5.2vw,1.3rem);word-break:normal;overflow-wrap:anywhere}
          .ct-channels a{grid-template-columns:2.4rem minmax(0,1fr) 1.2rem}
          .ct-ch-value{grid-column:2;grid-row:2;margin-top:-.5rem}
          .ct-ch-go{grid-row:1 / span 2;grid-column:3}
          .ct-ico{grid-row:1 / span 2}
        }
        @media (prefers-reduced-motion:reduce){.ct-status i{animation:none}}
      `}</style>
    </section>
  );
};

export default Contact;
