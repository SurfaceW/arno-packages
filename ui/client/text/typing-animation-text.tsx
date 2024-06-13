"use client";

import { useEffect, useState } from "react";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

/**
 * @source https://github.com/magicuidesign/magicui/blob/main/registry/components/magicui/typing-animation.tsx
 */
export default function TypingAnimation({
  text,
  duration = 200,
  className,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prevState) => prevState + text.charAt(i));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i]);

  return (
    <div
      className={`font-display text-center text-4xl leading-[5rem] tracking-[-0.02em] drop-shadow-sm ${className}`}
    >
      {displayedText ? displayedText : text}
    </div>
  );
}