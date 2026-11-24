import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { IssueCard } from '../components/IssueCard';
import { IssueDetailModal } from '../components/IssueDetailModal';
import { SpotlightCard } from '../components/SpotlightCard';
import {
  MapPin,
  PlusCircle,
  Play,
  Camera,
  Navigation,
  ThumbsUp,
  RotateCcw,
  Building2,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { reports, setActiveTab, openReportModal, activeReportForDetail, setActiveReportForDetail } = useReports();

  // Pick top 4 featured reports for live ticker
  const featuredReports = reports.slice(0, 4);

  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-10 sm:pt-20 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Subtle radial glow behind headline */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 flex items-start justify-center"
        >
          <div className="w-[680px] h-[340px] rounded-full bg-spatial-blue/10 blur-[100px] mt-4" />
        </div>

        {/* Top badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold tracking-[0.2em] uppercase text-spatial-text/80 text-center mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-spatial-card border border-spatial-border shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-spatial-blue animate-pulse" />
          Civic Infrastructure · Real-Time Urban Redressal
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="text-[2.4rem] sm:text-6xl lg:text-7xl font-black text-spatial-text tracking-tight text-center leading-[1.08] max-w-4xl mx-auto"
        >
          {t.landing.heroTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="mt-5 text-sm sm:text-base text-spatial-muted max-w-xl mx-auto leading-relaxed text-center"
        >
          {t.landing.heroSubtitle}
        </motion.p>

        {/* Action CTAs with mouse hover physics */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={openReportModal}
            className="group w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-spatial-text text-spatial-bg hover:opacity-95 flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
            <span>{t.landing.reportProblem}</span>
          </button>

          <button
            onClick={() => document.getElementById('live-issues')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-spatial-card border border-spatial-border hover:border-spatial-borderHover text-spatial-text flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Browse Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('explanation')}
            className="w-full sm:w-auto px-4 py-3 text-sm font-medium text-spatial-muted hover:text-spatial-text flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{t.landing.watchDemo}</span>
          </button>
        </motion.div>

        {/* Stat strip — Interactive 3D Spotlight Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          className="mt-14 pt-8 border-t border-spatial-border grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { value: '4,820+', label: t.landing.stats.issuesResolved, color: 'text-spatial-blue' },
            { value: '12 Zones', label: t.landing.stats.activeZones, color: 'text-spatial-text' },
            { value: '98.4%', label: t.landing.stats.accuracy, color: 'text-spatial-blue' },
            { value: '1,240+', label: t.landing.stats.communityUpvotes, color: 'text-spatial-text' },
          ].map(({ value, label, color }) => (
            <SpotlightCard
              key={label}
              enableTilt={true}
              spotlightColor="rgba(255, 255, 255, 0.08)"
              className="p-4 rounded-xl border border-spatial-border bg-spatial-card hover:border-spatial-borderHover text-center cursor-pointer transition-all duration-300"
            >
              <div className={`text-2xl sm:text-3xl font-black tabular-nums ${color}`}>{value}</div>
              <div className="text-[11px] text-spatial-muted mt-1.5 leading-tight font-medium">{label}</div>
            </SpotlightCard>
          ))}
        </motion.div>
      </section>

      {/* 2. Social proof ticker */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto">
        <SpotlightCard
          enableTilt={false}
          spotlightColor="rgba(255, 255, 255, 0.06)"
          className="rounded-spatial-lg border border-spatial-border bg-spatial-card px-6 py-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-8"
        >
          {/* Live indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-spatial-blue animate-pulse" />
            <span className="text-xs font-semibold text-spatial-blue uppercase tracking-widest">Live</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-spatial-border shrink-0" />
          {/* Scrolling report excerpts */}
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-6 text-xs text-spatial-muted">
              <span><span className="text-spatial-text font-medium">Barakhamba Rd</span> — Critical pothole reported · MCD dispatched</span>
              <span className="hidden md:inline shrink-0">·</span>
              <span className="hidden md:inline shrink-0"><span className="text-spatial-text font-medium">Lajpat Nagar</span> — Streetlight outage · Under review</span>
              <span className="hidden lg:inline shrink-0">·</span>
              <span className="hidden lg:inline shrink-0"><span className="text-spatial-blue font-medium">Dwarka Sec-9</span> — Water leak resolved ✓</span>
            </div>
          </div>
          <button
            onClick={openReportModal}
            className="shrink-0 text-xs font-semibold text-spatial-blue hover:underline transition-colors"
          >
            File yours →
          </button>
        </SpotlightCard>
      </section>

      {/* 3. Live Issues Happening Now in Your City */}
      <section id="live-issues" className="px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-spatial-blue uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time Citizen Submissions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-spatial-text tracking-tight">
            {t.landing.liveIssuesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-spatial-muted mt-0.5">
            {t.landing.liveIssuesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredReports.map((report) => (
            <IssueCard
              key={report.id}
              report={report}
              onSelect={(r) => setActiveReportForDetail(r)}
            />
          ))}
        </div>
      </section>

      {/* 4. Features — editorial two-column layout with Spotlight Cards */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto space-y-10">
        <div className="max-w-xl space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-spatial-text tracking-tight leading-tight">
            {t.landing.featuresTitle}
          </h2>
          <p className="text-sm text-spatial-muted leading-relaxed">
            {t.landing.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-spatial-border rounded-spatial-lg overflow-hidden border border-spatial-border">
          {[
            {
              icon: Navigation,
              color: 'text-spatial-blue',
              bg: 'bg-spatial-blue/10',
              title: t.landing.features.gpsTitle,
              desc: t.landing.features.gpsDesc,
            },
            {
              icon: Camera,
              color: 'text-spatial-text',
              bg: 'bg-white/10 dark:bg-white/5 light:bg-black/5',
              title: t.landing.features.photoTitle,
              desc: t.landing.features.photoDesc,
            },
            {
              icon: Building2,
              color: 'text-spatial-blue',
              bg: 'bg-spatial-blue/10',
              title: t.landing.features.routingTitle,
              desc: t.landing.features.routingDesc,
            },
            {
              icon: ThumbsUp,
              color: 'text-spatial-text',
              bg: 'bg-white/10 dark:bg-white/5 light:bg-black/5',
              title: t.landing.features.votingTitle,
              desc: t.landing.features.votingDesc,
            },
            {
              icon: RotateCcw,
              color: 'text-spatial-blue',
              bg: 'bg-spatial-blue/10',
              title: t.landing.features.trackingTitle,
              desc: t.landing.features.trackingDesc,
            },
            {
              icon: Sparkles,
              color: 'text-spatial-text',
              bg: 'bg-white/10 dark:bg-white/5 light:bg-black/5',
              title: t.landing.features.accessibleTitle,
              desc: t.landing.features.accessibleDesc,
            },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <SpotlightCard
              key={title}
              enableTilt={false}
              spotlightColor="rgba(255, 255, 255, 0.05)"
              className="bg-spatial-card p-6 sm:p-8 flex gap-5 items-start group hover:bg-spatial-cardHover transition-colors cursor-pointer"
            >
              <div className={`shrink-0 w-9 h-9 rounded-xl ${bg} flex items-center justify-center border border-spatial-border`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-sm text-spatial-text group-hover:text-spatial-blue transition-colors">{title}</h3>
                <p className="text-xs text-spatial-muted leading-relaxed">{desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* 5. How It Works — horizontal connected steps */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-1.5">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-spatial-blue">Process</p>
          <h2 className="text-2xl sm:text-3xl font-black text-spatial-text">
            {t.landing.howTitle}
          </h2>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-5 left-[16.5%] right-[16.5%] h-px bg-spatial-border" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {[
              {
                n: '01',
                color: 'text-spatial-blue',
                dot: 'bg-spatial-blue',
                title: 'Snap & Geotag',
                desc: 'Open Better City, attach up to 4 photos, and let GPS automatically pinpoint the street defect.',
              },
              {
                n: '02',
                color: 'text-spatial-text',
                dot: 'bg-spatial-text',
                title: 'Community Upvoting',
                desc: 'Your report goes public. Neighbors verify and upvote, moving critical hazards to the top priority queue.',
              },
              {
                n: '03',
                color: 'text-spatial-blue',
                dot: 'bg-spatial-blue',
                title: 'Municipal Resolution',
                desc: 'Authorities dispatch field crews and post official status updates directly back to your report.',
              },
            ].map(({ n, color, dot, title, desc }) => (
              <SpotlightCard
                key={n}
                enableTilt={true}
                spotlightColor="rgba(255, 255, 255, 0.08)"
                className="p-5 rounded-2xl border border-spatial-border bg-spatial-card hover:border-spatial-borderHover flex flex-col items-center md:items-start text-center md:text-left gap-4 cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-spatial-border bg-spatial-card flex items-center justify-center shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${dot}`} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className={`text-xs font-bold tracking-widest uppercase ${color}`}>{n}</span>
                  <h3 className="font-bold text-base text-spatial-text">{title}</h3>
                  <p className="text-xs text-spatial-muted leading-relaxed">{desc}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA — High impact interactive container */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto">
        <SpotlightCard
          enableTilt={true}
          spotlightColor="rgba(255, 255, 255, 0.08)"
          className="rounded-spatial-xl bg-spatial-card border border-spatial-border p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-spatial-lg"
        >
          <div className="space-y-2 max-w-lg">
            <h2 className="text-xl sm:text-3xl font-black text-spatial-text tracking-tight leading-tight">
              {t.landing.ctaTitle}
            </h2>
            <p className="text-sm text-spatial-muted leading-relaxed">
              {t.landing.ctaSubtitle}
            </p>
          </div>
          <button
            onClick={openReportModal}
            className="shrink-0 px-6 py-3.5 rounded-xl font-semibold text-sm bg-spatial-text text-spatial-bg hover:opacity-90 flex items-center gap-2 transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            {t.nav.reportIssue}
          </button>
        </SpotlightCard>
      </section>

      {/* 7. Floating Spatial Footer */}
      <footer className="px-4 sm:px-6 max-w-7xl mx-auto pt-10 border-t border-spatial-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-spatial-muted">
          <div className="flex items-center gap-3">
            <img src="/logo.webp" alt="Better City" className="w-7 h-7 object-contain" />
            <div className="text-left">
              <span className="font-bold text-spatial-text block">Better City</span>
              <span className="text-[10px] text-spatial-blue">Spatial Civic Reporting Platform</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <button onClick={() => setActiveTab('representatives')} className="hover:text-spatial-text transition-colors">Representatives</button>
            <button onClick={() => setActiveTab('explanation')} className="hover:text-spatial-text transition-colors">Explanation</button>
            <button onClick={() => setActiveTab('about')} className="hover:text-spatial-text transition-colors">About</button>
            <button onClick={() => setActiveTab('contact')} className="hover:text-spatial-text transition-colors">Contact</button>
            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center gap-1 text-spatial-muted hover:text-spatial-text transition-colors font-mono"
            >
              <Lock className="w-3 h-3" />
              <span>Officer Portal</span>
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] font-mono text-spatial-muted">
            <span>© 2026 Better City. Emergency: 112 • Civic: 155305</span>
          </div>
        </div>
      </footer>

      {/* Details modal if an issue card is clicked */}
      <IssueDetailModal
        report={activeReportForDetail}
        onClose={() => setActiveReportForDetail(null)}
      />
    </div>
  );
};
