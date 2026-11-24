import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spatial-blue/50 ${
        isDark
          ? 'bg-spatial-blue/20 border border-spatial-blue/30'
          : 'bg-amber-100 border border-amber-300/60'
      } ${className}`}
    >
      {/* Track icons — always visible, faded when not active */}
      <Sun
        className={`absolute left-1.5 w-3.5 h-3.5 transition-opacity duration-200 ${
          isDark ? 'opacity-30 text-spatial-orange' : 'opacity-0'
        }`}
      />
      <Moon
        className={`absolute right-1.5 w-3.5 h-3.5 transition-opacity duration-200 ${
          isDark ? 'opacity-0' : 'opacity-30 text-spatial-blue'
        }`}
      />

      {/* Sliding thumb */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={`absolute top-0.5 bottom-0.5 w-6 rounded-full flex items-center justify-center shadow-sm ${
          isDark
            ? 'bg-spatial-blue right-0.5'
            : 'bg-white left-0.5'
        }`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -20, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-white" />
          ) : (
            <Sun className="w-3 h-3 text-amber-500" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
};
