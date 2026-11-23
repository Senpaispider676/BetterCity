import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle dark/light theme"
      className={`relative p-2 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-300/80 bg-white/5 dark:bg-white/5 light:bg-slate-100/80 text-spatial-muted hover:text-spatial-text hover:bg-white/10 transition-all duration-200 active:scale-95 ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 30, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-spatial-orange" />
        ) : (
          <Moon className="w-4 h-4 text-spatial-blue" />
        )}
      </motion.div>
    </button>
  );
};
