import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../data/portfolioData';
import { useNavScroll, useActiveSection, useScrollTo } from '../hooks';
import { useTheme, THEMES, type ThemeId } from '../App';

const Navbar: React.FC = () => {
  const scrolled    = useNavScroll(60);
  const activeId    = useActiveSection(NAV_ITEMS.map(n => n.href));
  const scrollTo    = useScrollTo();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [themeOpen, setThemeOpen]     = useState(false);
  const { theme, setTheme }           = useTheme();

  const handleNav = (href: string) => { scrollTo(href); setMenuOpen(false); };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .7, ease: [.16, 1, .3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 6%', height: 72,
          background: scrolled ? 'var(--nav-bg)' : 'var(--nav-bg-top)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(0,245,255,.15)' : 'transparent'}`,
          transition: 'background .4s, border-color .4s',
        }}
      >
        {/* ── Logo ── */}
        <button onClick={() => handleNav('hero')} style={{ background: 'none', border: 'none', cursor: 'none', padding: 0 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '1.05rem',
              fontWeight: 900,
              letterSpacing: '2px',
              /* fallback color so text is NEVER invisible */
              color: 'var(--cyan)',
              /* gradient clip on top — supported browsers get the gradient */
              background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            } as React.CSSProperties}>
              MOHAMED ABRAR S A
            </div>
            {/* Cyber-only: animated scan underline */}
            {theme.id === 'cyber' && (
              <motion.div
                animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', bottom: -3, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
                  transformOrigin: 'left',
                }}
              />
            )}
          </div>
        </button>

        {/* Desktop nav links */}
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center' }} className="nav-desktop">
          {NAV_ITEMS.map(item => (
            <li key={item.href}>
              <button
                onClick={() => handleNav(item.href)}
                style={{
                  position: 'relative', background: 'none', border: 'none', cursor: 'none',
                  color: activeId === item.href ? 'var(--cyan)' : '#64748b',
                  fontFamily: 'var(--font-body)', fontSize: '.9rem', fontWeight: 600,
                  letterSpacing: '1px', textTransform: 'uppercase', padding: '.4rem 0',
                  transition: 'color .25s',
                }}
              >
                {item.label}
                <motion.span
                  style={{
                    position: 'absolute', bottom: -2, left: 0, right: 0,
                    height: 1, background: 'var(--gradient)', borderRadius: 1,
                    opacity: activeId === item.href ? 1 : 0,
                  }}
                  animate={{ opacity: activeId === item.href ? 1 : 0 }}
                  transition={{ duration: .25 }}
                />
              </button>
            </li>
          ))}
        </ul>

        {/* Right side: theme toggle + hire me */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

          {/* ── Theme switcher ── */}
          <div style={{ position: 'relative' }}>
            <motion.button
              onClick={() => setThemeOpen(v => !v)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: .93 }}
              title="Switch theme"
              style={{
                background: 'transparent',
                border: `1px solid var(--border-hover)`,
                borderRadius: 8,
                cursor: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '.4rem',
                padding: '.38rem .75rem',
                color: 'var(--cyan)',
                fontFamily: 'var(--font-mono)',
                fontSize: '.72rem',
                letterSpacing: '1px',
                transition: 'all .25s',
              }}
            >
              <span style={{ fontSize: '.9rem' }}>{theme.icon}</span>
              <span className="theme-label-desktop">{theme.label}</span>
              <motion.span
                animate={{ rotate: themeOpen ? 180 : 0 }}
                transition={{ duration: .25 }}
                style={{ display: 'inline-block', fontSize: '.6rem', opacity: .7 }}
              >
                ▾
              </motion.span>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {themeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: .96 }}
                  animate={{ opacity: 1, y: 0,  scale: 1   }}
                  exit={{   opacity: 0, y: -8, scale: .96  }}
                  transition={{ duration: .2 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: 'var(--dark3)',
                    border: '1px solid var(--border-hover)',
                    borderRadius: 10, overflow: 'hidden',
                    minWidth: 130, zIndex: 2000,
                    boxShadow: '0 8px 32px rgba(0,0,0,.5)',
                  }}
                >
                  {THEMES.map((t, i) => (
                    <motion.button
                      key={t.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1,  x: 0   }}
                      transition={{ delay: i * .05 }}
                      onClick={() => { setTheme(t.id as ThemeId); setThemeOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '.6rem',
                        width: '100%', padding: '.65rem 1rem',
                        background: theme.id === t.id ? 'var(--cyan-dim)' : 'transparent',
                        border: 'none', borderBottom: i < THEMES.length - 1 ? '1px solid var(--border)' : 'none',
                        cursor: 'none', color: theme.id === t.id ? 'var(--cyan)' : 'var(--text2)',
                        fontFamily: 'var(--font-mono)', fontSize: '.78rem',
                        letterSpacing: '1px', textAlign: 'left',
                        transition: 'background .2s, color .2s',
                      }}
                      onMouseEnter={e => { if (theme.id !== t.id) (e.currentTarget as HTMLButtonElement).style.background = 'var(--dark4)'; }}
                      onMouseLeave={e => { if (theme.id !== t.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: '1rem' }}>{t.icon}</span>
                      {t.label}
                      {theme.id === t.id && (
                        <span style={{ marginLeft: 'auto', fontSize: '.65rem', opacity: .8 }}>✓</span>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hire Me CTA */}
          <button
            onClick={() => handleNav('contact')}
            className="btn btn-outline"
            style={{ padding: '.55rem 1.4rem', fontSize: '.72rem', cursor: 'none' }}
            id="nav-cta"
          >
            Hire Me
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="hamburger"
            aria-label="Toggle menu"
            style={{ display: 'none', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'none', padding: '4px' }}
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                animate={{
                  rotate:  menuOpen && i === 0 ? 45  : menuOpen && i === 2 ? -45 : 0,
                  y:       menuOpen && i === 0 ? 7   : menuOpen && i === 2 ? -7  : 0,
                  opacity: menuOpen && i === 1 ? 0   : 1,
                }}
                style={{ display: 'block', width: 22, height: 2, background: 'var(--cyan)', borderRadius: 1 }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -20 }}
            transition={{ duration: .3 }}
            style={{
              position: 'fixed', top: 72, left: 0, right: 0, zIndex: 999,
              background: 'rgba(3,7,18,.98)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border)',
              padding: '1.5rem 6%', display: 'flex', flexDirection: 'column', gap: '1rem',
            }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div key={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .06 }}>
                <button
                  onClick={() => handleNav(item.href)}
                  style={{
                    background: 'none', border: 'none', cursor: 'none',
                    color: activeId === item.href ? 'var(--cyan)' : '#94a3b8',
                    fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontWeight: 600,
                    letterSpacing: '1px', textTransform: 'uppercase',
                    padding: '.5rem 0', width: '100%', textAlign: 'left', transition: 'color .2s',
                  }}
                >
                  {activeId === item.href && (
                    <span style={{ color: 'var(--cyan)', marginRight: '.5rem', fontFamily: 'var(--font-mono)', fontSize: '.8rem' }}>▶</span>
                  )}
                  {item.label}
                </button>
              </motion.div>
            ))}

            {/* Mobile theme switcher */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id as ThemeId); setThemeOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '.4rem',
                    padding: '.4rem .9rem', borderRadius: 6,
                    background: theme.id === t.id ? 'var(--cyan-dim)' : 'var(--dark4)',
                    border: `1px solid ${theme.id === t.id ? 'var(--border-hover)' : 'var(--border)'}`,
                    color: theme.id === t.id ? 'var(--cyan)' : 'var(--text2)',
                    fontFamily: 'var(--font-mono)', fontSize: '.75rem',
                    cursor: 'none', transition: 'all .2s',
                  }}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width:768px){
          .nav-desktop{display:none!important}
          .hamburger{display:flex!important}
          #nav-cta{display:none!important}
          .theme-label-desktop{display:none!important}
        }
        @media(min-width:769px){
          #nav-cta{display:inline-flex!important}
          .theme-label-desktop{display:inline!important}
        }
      `}</style>
    </>
  );
};

export default Navbar;