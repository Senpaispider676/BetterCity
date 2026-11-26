import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AccessibilitySettings {
  speechEnabled: boolean;
  fontScale: number; // 1 = normal, >1 = larger
  toggleSpeech: () => void;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
  toggleAccessibility: () => void;

  speechEnabled: boolean;
  fontScale: number; // 1 = normal, >1 = larger
  toggleSpeech: () => void;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
}

const AccessibilityContext = createContext<AccessibilitySettings | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  const toggleSpeech = () => setSpeechEnabled((prev) => !prev);

  const increaseFont = () => setFontScale((prev) => Math.min(prev + 0.25, 2));
  const decreaseFont = () => setFontScale((prev) => Math.max(prev - 0.25, 1));
  const resetFont = () => setFontScale(1);

  // Apply font scale to root element
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  return (
    <AccessibilityContext.Provider
      value={{ speechEnabled, fontScale, toggleSpeech, increaseFont, decreaseFont, resetFont }}
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
