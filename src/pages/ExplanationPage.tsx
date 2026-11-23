import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { Play, Sparkles, CheckCircle2, Eye, MapPin, ArrowRight, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export const ExplanationPage: React.FC = () => {
  const { t } = useLanguage();
  const { openReportModal, setActiveTab } = useReports();
  const [isPlaying, setIsPlaying] = useState(false);

  // Configurable video URL (e.g. YouTube civic tech demo, or direct MP4/Vimeo)
  const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';

  return (
    <div className="min-h-[calc(100vh-68px)] max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Hero Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spatial-blue/15 text-spatial-blue text-xs font-semibold border border-spatial-blue/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Overview</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-spatial-text tracking-tight leading-tight">
          {t.explanation.title}
        </h1>

        <p className="text-sm sm:text-base text-spatial-muted leading-relaxed">
          {t.explanation.subtitle}
        </p>
      </div>

      {/* Embedded Video Section */}
      <div className="relative rounded-spatial-xl glass-panel overflow-hidden border border-white/15 shadow-spatial-lg aspect-video max-w-4xl mx-auto bg-black/60 group">
        {!isPlaying ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Thumbnail Poster */}
            <img
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80"
              alt="Better City Platform Video"
              className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            {/* Play Button Overlay */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(true)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-spatial-blue text-white flex items-center justify-center shadow-spatial-lg hover:brightness-110 ring-8 ring-blue-500/20 transition-all cursor-pointer"
                aria-label="Play Video"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
              </motion.button>
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-md">
                {t.explanation.watchVideo}
              </span>
            </div>

            {/* Bottom Info Bar inside Video */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80">
              <span className="flex items-center gap-1.5 font-medium">
                <Video className="w-4 h-4 text-spatial-blue" />
                <span>Better City: Citizen Spatial Action</span>
              </span>
              <span className="font-mono">2:14</span>
            </div>
          </div>
        ) : (
          <iframe
            src={videoUrl}
            title="Better City Explanation Video"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* 3-Step Explanation */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-spatial-text">
          {t.explanation.stepsTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="rounded-spatial-lg glass-panel p-6 border border-white/10 space-y-3 relative overflow-hidden group hover:border-spatial-blue/40 transition-colors">
            <span className="font-mono text-3xl font-extrabold text-spatial-blue/40 group-hover:text-spatial-blue transition-colors">
              {t.explanation.step1Num}
            </span>
            <h3 className="font-bold text-base sm:text-lg text-spatial-text">
              {t.explanation.step1Title}
            </h3>
            <p className="text-xs sm:text-sm text-spatial-muted leading-relaxed">
              {t.explanation.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-spatial-lg glass-panel p-6 border border-white/10 space-y-3 relative overflow-hidden group hover:border-spatial-orange/40 transition-colors">
            <span className="font-mono text-3xl font-extrabold text-spatial-orange/40 group-hover:text-spatial-orange transition-colors">
              {t.explanation.step2Num}
            </span>
            <h3 className="font-bold text-base sm:text-lg text-spatial-text">
              {t.explanation.step2Title}
            </h3>
            <p className="text-xs sm:text-sm text-spatial-muted leading-relaxed">
              {t.explanation.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-spatial-lg glass-panel p-6 border border-white/10 space-y-3 relative overflow-hidden group hover:border-spatial-green/40 transition-colors">
            <span className="font-mono text-3xl font-extrabold text-spatial-green/40 group-hover:text-spatial-green transition-colors">
              {t.explanation.step3Num}
            </span>
            <h3 className="font-bold text-base sm:text-lg text-spatial-text">
              {t.explanation.step3Title}
            </h3>
            <p className="text-xs sm:text-sm text-spatial-muted leading-relaxed">
              {t.explanation.step3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* Quote Banner & CTA */}
      <div className="rounded-spatial-xl glass-panel p-6 sm:p-8 border border-white/10 text-center space-y-4 bg-gradient-to-b from-spatial-card/90 to-spatial-card/40">
        <blockquote className="text-base sm:text-lg font-medium italic text-spatial-text">
          {t.explanation.quoteText}
        </blockquote>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={openReportModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm bg-spatial-blue hover:bg-blue-600 text-white shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>{t.nav.reportIssue}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-sm bg-white/5 hover:bg-white/10 text-spatial-text border border-white/10 transition-colors"
          >
            <span>{t.dashboard.backToMap}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
