import React, { useState, useCallback, createContext, useContext } from 'react';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

// ─── THEME DEFINITIONS ────────────────────────────────────────────
export type ThemeId = 'cyber' | 'light' | 'neon';

export interface ThemeDef {
  id: ThemeId;
  label: string;
  icon: string;
  vars: Record<string, string>;
}

export const THEMES: ThemeDef[] = [
  {
    id: 'cyber',
    label: 'Cyber',
    icon: '⬡',
    vars: {
      '--cyan':        '#00f5ff',
      '--cyan-dim':    'rgba(0,245,255,0.15)',
      '--cyan-glow':   '0 0 20px rgba(0,245,255,0.5),0 0 60px rgba(0,245,255,0.15)',
      '--purple':      '#9b59ff',
      '--purple-dim':  'rgba(155,89,255,0.15)',
      '--purple-glow': '0 0 20px rgba(155,89,255,0.5),0 0 60px rgba(155,89,255,0.15)',
      '--pink':        '#ff2d78',
      '--dark':        '#030712',
      '--dark2':       '#080d1a',
      '--dark3':       '#0d1224',
      '--dark4':       '#131929',
      '--dark5':       '#1a2035',
      '--text':        '#e2e8f0',
      '--text2':       '#94a3b8',
      '--text3':       '#475569',
      '--muted':       '#475569',
      '--muted2':      '#94a3b8',
      '--border':      'rgba(0,245,255,0.12)',
      '--border-hover':'rgba(0,245,255,0.35)',
      '--nav-bg':      'rgba(3,7,18,0.96)',
      '--nav-bg-top':  'rgba(3,7,18,0.4)',
      '--accent1':     '#00f5ff',
      '--accent2':     '#9b59ff',
      '--gradient':    'linear-gradient(135deg,#00f5ff,#9b59ff)',
    },
  },
  {
    id: 'light',
    label: 'Light',
    icon: '○',
    vars: {
      '--cyan':        '#0ea5e9',
      '--cyan-dim':    'rgba(14,165,233,0.12)',
      '--cyan-glow':   '0 0 20px rgba(14,165,233,0.3),0 0 60px rgba(14,165,233,0.1)',
      '--purple':      '#7c3aed',
      '--purple-dim':  'rgba(124,58,237,0.12)',
      '--purple-glow': '0 0 20px rgba(124,58,237,0.3),0 0 60px rgba(124,58,237,0.1)',
      '--pink':        '#e11d68',
      '--dark':        '#f8fafc',
      '--dark2':       '#f1f5f9',
      '--dark3':       '#ffffff',
      '--dark4':       '#e2e8f0',
      '--dark5':       '#cbd5e1',
      '--text':        '#0f172a',
      '--text2':       '#334155',
      '--text3':       '#64748b',
      '--muted':       '#64748b',
      '--muted2':      '#475569',
      '--border':      'rgba(14,165,233,0.18)',
      '--border-hover':'rgba(14,165,233,0.45)',
      '--nav-bg':      'rgba(248,250,252,0.96)',
      '--nav-bg-top':  'rgba(248,250,252,0.7)',
      '--accent1':     '#0ea5e9',
      '--accent2':     '#7c3aed',
      '--gradient':    'linear-gradient(135deg,#0ea5e9,#7c3aed)',
    },
  },
  {
    id: 'neon',
    label: 'Neon',
    icon: '◈',
    vars: {
      '--cyan':        '#39ff14',
      '--cyan-dim':    'rgba(57,255,20,0.12)',
      '--cyan-glow':   '0 0 20px rgba(57,255,20,0.5),0 0 60px rgba(57,255,20,0.15)',
      '--purple':      '#ff00ff',
      '--purple-dim':  'rgba(255,0,255,0.15)',
      '--purple-glow': '0 0 20px rgba(255,0,255,0.5),0 0 60px rgba(255,0,255,0.15)',
      '--pink':        '#ff6b00',
      '--dark':        '#020208',
      '--dark2':       '#06060f',
      '--dark3':       '#0a0a18',
      '--dark4':       '#0f0f22',
      '--dark5':       '#16162e',
      '--text':        '#f0fff0',
      '--text2':       '#a0ffb0',
      '--text3':       '#4a8a5a',
      '--muted':       '#4a8a5a',
      '--muted2':      '#a0ffb0',
      '--border':      'rgba(57,255,20,0.15)',
      '--border-hover':'rgba(57,255,20,0.4)',
      '--nav-bg':      'rgba(2,2,8,0.97)',
      '--nav-bg-top':  'rgba(2,2,8,0.5)',
      '--accent1':     '#39ff14',
      '--accent2':     '#ff00ff',
      '--gradient':    'linear-gradient(135deg,#39ff14,#ff00ff)',
    },
  },
];

// ─── THEME CONTEXT ────────────────────────────────────────────────
interface ThemeCtx { theme: ThemeDef; setTheme: (id: ThemeId) => void; }
export const ThemeContext = createContext<ThemeCtx>({
  theme: THEMES[0],
  setTheme: () => {},
});
export const useTheme = () => useContext(ThemeContext);

// ─── APPLY THEME TO :root ─────────────────────────────────────────
function applyTheme(theme: ThemeDef) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

// ─── APP ──────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [themeId, setThemeId] = useState<ThemeId>('cyber');

  const handleLoaderComplete = useCallback(() => setLoaded(true), []);

  const setTheme = useCallback((id: ThemeId) => {
    const t = THEMES.find(t => t.id === id) ?? THEMES[0];
    setThemeId(id);
    applyTheme(t);
  }, []);

  const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {/* Scanline overlay */}
      <div className="scanlines" aria-hidden />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Loader */}
      <AnimatePresence>
        {!loaded && <Loader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      {/* Main portfolio */}
      <AnimatePresence>
        {loaded && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: .8, ease: 'easeOut' }}
          >
            <ParticleBackground />
            <Navbar />
            <main>
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Experience />
              <Contact />
            </main>
            <Footer />
            <ScrollToTopFAB />
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
};

// ─── SCROLL TO TOP FAB ────────────────────────────────────────────
const ScrollToTopFAB: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const h = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: .7, y: 20 }}
          animate={{ opacity: 1, scale: 1,  y: 0  }}
          exit={{   opacity: 0, scale: .7, y: 20  }}
          transition={{ duration: .3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(0,245,255,.5)' }}
          whileTap={{ scale: .92 }}
          aria-label="Scroll to top"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right:  '2rem',
            zIndex:  800,
            width:   48,
            height:  48,
            borderRadius: '50%',
            background: 'var(--gradient)',
            border: 'none',
            cursor: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: '#000',
            fontWeight: 700,
            boxShadow: '0 0 20px rgba(0,245,255,.35)',
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default App;