import React from 'react';
import { ReportItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { CATEGORY_CONFIG, URGENCY_CONFIG, STATUS_CONFIG } from '../lib/categories';
import { MapPin, ThumbsUp, ChevronRight } from 'lucide-react';

interface IssueCardProps {
  report: ReportItem;
  onSelect: (report: ReportItem) => void;
  compact?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({ report, onSelect, compact = false }) => {
  const { t, language } = useLanguage();
  const { toggleVote } = useReports();

  const categoryMeta = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.other;
  const CategoryIcon = categoryMeta.icon;
  const urgencyMeta = URGENCY_CONFIG[report.urgency] || URGENCY_CONFIG.medium;
  const statusMeta = STATUS_CONFIG[report.status] || STATUS_CONFIG.submitted;
  const StatusIcon = statusMeta.icon;

  const formattedDate = new Date(report.created_at).toLocaleDateString(
    language === 'hi' ? 'hi-IN' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  // Shorten the ID for display
  const shortId = report.id.split('-').pop()?.slice(0, 6).toUpperCase() ?? report.id.slice(-6).toUpperCase();

  return (
    <div
      onClick={() => onSelect(report)}
      className="group relative rounded-spatial-lg bg-spatial-card border border-spatial-border hover:border-spatial-blue/30 hover:bg-spatial-cardHover transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Left accent bar based on urgency */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-opacity ${
          report.urgency === 'critical' ? 'bg-red-500' :
          report.urgency === 'high' ? 'bg-orange-500' :
          report.urgency === 'medium' ? 'bg-amber-400' :
          'bg-emerald-500'
        } opacity-0 group-hover:opacity-100`}
      />

      <div className="flex gap-3.5 p-4 items-start">
        {/* Thumbnail / icon */}
        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-spatial-sm overflow-hidden bg-spatial-bg border border-spatial-border flex items-center justify-center">
          {report.photos && report.photos.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={report.photos[0]}
                alt={report.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {report.photos.length > 1 && (
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                  +{report.photos.length - 1}
                </span>
              )}
            </div>
          ) : (
            <div className={`p-2.5 rounded-xl ${categoryMeta.bgLight}`}>
              <CategoryIcon className={`w-7 h-7 ${categoryMeta.color}`} />
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 self-stretch flex flex-col justify-between gap-2">
          {/* Top: title + urgency */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-spatial-text group-hover:text-spatial-blue transition-colors line-clamp-1 leading-snug flex-1 min-w-0">
              {report.title}
            </h3>
            <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${urgencyMeta.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${urgencyMeta.dot}`} />
              {t.urgencies[report.urgency] || urgencyMeta.label}
            </span>
          </div>

          {/* Location */}
          <p className="flex items-center gap-1 text-xs text-spatial-muted truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{report.location_text}</span>
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-spatial-border">
            {/* Category + status badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${categoryMeta.bgLight} ${categoryMeta.color} border ${categoryMeta.borderColor}`}>
                <CategoryIcon className="w-2.5 h-2.5" />
                {t.categories[report.category] || report.category}
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusMeta.badge}`}>
                <StatusIcon className="w-2.5 h-2.5" />
                {t.statuses[report.status] || report.status}
              </span>
            </div>

            {/* Right: date + vote + arrow */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:block text-[10px] text-spatial-muted/60">{formattedDate}</span>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleVote(report.id); }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all border ${
                  report.has_voted
                    ? 'bg-spatial-blue/15 text-spatial-blue border-spatial-blue/30'
                    : 'bg-transparent text-spatial-muted border-spatial-border hover:border-spatial-blue/30 hover:text-spatial-blue'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                {report.votes_count || 0}
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-spatial-muted group-hover:text-spatial-blue group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
