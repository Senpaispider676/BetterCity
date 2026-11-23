import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import { useReports } from '../contexts/ReportContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { IssueMarker, createUserLocationIcon } from '../components/IssueMarker';
import { IssueCard } from '../components/IssueCard';
import { IssueDetailModal } from '../components/IssueDetailModal';
import { CATEGORY_CONFIG } from '../lib/categories';
import { CategoryType, UrgencyType, ReportStatusType, ReportItem } from '../types';
import {
  Search,
  SlidersHorizontal,
  Navigation,
  Plus,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Compass,
  List,
  Map as MapIcon,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component to handle map center changes dynamically
const MapController: React.FC<{ center: { lat: number; lng: number }; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom, { duration: 1.2 });
  }, [center.lat, center.lng, zoom, map]);
  return null;
};

export const MapPage: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const {
    filteredReports,
    reports,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    selectedUrgency,
    setSelectedUrgency,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    mapCenter,
    mapZoom,
    setMapViewport,
    userLocation,
    requestUserLocation,
    isDetectingLocation,
    openReportModal,
    activeReportForDetail,
    setActiveReportForDetail,
  } = useReports();

  // Floating Explorer collapse state
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [tileMode, setTileMode] = useState<'carto' | 'osm'>('carto');

  // Tile layer URL based on theme
  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const categoriesList: CategoryType[] = [
    'pothole',
    'streetlight',
    'water_leak',
    'garbage',
    'road_damage',
    'safety_hazard',
    'traffic',
    'cleanup',
  ];

  return (
    <div className="relative w-full h-[calc(100vh-68px)] overflow-hidden bg-spatial-bg">
      {/* 1. Leaflet Interactive Map Canvas */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={mapZoom}
          zoomControl={false}
          className="w-full h-full"
        >
          <ZoomControl position="bottomright" />
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* CartoDB Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={
              theme === 'dark'
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
            }
          />

          {/* User Geolocation Marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserLocationIcon()}
            />
          )}

          {/* Issue Markers */}
          {filteredReports.map((report) => (
            <IssueMarker
              key={report.id}
              report={report}
              onSelect={(r) => {
                setActiveReportForDetail(r);
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* 2. Floating Top Search & Filter Bar */}
      <div className="absolute top-3 left-3 right-3 sm:left-6 sm:right-auto z-20 pointer-events-auto sm:w-[480px]">
        <div className="rounded-2xl glass-panel p-2 shadow-spatial-lg backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-spatial-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.map.searchPlaceholder}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-1 rounded-full text-spatial-muted hover:text-spatial-text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 font-medium ${
                filterMenuOpen || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedUrgency !== 'all'
                  ? 'bg-spatial-blue text-white border-spatial-blue'
                  : 'bg-white/5 border-white/10 text-spatial-muted hover:text-spatial-text'
              }`}
              title="Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden xs:inline">Filters</span>
            </button>
          </div>

          {/* Filter Popover */}
          <AnimatePresence>
            {filterMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 pt-2 border-t border-white/10 space-y-3 overflow-hidden text-xs"
              >
                {/* Category Pills */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-spatial-muted block mb-1.5">
                    Category
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-spatial-blue text-white font-semibold'
                          : 'bg-white/5 text-spatial-muted hover:text-spatial-text'
                      }`}
                    >
                      {t.map.allCategories}
                    </button>
                    {categoriesList.map((catKey) => {
                      const isSel = selectedCategory === catKey;
                      const meta = CATEGORY_CONFIG[catKey];
                      return (
                        <button
                          key={catKey}
                          onClick={() => setSelectedCategory(catKey)}
                          className={`px-2.5 py-1 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                            isSel
                              ? 'bg-spatial-blue text-white font-semibold'
                              : 'bg-white/5 text-spatial-muted hover:text-spatial-text'
                          }`}
                        >
                          <span>{t.categories[catKey]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status & Urgency Dropdowns */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-spatial-muted block mb-1">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-spatial-text text-xs focus:outline-none"
                    >
                      <option value="all">{t.map.allStatuses}</option>
                      <option value="submitted">{t.statuses.submitted}</option>
                      <option value="under_review">{t.statuses.under_review}</option>
                      <option value="verified">{t.statuses.verified}</option>
                      <option value="in_progress">{t.statuses.in_progress}</option>
                      <option value="resolved">{t.statuses.resolved}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-spatial-muted block mb-1">
                      Urgency
                    </label>
                    <select
                      value={selectedUrgency}
                      onChange={(e) => setSelectedUrgency(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-spatial-text text-xs focus:outline-none"
                    >
                      <option value="all">{t.map.allUrgencies}</option>
                      <option value="critical">{t.urgencies.critical}</option>
                      <option value="high">{t.urgencies.high}</option>
                      <option value="medium">{t.urgencies.medium}</option>
                      <option value="low">{t.urgencies.low}</option>
                    </select>
                  </div>
                </div>

                {/* Sort & Reset */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-spatial-muted text-[11px]">{t.map.sortBy}:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="p-1 rounded-lg bg-transparent text-spatial-text font-semibold text-xs focus:outline-none"
                    >
                      <option value="newest">{t.map.sortNewest}</option>
                      <option value="votes">{t.map.sortVotes}</option>
                      <option value="urgency">{t.map.sortUrgency}</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedStatus('all');
                      setSelectedUrgency('all');
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-1 text-[11px] text-spatial-blue hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.map.resetFilters}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Floating Map Controls (Locate Me, Re-center) */}
      <div className="absolute right-4 top-20 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={requestUserLocation}
          disabled={isDetectingLocation}
          className="p-2.5 rounded-2xl glass-panel bg-[#1E2938]/90 dark:bg-[#1E2938]/90 light:bg-white text-spatial-text hover:bg-spatial-blue hover:text-white transition-all shadow-spatial active:scale-95 disabled:opacity-50"
          title={t.map.locateMe}
        >
          <Navigation className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => setMapViewport({ lat: 28.6139, lng: 77.2090 }, 13)}
          className="p-2.5 rounded-2xl glass-panel bg-[#1E2938]/90 dark:bg-[#1E2938]/90 light:bg-white text-spatial-text hover:bg-spatial-blue hover:text-white transition-all shadow-spatial active:scale-95"
          title="Reset to City Center"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Floating Side Issue Explorer (visionOS & Apple Maps style) */}
      <div
        className={`
          absolute z-20 pointer-events-auto transition-all duration-300
          bottom-0 left-0 right-0 sm:left-6 sm:bottom-6 sm:right-auto sm:w-[420px]
          ${isExplorerOpen ? 'max-h-[58vh] sm:max-h-[calc(100vh-170px)]' : 'h-14'}
        `}
      >
        <div className="h-full flex flex-col rounded-t-spatial-xl sm:rounded-spatial-xl glass-panel bg-[#1E2938]/95 dark:bg-[#1E2938]/95 light:bg-white border border-white/10 shadow-spatial-lg overflow-hidden backdrop-blur-xl">
          {/* Explorer Header */}
          <div
            onClick={() => setIsExplorerOpen(!isExplorerOpen)}
            className="p-3.5 sm:p-4 flex items-center justify-between border-b border-white/10 cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-spatial-green animate-pulse" />
              <h3 className="font-bold text-xs sm:text-sm text-spatial-text">
                {t.map.activeReports}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-spatial-blue/20 text-spatial-blue font-mono text-[11px] font-bold">
                {filteredReports.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1 rounded-lg text-spatial-muted hover:text-spatial-text hover:bg-white/10"
              >
                {isExplorerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Explorer Issues Feed */}
          {isExplorerOpen && (
            <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-2.5">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <IssueCard
                    key={report.id}
                    report={report}
                    onSelect={(r) => {
                      setActiveReportForDetail(r);
                    }}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-spatial-muted text-xs space-y-2">
                  <p>{t.map.noIssuesFound}</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedStatus('all');
                      setSelectedUrgency('all');
                      setSearchQuery('');
                    }}
                    className="text-spatial-blue font-semibold hover:underline"
                  >
                    {t.map.resetFilters}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. Issue Detail Modal */}
      <IssueDetailModal
        report={activeReportForDetail}
        onClose={() => setActiveReportForDetail(null)}
      />
    </div>
  );
};
