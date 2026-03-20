import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CONTACT_INFO } from '../data/portfolioData';

interface FormState { name: string; email: string; subject: string; message: string; }
type Status = 'idle' | 'sending' | 'sent' | 'error';

const Contact: React.FC = () => {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => { setStatus('sent'); setForm({ name: '', email: '', subject: '', message: '' }); }, 1600);
    setTimeout(() => setStatus('idle'), 5000);
  };

  const LINKS = [
    { icon: '📧', label: 'Email Me',  sub: CONTACT_INFO.email,                href: `mailto:${CONTACT_INFO.email}`,     color: 'cyan'    },
    { icon: '💼', label: 'LinkedIn',  sub: 'linkedin.com/in/mohamed-abrar-24sa', href: CONTACT_INFO.linkedin,             color: 'blue'    },
    { icon: '🐙', label: 'GitHub',    sub: 'github.com/ab-rar-6024',            href: CONTACT_INFO.github,               color: 'white'   },
    { icon: '📱', label: 'Phone',     sub: CONTACT_INFO.phone,                  href: `tel:${CONTACT_INFO.phone}`,       color: 'purple'  },
    { icon: '📍', label: 'Location',  sub: CONTACT_INFO.location,               href: '#',                               color: 'pink'    },
  ] as const;

  return (
    <section id="contact" style={{ background: 'var(--dark2)', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(155,89,255,.07) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />

      <div className="section-wrap" ref={ref}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: .7 }}
        >
          <span className="section-tag">// contact.init</span>
          <h2 className="section-title">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '4rem', alignItems: 'start' }}
          className="contact-grid"
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .7, delay: .15 }}
          >
            <h3 style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
              fontWeight: 700,
              marginBottom: '.9rem',
            }}>
              Let's <span className="gradient-text">Connect</span>
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--muted2)', marginBottom: '2.2rem' }}>
              I'm actively seeking <span style={{ color: 'var(--cyan)' }}>internship</span> and{' '}
              <span style={{ color: 'var(--purple)' }}>entry-level opportunities</span> in AI,
              Machine Learning, and Data Science. If you have a project or role in mind, I'd
              love to hear from you!
            </p>

            <div style={{ display: 'grid', gap: '.75rem' }}>
              {LINKS.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: .3 + i * .08 }}
                  whileHover={{ x: 8, borderColor: `var(--${link.color === 'white' ? 'text' : link.color})` }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: 'var(--dark3)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '1rem 1.2rem',
                    textDecoration: 'none',
                    transition: 'border-color .25s, transform .25s',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'rgba(0,245,255,.08)',
                    border: '1px solid rgba(0,245,255,.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', flexShrink: 0,
                  }}>
                    {link.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'var(--text)' }}>
                      {link.label}
                    </div>
                    <div style={{
                      fontSize: '.78rem', color: 'var(--muted)',
                      marginTop: '.15rem', fontFamily: 'var(--font-mono)',
                      wordBreak: 'break-all',
                    }}>
                      {link.sub}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right – Form */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .7, delay: .3 }}
          >
            <div style={{
              background: 'var(--dark3)',
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: '2.2rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: 'linear-gradient(to right, var(--cyan), var(--purple))',
              }} />

              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '.72rem',
                color: 'var(--cyan)', letterSpacing: '3px', marginBottom: '1.5rem',
              }}>
                // SEND MESSAGE
              </p>

              <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1.1rem' }}>
                {[
                  { id: 'name',    label: 'Your Name',      type: 'text',  ph: 'John Doe'              },
                  { id: 'email',   label: 'Email Address',   type: 'email', ph: 'john@example.com'      },
                  { id: 'subject', label: 'Subject',         type: 'text',  ph: 'Internship Opportunity'},
                ].map(field => (
                  <div key={field.id}>
                    <label style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)', fontSize: '.68rem',
                      color: 'var(--muted)', letterSpacing: '2px',
                      textTransform: 'uppercase', marginBottom: '.45rem',
                    }}>
                      {field.label}
                    </label>
                    <input
                      name={field.id}
                      type={field.type}
                      placeholder={field.ph}
                      value={form[field.id as keyof FormState]}
                      onChange={onChange}
                      required
                      style={{
                        width: '100%',
                        background: 'var(--dark4)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '.85rem 1rem',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color .25s, box-shadow .25s',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'rgba(0,245,255,.5)';
                        e.target.style.boxShadow   = '0 0 0 3px rgba(0,245,255,.1)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow   = 'none';
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)', fontSize: '.68rem',
                    color: 'var(--muted)', letterSpacing: '2px',
                    textTransform: 'uppercase', marginBottom: '.45rem',
                  }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Hi Mohamed, I'd like to connect about..."
                    rows={4}
                    value={form.message}
                    onChange={onChange}
                    required
                    style={{
                      width: '100%',
                      background: 'var(--dark4)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '.85rem 1rem',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: 110,
                      transition: 'border-color .25s, box-shadow .25s',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'rgba(0,245,255,.5)';
                      e.target.style.boxShadow   = '0 0 0 3px rgba(0,245,255,.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow   = 'none';
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '.3rem' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: .97 }}
                  disabled={status === 'sending' || status === 'sent'}
                >
                  {status === 'idle'    && '⚡ Send Message'}
                  {status === 'sending' && '🔄 Sending...'}
                  {status === 'sent'    && '✅ Message Sent!'}
                  {status === 'error'   && '❌ Try Again'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
};

export default Contact;
