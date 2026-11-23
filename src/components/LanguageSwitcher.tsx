import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100/90 border border-white/10 dark:border-white/10 light:border-slate-300/80 text-xs font-medium backdrop-blur-md ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <div className="pl-1.5 pr-1 text-spatial-muted hidden sm:flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        onClick={() => setLanguage('en')}
        type="button"
        className={`px-2.5 py-1 rounded-lg transition-all duration-200 ${
          language === 'en'
            ? 'bg-spatial-blue text-white shadow-sm font-semibold'
            : 'text-spatial-muted hover:text-spatial-text'
        }`}
      >
        English
      </button>
      <span className="text-white/20 dark:text-white/20 light:text-slate-300 px-0.5 select-none">|</span>
      <button
        onClick={() => setLanguage('hi')}
        type="button"
        className={`px-2.5 py-1 rounded-lg transition-all duration-200 ${
          language === 'hi'
            ? 'bg-spatial-blue text-white shadow-sm font-semibold'
            : 'text-spatial-muted hover:text-spatial-text'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};
