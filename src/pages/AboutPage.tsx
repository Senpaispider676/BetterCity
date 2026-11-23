import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { Compass, ShieldCheck, MapPin, Users, HeartHandshake, ArrowRight, Target } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  const { openReportModal } = useReports();

  return (
    <div className="min-h-[calc(100vh-68px)] max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Brand Header */}
      <div className="space-y-3 text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto overflow-hidden bg-spatial-blue/15 border border-white/10 flex items-center justify-center">
          <img src="/logo.webp" alt="Better City" className="w-full h-full object-contain p-1.5" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-spatial-text tracking-tight">
          {t.about.title}
        </h1>

        <p className="text-sm sm:text-base text-spatial-blue font-medium">
          {t.about.tagline}
        </p>
      </div>

      {/* Mission Section */}
      <div className="rounded-spatial-xl glass-panel p-6 sm:p-8 border border-white/10 space-y-3 shadow-spatial-sm">
        <div className="flex items-center gap-2 text-spatial-blue font-bold text-sm uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>{t.about.missionTitle}</span>
        </div>
        <p className="text-xs sm:text-sm text-spatial-text/90 leading-relaxed">
          {t.about.missionDesc}
        </p>
      </div>

      {/* Grid of 4 Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Why Better City Exists */}
        <div className="rounded-spatial-lg glass-panel p-6 border border-white/10 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-spatial-blue/15 text-spatial-blue flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-spatial-text">
            {t.about.whyExistsTitle}
          </h3>
          <p className="text-xs sm:text-sm text-spatial-muted leading-relaxed">
            {t.about.whyExistsDesc}
          </p>
        </div>

        {/* How Citizen Reporting Works */}
        <div className="rounded-spatial-lg glass-panel p-6 border border-white/10 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-spatial-orange/15 text-spatial-orange flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-spatial-text">
            {t.about.citizenReportingTitle}
          </h3>
          <p className="text-xs sm:text-sm text-spatial-muted leading-relaxed">
            {t.about.citizenReportingDesc}
          </p>
        </div>

        {/* Why Location-Based Reporting Matters */}
        <div className="rounded-spatial-lg glass-panel p-6 border border-white/10 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-spatial-green/15 text-spatial-green flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-spatial-text">
            {t.about.spatialMattersTitle}
          </h3>
          <p className="text-xs sm:text-sm text-spatial-muted leading-relaxed">
            {t.about.spatialMattersDesc}
          </p>
        </div>

        {/* How Communities Improve Their Cities */}
        <div className="rounded-spatial-lg glass-panel p-6 border border-white/10 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-spatial-text">
            {t.about.communityTitle}
          </h3>
          <p className="text-xs sm:text-sm text-spatial-muted leading-relaxed">
            {t.about.communityDesc}
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <button
          onClick={openReportModal}
          className="px-6 py-3 rounded-xl font-semibold text-sm bg-spatial-blue hover:bg-blue-600 text-white shadow-md inline-flex items-center gap-2 transition-all"
        >
          <span>{t.nav.reportIssue}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
