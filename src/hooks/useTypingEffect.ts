import { useState, useEffect } from 'react';

export function useTypingEffect(texts: string[], typingSpeed = 80, deletingSpeed = 40, pauseTime = 2200) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex <= currentText.length) {
      setDisplayText(currentText.slice(0, charIndex));
      if (charIndex === currentText.length) {
        timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      } else {
        timeout = setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
      }
    } else if (isDeleting && charIndex >= 0) {
      setDisplayText(currentText.slice(0, charIndex));
      if (charIndex === 0) {
        setIsDeleting(false);
        setTextIndex((i) => (i + 1) % texts.length);
      } else {
        timeout = setTimeout(() => setCharIndex((c) => c - 1), deletingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  useEffect(() => {
    if (!isDeleting && charIndex === 0) {
      const t = setTimeout(() => setCharIndex(1), 500);
      return () => clearTimeout(t);
    }
  }, [isDeleting, charIndex]);

  return displayText;
}
