import React from 'react';
import { useReports } from '../contexts/ReportContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Navigation, X, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LocationPrompt: React.FC = () => {
  const {
    locationPermissionStatus,
    requestUserLocation,
    dismissLocationPrompt,
    isDetectingLocation,
  } = useReports();
  const { t } = useLanguage();

  if (locationPermissionStatus !== 'prompt') return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-40 sm:max-w-md pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="rounded-spatial-lg glass-panel bg-[#1E2938]/95 dark:bg-[#1E2938]/95 light:bg-white border border-white/15 p-4 shadow-spatial-lg backdrop-blur-xl"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-spatial-blue/20 text-spatial-blue border border-spatial-blue/30 shrink-0">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-spatial-text">
                  {t.location.permissionPromptTitle}
                </h4>
                <button
                  onClick={dismissLocationPrompt}
                  className="text-spatial-muted hover:text-spatial-text p-1 rounded-lg"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-spatial-muted leading-relaxed mb-3">
                {t.location.permissionPromptDesc}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={requestUserLocation}
                  disabled={isDetectingLocation}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-spatial-blue hover:bg-blue-600 text-white shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isDetectingLocation ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5" />
                  )}
                  <span>{t.location.allowLocation}</span>
                </button>

                <button
                  type="button"
                  onClick={dismissLocationPrompt}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-spatial-muted hover:text-spatial-text hover:bg-white/5 transition-colors"
                >
                  {t.location.useManual}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
