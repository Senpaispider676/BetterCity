import React from 'react';
import { CategoryType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { CATEGORY_CONFIG } from '../lib/categories';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CategorySelectorProps {
  selectedCategory: CategoryType | null;
  onSelect: (cat: CategoryType) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelect,
}) => {
  const { t } = useLanguage();

  const categoriesList: CategoryType[] = [
    'pothole',
    'streetlight',
    'water_leak',
    'garbage',
    'road_damage',
    'noise',
    'safety_hazard',
    'traffic',
    'accident',
    'cleanup',
    'other',
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
      {categoriesList.map((catKey) => {
        const meta = CATEGORY_CONFIG[catKey];
        const Icon = meta.icon;
        const isSelected = selectedCategory === catKey;

        return (
          <motion.button
            key={catKey}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(catKey)}
            className={`
              relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between
              ${isSelected
                ? 'bg-spatial-blue/15 border-spatial-blue shadow-spatial-sm text-spatial-text ring-1 ring-spatial-blue'
                : 'bg-white/5 dark:bg-white/5 light:bg-slate-50 border-white/10 dark:border-white/10 light:border-slate-200 text-spatial-muted hover:border-white/20 hover:text-spatial-text'
              }
            `}
          >
            {/* Top row with icon & check indicator */}
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl ${meta.bgLight} ${meta.color}`}>
                <Icon className="w-5 h-5" />
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-spatial-blue text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Category Name */}
            <span className={`text-xs font-semibold leading-tight ${isSelected ? 'text-white' : 'text-spatial-text'}`}>
              {t.categories[catKey] || catKey}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
