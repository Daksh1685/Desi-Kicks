import { useState, useEffect } from 'react';

export function useTypingEffect(
  words: string[],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1500
) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const currentWord = words[wordIndex];

    const delay = isDeleting
      ? text === ''
        ? 300
        : deletingSpeed
      : text === currentWord
      ? pauseDuration
      : typingSpeed;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (text === currentWord) {
          setIsDeleting(true);
        } else {
          setText(currentWord.substring(0, text.length + 1));
        }
      } else {
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        } else {
          setText(currentWord.substring(0, text.length - 1));
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
}
