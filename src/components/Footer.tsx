import React from 'react';
import { motion } from 'framer-motion';
import { useScrollTo } from '../hooks';
import { useTheme } from '../App';

const Footer: React.FC = () => {
  const scrollTo = useScrollTo();
  const { theme } = useTheme();
  const isCyber = theme.id === 'cyber';

  return (
    <footer style={{
      background: 'var(--dark)',
      borderTop: '1px solid var(--border)',
      padding: '3.5rem 6% 2rem',
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden',
    }}>

      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,245,255,.04) 0%, transparent 70%)',
      }}/>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>

        {/* ── Top section ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)',
          gap: '3rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.8rem',
        }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.3rem',
              fontWeight: 900,
              letterSpacing: '3px',
              background: 'linear-gradient(135deg,#00f5ff,#9b59ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '.5rem',
            } as React.CSSProperties}>
              MOHAMED ABRAR S A
            </div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '.7rem',
              color: 'var(--cyan)',
              letterSpacing: '2px',
              marginBottom: '.8rem',
            }}>
              // AI &amp; DATA SCIENCE ENGINEER
            </p>
            <p style={{
              fontSize: '.88rem',
              color: 'var(--muted2)',
              lineHeight: 1.7,
              maxWidth: 300,
            }}>
              Passionate about turning data into intelligence. Building smart systems with ML, Deep Learning &amp; Data Visualization.
            </p>
            <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.8rem' }}>
              📍 Chennai, Tamil Nadu, India
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '.68rem',
              color: 'var(--cyan)',
              letterSpacing: '3px',
              marginBottom: '1.2rem',
              textTransform: 'uppercase',
            }}>// navigate</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
              {[
                { label: 'Home',       href: 'hero'       },
                { label: 'About',      href: 'about'      },
                { label: 'Skills',     href: 'skills'     },
                { label: 'Projects',   href: 'projects'   },
                { label: 'Experience', href: 'experience' },
                { label: 'Contact',    href: 'contact'    },
              ].map(item => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  style={{
                    background: 'none', border: 'none', cursor: 'none',
                    color: 'var(--muted)', fontSize: '.88rem',
                    fontFamily: 'var(--font-body)', fontWeight: 600,
                    textAlign: 'left', padding: 0,
                    transition: 'color .2s, padding-left .2s',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--cyan)';
                    e.currentTarget.style.paddingLeft = '6px';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--muted)';
                    e.currentTarget.style.paddingLeft = '0px';
                  }}
                >
                  <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: '.65rem', opacity: .6 }}>›</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '.68rem',
              color: 'var(--cyan)',
              letterSpacing: '3px',
              marginBottom: '1.2rem',
              textTransform: 'uppercase',
            }}>// connect</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>

              {/* GitHub */}
              <a
                href="https://github.com/ab-rar-6024/Abrar_Portfolio"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '.7rem',
                  color: 'var(--muted)', textDecoration: 'none',
                  fontSize: '.88rem', transition: 'color .2s',
                  padding: '.5rem .8rem',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--dark3)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cyan)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Portfolio Repo
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/mohamed-abrar-s-a"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '.7rem',
                  color: 'var(--muted)', textDecoration: 'none',
                  fontSize: '.88rem', transition: 'color .2s',
                  padding: '.5rem .8rem',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--dark3)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cyan)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>

              {/* Email */}
              <a
                href="mailto:mohamedabrar6024@gmail.com"
                style={{
                  display: 'flex', alignItems: 'center', gap: '.7rem',
                  color: 'var(--muted)', textDecoration: 'none',
                  fontSize: '.88rem', transition: 'color .2s',
                  padding: '.5rem .8rem',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--dark3)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cyan)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email Me
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--muted)' }}>
            © 2025 <span style={{ color: 'var(--cyan)' }}>Mohamed Abrar S A</span>. All rights reserved.
          </span>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--muted)' }}>
            Built with <span style={{ color: 'var(--pink)' }}>♥</span> using React &amp; TypeScript
          </span>

          {/* Back to top */}
          <motion.button
            onClick={() => scrollTo('hero')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: .95 }}
            style={{
              background: isCyber ? 'transparent' : 'var(--dark3)',
              border: `1px solid ${isCyber ? 'var(--cyan)' : 'var(--border)'}`,
              borderRadius: isCyber ? 4 : 8,
              padding: '.45rem 1.1rem',
              color: isCyber ? 'var(--cyan)' : 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '.68rem',
              cursor: 'none',
              letterSpacing: '1px',
              clipPath: isCyber
                ? 'polygon(8% 0%,92% 0%,100% 8%,100% 92%,92% 100%,8% 100%,0% 92%,0% 8%)'
                : 'none',
              boxShadow: isCyber ? '0 0 12px rgba(0,245,255,.2)' : 'none',
              transition: 'all .25s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--cyan)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = isCyber ? 'var(--cyan)' : 'var(--muted)'; }}
          >
            ↑ BACK TO TOP
          </motion.button>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .footer-grid{ grid-template-columns:1fr!important }
        }
      `}</style>
    </footer>
  );
};

export default Footer;