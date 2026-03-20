import { useState, useEffect, useRef, useCallback } from 'react';

export function useTypingEffect(words: string[], speed = 80, deleteSpeed = 40, pause = 2200) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pause);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), deleteSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex(i => (i + 1) % words.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex, words, speed, deleteSpeed, pause]);
  return displayed;
}

export function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 160) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids]);
  return active;
}

export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  return pos;
}

export function useScrollTo() {
  return useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  }, []);
}

export function useNavScroll(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [threshold]);
  return scrolled;
}
