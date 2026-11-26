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
      className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium backdrop-blur-md shadow-inner ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <div className="pl-1.5 pr-1 text-slate-500 dark:text-spatial-muted hidden sm:flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        onClick={() => setLanguage('en')}
        type="button"
        className={`px-2.5 py-1 rounded-lg transition-all duration-200 ${
          language === 'en'
            ? 'bg-slate-900 dark:bg-spatial-blue text-white shadow-sm font-semibold'
            : 'text-slate-600 dark:text-spatial-muted hover:text-slate-900 dark:hover:text-spatial-text'
        }`}
      >
        English
      </button>
      <span className="text-slate-300 dark:text-white/20 px-0.5 select-none">|</span>
      <button
        onClick={() => setLanguage('hi')}
        type="button"
        className={`px-2.5 py-1 rounded-lg transition-all duration-200 ${
          language === 'hi'
            ? 'bg-slate-900 dark:bg-spatial-blue text-white shadow-sm font-semibold'
            : 'text-slate-600 dark:text-spatial-muted hover:text-slate-900 dark:hover:text-spatial-text'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};
