import React, { useEffect, useState } from 'react';

// A tiny history-API router: the site only has three pages, so no router library.
export type Path = '/' | '/skills' | '/certifications';
const PATHS: Path[] = ['/', '/skills', '/certifications'];

const normalize = (p: string): Path => {
  const clean = p.replace(/\/+$/, '') || '/';
  return PATHS.includes(clean as Path) ? (clean as Path) : '/';
};

export const currentPath = () => normalize(window.location.pathname);

export function usePath() {
  const [path, setPath] = useState<Path>(currentPath);
  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

// same offset the section links have always used, so the fixed navbar doesn't cover headings
const scrollToId = (id: string, behavior: ScrollBehavior) => {
  const el = document.getElementById(id);
  if (!el) return false;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior });
  return true;
};

// "/#about" from a sub-page switches to home first, then jumps there once it has rendered
export function navigate(to: string) {
  const [pathPart, hash] = to.split('#');
  const target = normalize(pathPart || window.location.pathname);
  const samePage = target === currentPath();

  if (samePage) {
    if (!hash || !scrollToId(hash, 'smooth')) window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  window.history.pushState(null, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  // 'instant', because 'auto' would inherit the site's CSS smooth scrolling
  const instant = 'instant' as ScrollBehavior;
  setTimeout(() => {
    if (!hash || !scrollToId(hash, instant)) window.scrollTo({ top: 0, behavior: instant });
  }, 60);
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export const Link: React.FC<LinkProps> = ({ to, onClick, ...rest }) => (
  <a
    href={to}
    onClick={e => {
      onClick?.(e);
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(to);
    }}
    {...rest}
  />
);
