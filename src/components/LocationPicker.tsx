import React, { useState, useEffect } from 'react';
import { useReports } from '../contexts/ReportContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MapService, Coordinates } from '../services/maps';
import { MapPin, Search, Navigation, Loader2, Check, AlertCircle } from 'lucide-react';

interface LocationPickerProps {
  locationText: string;
  coordinates: Coordinates;
  onChange: (locationText: string, coords: Coordinates) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  locationText,
  coordinates,
  onChange,
}) => {
  const { t } = useLanguage();
  const { isDetectingLocation, requestUserLocation, userLocation, userAddress } = useReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ label: string; lat: number; lng: number }>>([]);
  const [showResults, setShowResults] = useState(false);

  // Sync if initial was empty and userAddress is ready
  useEffect(() => {
    if (!locationText && userAddress && userLocation) {
      onChange(userAddress, userLocation);
    }
  }, [userAddress, userLocation]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await MapService.searchAddress(query);
      setSearchResults(results);
      setShowResults(true);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item: { label: string; lat: number; lng: number }) => {
    onChange(item.label, { lat: item.lat, lng: item.lng });
    setSearchQuery('');
    setShowResults(false);
  };

  const handleDetectClick = async () => {
    try {
      await requestUserLocation();
      const coords = await MapService.getCurrentLocation();
      const addr = await MapService.reverseGeocode(coords.lat, coords.lng);
      onChange(addr, coords);
    } catch {
      // Handled in context
    }
  };

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-spatial-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t.location.searchLocationPlaceholder}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 text-xs sm:text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 absolute right-3.5 text-spatial-blue animate-spin" />
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 z-30 rounded-xl glass-dropdown p-1.5 shadow-spatial-lg max-h-56 overflow-y-auto">
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectSearchResult(res)}
                className="w-full text-left p-2 rounded-lg text-xs hover:bg-white/10 flex items-start gap-2 text-spatial-text transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-spatial-blue shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{res.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Location Pill & Coordinates Display */}
      <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-50 border border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-spatial-blue/15 text-spatial-blue shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-spatial-muted block">
              {t.location.selectedLocation}
            </span>
            <input
              type="text"
              value={locationText}
              onChange={(e) => onChange(e.target.value, coordinates)}
              placeholder="e.g., Lampur, Narela, Delhi"
              className="bg-transparent border-none text-xs sm:text-sm font-medium text-spatial-text w-full focus:outline-none focus:ring-0 truncate p-0 mt-0.5"
            />
            <p className="text-[11px] font-mono text-spatial-muted mt-0.5">
              Coordinates: {coordinates.lat.toFixed(5)}°N, {coordinates.lng.toFixed(5)}°E
            </p>
          </div>
        </div>

        {/* Locate Me Button */}
        <button
          type="button"
          onClick={handleDetectClick}
          disabled={isDetectingLocation}
          className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold bg-spatial-blue/15 hover:bg-spatial-blue/25 text-spatial-blue border border-spatial-blue/30 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          {isDetectingLocation ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{t.location.useCurrentLocation}</span>
        </button>
      </div>

      {/* Helper text required by specification */}
      <p className="text-[11px] text-spatial-muted flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-spatial-blue shrink-0" />
        <span>{t.location.detected}</span>
      </p>
    </div>
  );
};
