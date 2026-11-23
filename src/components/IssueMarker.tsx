import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ReportItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { ThumbsUp, ArrowRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface IssueMarkerProps {
  report: ReportItem;
  onSelect: (report: ReportItem) => void;
}

export const createIssueIcon = (report: ReportItem, isSelected = false) => {
  const isCritical = report.urgency === 'critical';
  const isResolved = report.status === 'resolved';

  let colorHex = '#3B82F6';
  if (isResolved) colorHex = '#2E9D68';
  else if (isCritical) colorHex = '#EF4444';
  else if (report.urgency === 'high') colorHex = '#FFB547';

  // Category Icon SVG Path representation or clean dot glyph
  const html = `
    <div class="relative group cursor-pointer flex items-center justify-center">
      ${isCritical ? `<div class="absolute -inset-2 rounded-full bg-red-500/30 animate-ping"></div>` : ''}
      <div 
        style="background: #1E2938; border: 2.5px solid ${colorHex}; box-shadow: 0 4px 14px rgba(0,0,0,0.4);"
        class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-115 ${isSelected ? 'scale-120 ring-4 ring-blue-500/40' : ''}"
      >
        <div style="background: ${colorHex};" class="w-3.5 h-3.5 rounded-full shadow-sm"></div>
      </div>
      <div style="background: #1E2938; border-color: ${colorHex}" class="absolute -bottom-1 w-2.5 h-2.5 rotate-45 border-r border-b"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-spatial-marker',
    iconSize: [40, 44],
    iconAnchor: [20, 42],
    popupAnchor: [0, -42],
  });
};

export const createUserLocationIcon = () => {
  const html = `
    <div class="relative flex items-center justify-center">
      <div class="absolute -inset-3 rounded-full bg-blue-500/30 animate-pulse"></div>
      <div class="w-5 h-5 rounded-full bg-spatial-blue border-2 border-white shadow-lg flex items-center justify-center">
        <div class="w-2 h-2 rounded-full bg-white"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'user-location-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const IssueMarker: React.FC<IssueMarkerProps> = ({ report, onSelect }) => {
  const { t } = useLanguage();
  const { toggleVote } = useReports();

  const icon = React.useMemo(() => createIssueIcon(report), [report.urgency, report.status]);

  return (
    <Marker
      position={[report.latitude, report.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(report),
      }}
    >
      <Popup className="spatial-leaflet-popup">
        <div className="p-3 w-64 text-spatial-text">
          {report.photos && report.photos.length > 0 && (
            <div className="w-full h-28 rounded-xl overflow-hidden mb-2.5 bg-black/40">
              <img
                src={report.photos[0]}
                alt={report.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-white/10 text-spatial-muted">
              {t.categories[report.category] || report.category}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-spatial-blue/20 text-spatial-blue">
              {t.statuses[report.status] || report.status}
            </span>
          </div>

          <h4 className="font-semibold text-xs leading-snug line-clamp-2 mb-1 text-white">
            {report.title}
          </h4>

          <p className="text-[11px] text-spatial-muted line-clamp-1 mb-2.5">
            {report.location_text}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVote(report.id);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                report.has_voted ? 'text-spatial-blue bg-spatial-blue/15' : 'text-spatial-muted hover:text-white'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{report.votes_count || 0}</span>
            </button>

            <button
              onClick={() => onSelect(report)}
              className="text-xs font-semibold text-spatial-blue hover:text-blue-400 flex items-center gap-1"
            >
              <span>{t.map.viewDetails}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
