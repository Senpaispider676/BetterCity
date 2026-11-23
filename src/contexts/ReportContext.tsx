import React, { createContext, useContext, useEffect, useState } from 'react';
import { ReportItem, CategoryType, UrgencyType, ReportStatusType, ActiveTab } from '../types';
import { ReportService } from '../services/reports';
import { MapService, Coordinates } from '../services/maps';
import confetti from 'canvas-confetti';

interface ReportContextType {
  reports: ReportItem[];
  filteredReports: ReportItem[];
  selectedCategory: CategoryType | 'all';
  setSelectedCategory: (cat: CategoryType | 'all') => void;
  selectedStatus: ReportStatusType | 'all';
  setSelectedStatus: (status: ReportStatusType | 'all') => void;
  selectedUrgency: UrgencyType | 'all';
  setSelectedUrgency: (urgency: UrgencyType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'newest' | 'votes' | 'urgency';
  setSortBy: (sort: 'newest' | 'votes' | 'urgency') => void;

  // Active navigation tab
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Geolocation
  userLocation: Coordinates | null;
  userAddress: string;
  isDetectingLocation: boolean;
  locationPermissionStatus: 'idle' | 'prompt' | 'granted' | 'denied';
  requestUserLocation: () => Promise<void>;
  setUserLocationManually: (coords: Coordinates, address?: string) => void;
  dismissLocationPrompt: () => void;

  // Map viewport control
  mapCenter: Coordinates;
  mapZoom: number;
  setMapViewport: (coords: Coordinates, zoom?: number) => void;

  // Report modal & details modal
  isReportModalOpen: boolean;
  openReportModal: () => void;
  closeReportModal: () => void;
  activeReportForDetail: ReportItem | null;
  setActiveReportForDetail: (report: ReportItem | null) => void;

  // Core Actions
  toggleVote: (reportId: string) => void;
  submitNewReport: (data: Omit<ReportItem, 'id' | 'votes_count' | 'created_at' | 'updated_at'>) => Promise<ReportItem>;
  reloadReports: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<ReportItem[]>(() => ReportService.getAllReports());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ReportStatusType | 'all'>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'votes' | 'urgency'>('newest');

  // Location
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<'idle' | 'prompt' | 'granted' | 'denied'>(() => {
    if (!MapService.hasPromptedLocation()) return 'prompt';
    return 'idle';
  });

  // Map Center
  const [mapCenter, setMapCenter] = useState<Coordinates>(MapService.DEFAULT_COORDINATES);
  const [mapZoom, setMapZoom] = useState<number>(13);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [activeReportForDetail, setActiveReportForDetail] = useState<ReportItem | null>(null);

  // Reload reports
  const reloadReports = () => {
    setReports(ReportService.getAllReports());
  };

  // Trigger browser location detection
  const requestUserLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const coords = await MapService.getCurrentLocation();
      setUserLocation(coords);
      setMapCenter(coords);
      setMapZoom(15);
      setLocationPermissionStatus('granted');

      // Reverse geocode
      const address = await MapService.reverseGeocode(coords.lat, coords.lng);
      setUserAddress(address);
    } catch (err) {
      console.warn('Geolocation permission not given or failed:', err);
      setLocationPermissionStatus('denied');
      // Fallback address
      if (!userAddress) {
        setUserAddress('Connaught Place, New Delhi');
      }
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const setUserLocationManually = async (coords: Coordinates, address?: string) => {
    setUserLocation(coords);
    setMapCenter(coords);
    if (address) {
      setUserAddress(address);
    } else {
      const resolved = await MapService.reverseGeocode(coords.lat, coords.lng);
      setUserAddress(resolved);
    }
  };

  const dismissLocationPrompt = () => {
    MapService.markPromptedLocation(false);
    setLocationPermissionStatus('denied');
    if (!userAddress) {
      setUserAddress('Connaught Place, New Delhi');
    }
  };

  // Initial check on mount
  useEffect(() => {
    if (!MapService.hasPromptedLocation()) {
      // Show location permission prompt on first visit
      setLocationPermissionStatus('prompt');
    } else {
      // Auto-retrieve if previously granted
      navigator.permissions?.query({ name: 'geolocation' as PermissionName }).then((result) => {
        if (result.state === 'granted') {
          requestUserLocation();
        } else {
          setUserAddress('Barakhamba Road, Connaught Place, New Delhi');
        }
      }).catch(() => {
        setUserAddress('Barakhamba Road, Connaught Place, New Delhi');
      });
    }
  }, []);

  const setMapViewport = (coords: Coordinates, zoom = 15) => {
    setMapCenter(coords);
    setMapZoom(zoom);
  };

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const toggleVote = (reportId: string) => {
    const { voted, newCount } = ReportService.toggleVote(reportId);
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            votes_count: newCount,
            has_voted: voted,
          };
        }
        return r;
      })
    );

    if (activeReportForDetail && activeReportForDetail.id === reportId) {
      setActiveReportForDetail(prev => prev ? {
        ...prev,
        votes_count: newCount,
        has_voted: voted,
      } : null);
    }
  };

  const submitNewReport = async (data: Omit<ReportItem, 'id' | 'votes_count' | 'created_at' | 'updated_at'>): Promise<ReportItem> => {
    const created = await ReportService.createReport(data);
    reloadReports();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#2E9D68', '#FFB547', '#60A5FA'],
      });
    } catch {
      // Confetti fallback
    }

    return created;
  };

  // Filter and sort reports
  const filteredReports = reports.filter(r => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (selectedUrgency !== 'all' && r.urgency !== selectedUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchLoc = r.location_text.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchId) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'votes') {
      return (b.votes_count || 0) - (a.votes_count || 0);
    }
    if (sortBy === 'urgency') {
      const priorityMap: Record<UrgencyType, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityMap[b.urgency] - priorityMap[a.urgency];
    }
    // Newest
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <ReportContext.Provider
      value={{
        reports,
        filteredReports,
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
        activeTab,
        setActiveTab,
        userLocation,
        userAddress,
        isDetectingLocation,
        locationPermissionStatus,
        requestUserLocation,
        setUserLocationManually,
        dismissLocationPrompt,
        mapCenter,
        mapZoom,
        setMapViewport,
        isReportModalOpen,
        openReportModal,
        closeReportModal,
        activeReportForDetail,
        setActiveReportForDetail,
        toggleVote,
        submitNewReport,
        reloadReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
