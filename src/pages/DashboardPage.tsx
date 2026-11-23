import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useReports } from '../contexts/ReportContext';
import { useLanguage } from '../contexts/LanguageContext';
import { IssueCard } from '../components/IssueCard';
import { IssueDetailModal } from '../components/IssueDetailModal';
import { CategoryType, ReportStatusType } from '../types';
import {
  FileText,
  Clock,
  RotateCcw,
  CheckCircle2,
  Plus,
  Search,
  User,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { reports, openReportModal, activeReportForDetail, setActiveReportForDetail } = useReports();
  const { t } = useLanguage();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatusType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | 'all'>('all');

  const myReports = reports.filter((r) => {
    if (!isAuthenticated) return false;
    return (r.user_id && r.user_id === user?.id) || (user?.email && r.author_name === user.email);
  });

  const totalReportsCount = myReports.length;
  const openReportsCount = myReports.filter((r) => r.status === 'submitted' || r.status === 'under_review').length;
  const inProgressCount = myReports.filter((r) => r.status === 'in_progress' || r.status === 'verified').length;
  const resolvedCount = myReports.filter((r) => r.status === 'resolved').length;

  const filteredMyReports = myReports.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q) && !r.location_text.toLowerCase().includes(q))
        return false;
    }
    return true;
  });

  // ─── Unauthenticated gate ────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm rounded-spatial-xl bg-spatial-card border border-spatial-border shadow-spatial-lg p-10 text-center space-y-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-spatial-blue/10 border border-spatial-blue/20 flex items-center justify-center mx-auto">
            <User className="w-6 h-6 text-spatial-blue" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-spatial-text">{t.auth.signInTitle}</h2>
            <p className="text-sm text-spatial-muted leading-relaxed max-w-xs mx-auto">{t.auth.signInSubtitle}</p>
          </div>
          <button
            onClick={() => openAuthModal('signin')}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-spatial-blue hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition-colors"
          >
            {t.nav.signIn}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  const initials = user?.display_name
    ? user.display_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'C';

  // ─── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-68px)] max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-br from-spatial-blue/30 to-indigo-500/20 border border-spatial-blue/25 flex items-center justify-center shrink-0">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-spatial-blue">{initials}</span>
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold text-spatial-text leading-tight">
              {t.nav.welcome}, {user?.display_name}
            </h1>
            <p className="text-xs text-spatial-muted">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={openReportModal}
          className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold bg-spatial-blue hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t.dashboard.reportNewIssue}</span>
          <span className="sm:hidden">Report</span>
        </button>
      </div>

      {/* ── Stat strip ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          {
            label: t.dashboard.stats.totalReports,
            value: totalReportsCount,
            icon: FileText,
            accent: 'text-spatial-blue',
            bar: 'bg-spatial-blue',
            fill: totalReportsCount,
            max: Math.max(totalReportsCount, 1),
          },
          {
            label: t.dashboard.stats.openReports,
            value: openReportsCount,
            icon: Clock,
            accent: 'text-amber-400',
            bar: 'bg-amber-400',
            fill: openReportsCount,
            max: Math.max(totalReportsCount, 1),
          },
          {
            label: t.dashboard.stats.inProgress,
            value: inProgressCount,
            icon: RotateCcw,
            accent: 'text-indigo-400',
            bar: 'bg-indigo-400',
            fill: inProgressCount,
            max: Math.max(totalReportsCount, 1),
          },
          {
            label: t.dashboard.stats.resolved,
            value: resolvedCount,
            icon: CheckCircle2,
            accent: 'text-spatial-green',
            bar: 'bg-spatial-green',
            fill: resolvedCount,
            max: Math.max(totalReportsCount, 1),
          },
        ].map(({ label, value, icon: Icon, accent, bar, fill, max }) => (
          <motion.div
            key={label}
            variants={item}
            className="rounded-spatial-lg bg-spatial-card border border-spatial-border p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-spatial-muted font-medium">{label}</span>
              <Icon className={`w-3.5 h-3.5 ${accent}`} />
            </div>
            <span className={`text-3xl font-black tabular-nums ${accent}`}>{value}</span>
            {/* thin progress bar */}
            <div className="h-0.5 rounded-full bg-spatial-border overflow-hidden">
              <div
                className={`h-full rounded-full ${bar} transition-all duration-700`}
                style={{ width: `${(fill / max) * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Filter bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-spatial-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.dashboard.searchMyReports}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-spatial-card border border-spatial-border text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue/50 transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex gap-2">
          {[
            {
              value: statusFilter,
              onChange: (v: string) => setStatusFilter(v as any),
              options: [
                { value: 'all', label: 'All statuses' },
                { value: 'submitted', label: t.statuses.submitted },
                { value: 'under_review', label: t.statuses.under_review },
                { value: 'verified', label: t.statuses.verified },
                { value: 'in_progress', label: t.statuses.in_progress },
                { value: 'resolved', label: t.statuses.resolved },
              ],
            },
            {
              value: categoryFilter,
              onChange: (v: string) => setCategoryFilter(v as any),
              options: [
                { value: 'all', label: 'All categories' },
                { value: 'pothole', label: t.categories.pothole },
                { value: 'streetlight', label: t.categories.streetlight },
                { value: 'water_leak', label: t.categories.water_leak },
                { value: 'garbage', label: t.categories.garbage },
                { value: 'road_damage', label: t.categories.road_damage },
                { value: 'safety_hazard', label: t.categories.safety_hazard },
                { value: 'traffic', label: t.categories.traffic },
              ],
            },
          ].map(({ value, onChange, options }, i) => (
            <div key={i} className="relative">
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-spatial-card border border-spatial-border text-sm text-spatial-text focus:outline-none focus:border-spatial-blue/50 transition-colors cursor-pointer"
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-spatial-muted pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Reports list ── */}
      {filteredMyReports.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2.5"
        >
          {filteredMyReports.map((report) => (
            <motion.div key={report.id} variants={item}>
              <IssueCard
                report={report}
                onSelect={(r) => setActiveReportForDetail(r)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-spatial-xl bg-spatial-card border border-dashed border-spatial-border p-16 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-spatial-blue/8 border border-spatial-blue/15 flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5 text-spatial-blue/60" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-spatial-text">{t.dashboard.noReportsFound}</p>
            <p className="text-xs text-spatial-muted">{t.dashboard.anonymousNote}</p>
          </div>
          <button
            onClick={openReportModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-spatial-blue text-white hover:bg-blue-500 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.dashboard.reportNewIssue}
          </button>
        </motion.div>
      )}

      {/* Result count */}
      {filteredMyReports.length > 0 && (
        <p className="text-xs text-spatial-muted text-center pb-2">
          {filteredMyReports.length} report{filteredMyReports.length !== 1 ? 's' : ''}
          {statusFilter !== 'all' || categoryFilter !== 'all' || search ? ' matching filters' : ' total'}
        </p>
      )}

      <IssueDetailModal
        report={activeReportForDetail}
        onClose={() => setActiveReportForDetail(null)}
      />
    </div>
  );
};
