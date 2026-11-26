import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export interface AccessibilitySettings {
  isAccessibilityOn: boolean;
  speechEnabled: boolean;
  fontScale: number;
  highContrast: boolean;
  toggleAccessibility: () => void;
  toggleSpeech: () => void;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
  toggleHighContrast: () => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilitySettings | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAccessibilityOn, setIsAccessibilityOn] = useState<boolean>(() => {
    return localStorage.getItem('bettercity_acc_enabled') === 'true';
  });

  const [speechEnabled, setSpeechEnabled] = useState<boolean>(() => {
    return localStorage.getItem('bettercity_tts_enabled') === 'true';
  });

  const [fontScale, setFontScale] = useState<number>(() => {
    const saved = localStorage.getItem('bettercity_font_scale');
    return saved ? parseFloat(saved) : 1;
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('bettercity_high_contrast') === 'true';
  });

  const debounceTimerRef = useRef<number | null>(null);
  const lastSpokenRef = useRef<string>('');

  // Speech helper
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const cleanText = text.trim();
    if (!cleanText || cleanText === lastSpokenRef.current) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    lastSpokenRef.current = cleanText;

    utterance.onend = () => {
      lastSpokenRef.current = '';
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // One-click master toggle
  const toggleAccessibility = useCallback(() => {
    setIsAccessibilityOn((prev) => {
      const next = !prev;
      localStorage.setItem('bettercity_acc_enabled', String(next));

      if (next) {
        setFontScale(1.25);
        setSpeechEnabled(true);
        setHighContrast(true);
        localStorage.setItem('bettercity_font_scale', '1.25');
        localStorage.setItem('bettercity_tts_enabled', 'true');
        localStorage.setItem('bettercity_high_contrast', 'true');
        speak('Accessibility mode enabled. Large text and voice reading activated.');
      } else {
        setFontScale(1);
        setSpeechEnabled(false);
        setHighContrast(false);
        localStorage.setItem('bettercity_font_scale', '1');
        localStorage.setItem('bettercity_tts_enabled', 'false');
        localStorage.setItem('bettercity_high_contrast', 'false');
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }

      return next;
    });
  }, [speak]);

  const toggleSpeech = useCallback(() => {
    setSpeechEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('bettercity_tts_enabled', String(next));
      if (next) {
        speak('Text to speech enabled. Hover or tap anything to read aloud.');
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  }, [speak]);

  const increaseFont = useCallback(() => {
    setFontScale((prev) => {
      const next = Math.min(Math.round((prev + 0.15) * 100) / 100, 1.75);
      localStorage.setItem('bettercity_font_scale', String(next));
      speak(`Font size increased to ${Math.round(next * 100)} percent`);
      return next;
    });
  }, [speak]);

  const decreaseFont = useCallback(() => {
    setFontScale((prev) => {
      const next = Math.max(Math.round((prev - 0.15) * 100) / 100, 0.9);
      localStorage.setItem('bettercity_font_scale', String(next));
      speak(`Font size decreased to ${Math.round(next * 100)} percent`);
      return next;
    });
  }, [speak]);

  const resetFont = useCallback(() => {
    setFontScale(1);
    localStorage.setItem('bettercity_font_scale', '1');
    speak('Font size reset to normal.');
  }, [speak]);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => {
      const next = !prev;
      localStorage.setItem('bettercity_high_contrast', String(next));
      speak(next ? 'High contrast enabled.' : 'High contrast disabled.');
      return next;
    });
  }, [speak]);

  // Apply CSS font scale and high contrast classes to root html element
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-scale', fontScale.toString());

    if (highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }
  }, [fontScale, highContrast]);

  // Global hover-to-speech listener when speech is enabled
  useEffect(() => {
    if (!speechEnabled) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignore media, inputs that are being typed into, etc.
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const inputElem = target as HTMLInputElement;
        const textToRead = inputElem.placeholder || inputElem.value || inputElem.getAttribute('aria-label');
        if (textToRead) {
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = window.setTimeout(() => speak(textToRead), 300);
        }
        return;
      }

      // Find closest interactive or readable element
      const readable = target.closest('button, a, h1, h2, h3, h4, p, label, [role="button"], [aria-label]') as HTMLElement | null;
      const element = readable || target;

      const ariaLabel = element.getAttribute('aria-label');
      const title = element.getAttribute('title');
      const directText = element.innerText || element.textContent || '';
      const textToRead = ariaLabel || title || directText.trim();

      if (textToRead && textToRead.length < 250) {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = window.setTimeout(() => {
          speak(textToRead);
        }, 350);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [speechEnabled, speak]);

  return (
    <AccessibilityContext.Provider
      value={{
        isAccessibilityOn,
        speechEnabled,
        fontScale,
        highContrast,
        toggleAccessibility,
        toggleSpeech,
        increaseFont,
        decreaseFont,
        resetFont,
        toggleHighContrast,
        speak,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilitySettings => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return ctx;
};
