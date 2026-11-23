import React, { useState } from 'react';
import { ReportItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { CATEGORY_CONFIG, URGENCY_CONFIG, STATUS_CONFIG } from '../lib/categories';
import {
  X,
  MapPin,
  Calendar,
  ThumbsUp,
  Copy,
  Check,
  ExternalLink,
  Building,
  User,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IssueDetailModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ report, onClose }) => {
  const { t, language } = useLanguage();
  const { toggleVote, setMapViewport } = useReports();
  const [copied, setCopied] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!report) return null;

  const categoryMeta = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.other;
  const CategoryIcon = categoryMeta.icon;
  const urgencyMeta = URGENCY_CONFIG[report.urgency] || URGENCY_CONFIG.medium;
  const statusMeta = STATUS_CONFIG[report.status] || STATUS_CONFIG.submitted;
  const StatusIcon = statusMeta.icon;

  const formattedDate = new Date(report.created_at).toLocaleDateString(
    language === 'hi' ? 'hi-IN' : 'en-US',
    { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  const handleCopyId = () => {
    navigator.clipboard.writeText(report.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = ['submitted', 'under_review', 'verified', 'in_progress', 'resolved'] as const;
  const currentStepIndex = steps.indexOf(report.status as any);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-spatial-xl bg-spatial-card border border-spatial-border shadow-spatial-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-spatial-border">
            <div className="flex items-center gap-2.5">
              <span className={`p-2 rounded-xl ${categoryMeta.bgLight} ${categoryMeta.color} border ${categoryMeta.borderColor}`}>
                <CategoryIcon className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-spatial-muted">{report.id}</span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 rounded hover:bg-spatial-bg text-spatial-muted hover:text-spatial-text transition-colors"
                    title="Copy Report ID"
                  >
                    {copied ? <Check className="w-3 h-3 text-spatial-green" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-xs text-spatial-muted flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-spatial-muted hover:text-spatial-text hover:bg-spatial-bg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Photos Carousel */}
            {report.photos && report.photos.length > 0 && (
              <div className="space-y-2">
                <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-spatial-bg border border-spatial-border">
                  <img
                    src={report.photos[selectedPhotoIndex] || report.photos[0]}
                    alt={report.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-medium text-white border border-white/10">
                    {selectedPhotoIndex + 1} / {report.photos.length}
                  </div>
                </div>

                {report.photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {report.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          selectedPhotoIndex === idx
                            ? 'border-spatial-blue scale-105'
                            : 'border-spatial-border opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Badges & Urgency */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl ${categoryMeta.bgLight} ${categoryMeta.color} border ${categoryMeta.borderColor}`}>
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{t.categories[report.category] || report.category}</span>
              </span>

              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl border ${statusMeta.badge}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{t.statuses[report.status] || report.status}</span>
              </span>

              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl ${urgencyMeta.badge}`}>
                <span className={`w-2 h-2 rounded-full ${urgencyMeta.dot}`} />
                <span>Urgency: {t.urgencies[report.urgency] || urgencyMeta.label}</span>
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-spatial-text leading-snug">
                {report.title}
              </h2>

              <p className="mt-2 text-sm text-spatial-muted leading-relaxed whitespace-pre-line">
                {report.description || 'No detailed description provided by the citizen.'}
              </p>
            </div>

            {/* Resolution Progress Bar */}
            <div className="p-4 rounded-2xl bg-spatial-bg border border-spatial-border">
              <h4 className="text-xs font-semibold text-spatial-muted uppercase tracking-wider mb-3">
                Civic Resolution Lifecycle
              </h4>

              <div className="relative flex items-center justify-between">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-spatial-border -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-spatial-blue -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 15)}%`,
                  }}
                />

                {steps.map((stepKey, idx) => {
                  const isCompleted = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={stepKey} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                          isCompleted
                            ? 'bg-spatial-blue border-spatial-blue text-white shadow-sm'
                            : 'bg-spatial-card border-spatial-border text-spatial-muted'
                        } ${isCurrent ? 'ring-4 ring-blue-500/30' : ''}`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className="text-[10px] text-spatial-muted font-medium mt-1 text-center hidden xs:inline-block max-w-[65px] truncate">
                        {t.statuses[stepKey] || stepKey}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Authority Update if present */}
            {report.official_response && (
              <div className="p-4 rounded-2xl bg-spatial-blue/10 border border-spatial-blue/25 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-spatial-blue">
                  <Building className="w-4 h-4" />
                  <span>{t.dashboard.officialUpdate}</span>
                </div>
                <p className="text-spatial-text leading-relaxed">
                  {report.official_response}
                </p>
              </div>
            )}

            {/* Location & Coordinates */}
            <div className="p-3.5 rounded-xl bg-spatial-bg border border-spatial-border flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-spatial-blue shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-spatial-text block">
                    {report.location_text}
                  </span>
                  <span className="text-[11px] text-spatial-muted font-mono mt-0.5 block">
                    GPS: {report.latitude.toFixed(5)}°N, {report.longitude.toFixed(5)}°E
                  </span>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 p-2 rounded-lg bg-spatial-card hover:bg-spatial-cardHover border border-spatial-border text-spatial-muted hover:text-spatial-text transition-colors"
                title="Open in Maps"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Submitter info */}
            <div className="flex items-center justify-between text-xs text-spatial-muted pt-2 border-t border-spatial-border">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-spatial-bg border border-spatial-border flex items-center justify-center text-spatial-text">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>
                  Reported by: <strong className="text-spatial-text font-medium">{report.anonymous ? t.map.anonymousReporter : (report.author_name || 'Active Citizen')}</strong>
                </span>
              </div>

              <span className="text-[11px] opacity-75">
                {report.anonymous ? 'Anonymous' : 'Verified Submitter'}
              </span>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-spatial-border flex items-center justify-between bg-spatial-bg">
            <button
              onClick={() => toggleVote(report.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                report.has_voted
                  ? 'bg-spatial-blue text-white shadow-md'
                  : 'bg-spatial-card hover:bg-spatial-cardHover text-spatial-text border border-spatial-border'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{report.has_voted ? t.map.upvoted : t.map.upvote}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-xs font-mono">
                {report.votes_count || 0}
              </span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-spatial-card hover:bg-spatial-cardHover border border-spatial-border text-spatial-text transition-colors"
            >
              {t.common.close}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
