import { useState, useEffect } from 'react';

export function useActiveSection(sectionIds: string[], offset = 120) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] ?? '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + offset;

      // Find which section we are in
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}
