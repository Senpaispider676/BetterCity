import React, { useState, useEffect } from 'react';
import { useReports } from '../contexts/ReportContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { CategoryType, UrgencyType, ReportItem } from '../types';
import { PhotoUploader } from './PhotoUploader';
import { CategorySelector } from './CategorySelector';
import { LocationPicker } from './LocationPicker';
import { URGENCY_CONFIG } from '../lib/categories';
import {
  X,
  Send,
  UserCheck,
  UserX,
  CheckCircle2,
  MapPin,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    closeReportModal,
    submitNewReport,
    userLocation,
    userAddress,
    setMapViewport,
    setActiveTab,
  } = useReports();
  const { t } = useLanguage();
  const { user, isAuthenticated, openAuthModal, pendingReportDraft, setPendingReportDraft } = useAuth();

  // Form State
  const [photos, setPhotos] = useState<string[]>([]);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyType>('medium');
  const [locationText, setLocationText] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(userLocation || { lat: 28.6139, lng: 77.2090 });

  // Submission & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedReport, setSubmittedReport] = useState<ReportItem | null>(null);

  // Restore draft if user authenticated during reporting
  useEffect(() => {
    if (pendingReportDraft) {
      if (pendingReportDraft.photos) setPhotos(pendingReportDraft.photos);
      if (pendingReportDraft.category) setCategory(pendingReportDraft.category);
      if (pendingReportDraft.title) setTitle(pendingReportDraft.title);
      if (pendingReportDraft.description) setDescription(pendingReportDraft.description);
      if (pendingReportDraft.urgency) setUrgency(pendingReportDraft.urgency);
      if (pendingReportDraft.locationText) setLocationText(pendingReportDraft.locationText);
      if (pendingReportDraft.coords) setCoords(pendingReportDraft.coords);
    } else if (userAddress && !locationText) {
      setLocationText(userAddress);
      if (userLocation) setCoords(userLocation);
    }
  }, [pendingReportDraft, userAddress, userLocation]);

  if (!isReportModalOpen) return null;

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!category) {
      newErrors.category = t.report.validationErrors.categoryRequired;
    }
    if (!title.trim() || title.trim().length < 5) {
      newErrors.title = t.report.validationErrors.titleRequired;
    } else if (title.length > 280) {
      newErrors.title = t.report.validationErrors.titleTooLong;
    }
    if (!locationText.trim()) {
      newErrors.location = t.report.validationErrors.locationRequired;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    setPendingReportDraft({
      photos,
      category,
      title,
      description,
      urgency,
      locationText,
      coords,
    });
  };

  const handleSubmit = async (anonymous: boolean) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const newReport = await submitNewReport({
        title: title.trim(),
        description: description.trim(),
        category: category!,
        urgency,
        status: 'submitted',
        latitude: coords.lat,
        longitude: coords.lng,
        location_text: locationText.trim(),
        anonymous,
        photos,
        user_id: anonymous ? null : user?.id || null,
        author_name: anonymous ? undefined : user?.display_name || 'Citizen',
      });

      // Clear draft on successful submission
      setPendingReportDraft(null);
      setSubmittedReport(newReport);
    } catch (e) {
      console.error('Failed to submit report:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInAndSubmit = () => {
    handleSaveDraft();
    openAuthModal('signin');
  };

  const handleResetAndClose = () => {
    setSubmittedReport(null);
    setPhotos([]);
    setCategory(null);
    setTitle('');
    setDescription('');
    setUrgency('medium');
    setErrors({});
    closeReportModal();
  };

  const handleViewOnMap = () => {
    if (submittedReport) {
      setMapViewport({ lat: submittedReport.latitude, lng: submittedReport.longitude }, 17);
      handleResetAndClose();
      setActiveTab('map');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-3xl rounded-spatial-xl bg-spatial-card border border-spatial-border shadow-spatial-lg overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-spatial-border">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-spatial-text">
              {submittedReport ? t.report.successTitle : t.report.modalTitle}
            </h2>
            <p className="text-xs text-spatial-muted mt-0.5">
              {submittedReport ? t.report.successSub : t.report.modalSubtitle}
            </p>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-spatial-muted hover:text-spatial-text hover:bg-spatial-bg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {submittedReport ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-3xl bg-spatial-green/20 text-spatial-green border border-spatial-green/30 flex items-center justify-center mx-auto shadow-spatial">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-spatial-muted">
                  {t.report.reportIdLabel}
                </span>
                <p className="font-mono text-xl sm:text-2xl font-extrabold text-spatial-blue mt-1">
                  {submittedReport.id}
                </p>
              </div>

              {/* Issue Summary Card */}
              <div className="p-4 rounded-2xl bg-spatial-bg border border-spatial-border text-left max-w-lg mx-auto text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-spatial-text text-sm">
                    {submittedReport.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-spatial-blue/20 text-spatial-blue font-bold uppercase text-[10px]">
                    {t.categories[submittedReport.category]}
                  </span>
                </div>
                <p className="text-spatial-muted flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-spatial-blue shrink-0" />
                  <span className="truncate">{submittedReport.location_text}</span>
                </p>
                <div className="pt-2 border-t border-spatial-border flex items-center justify-between text-spatial-muted text-[11px]">
                  <span>Status: <strong>Under Review</strong></span>
                  <span>Urgency: <strong>{submittedReport.urgency.toUpperCase()}</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleViewOnMap}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-spatial-blue hover:bg-blue-600 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t.report.viewOnMap}</span>
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      handleResetAndClose();
                      setActiveTab('dashboard');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-spatial-card hover:bg-spatial-cardHover text-spatial-text border border-spatial-border flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{t.report.trackInDashboard}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedReport(null);
                    setPhotos([]);
                    setCategory(null);
                    setTitle('');
                    setDescription('');
                    setUrgency('medium');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-spatial-muted hover:text-spatial-text transition-colors cursor-pointer"
                >
                  {t.report.submitAnother}
                </button>
              </div>
            </motion.div>
          ) : (
            /* Multi-step Form */
            <div className="space-y-6">
              {/* Step 1: Photos */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-spatial-muted flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-spatial-blue/20 text-spatial-blue flex items-center justify-center text-[10px]">1</span>
                    <span>{t.report.stepPhotosTitle}</span>
                  </label>
                  <span className="text-[11px] text-spatial-muted">
                    {photos.length} / 4 photos
                  </span>
                </div>
                <PhotoUploader photos={photos} onChange={setPhotos} maxPhotos={4} />
              </section>

              {/* Step 2: Category */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-spatial-muted flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-spatial-blue/20 text-spatial-blue flex items-center justify-center text-[10px]">2</span>
                    <span>{t.report.stepCategoryTitle}</span>
                  </label>
                  {errors.category && (
                    <span className="text-xs text-spatial-red font-medium">{errors.category}</span>
                  )}
                </div>
                <CategorySelector
                  selectedCategory={category}
                  onSelect={(cat) => {
                    setCategory(cat);
                    if (errors.category) {
                      setErrors((prev) => ({ ...prev, category: '' }));
                    }
                  }}
                />
              </section>

              {/* Step 3: Title */}
              <section className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-spatial-muted flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-spatial-blue/20 text-spatial-blue flex items-center justify-center text-[10px]">3</span>
                    <span>{t.report.stepTitleTitle}</span>
                  </label>
                  <span className={`text-[11px] font-mono ${title.length > 260 ? 'text-spatial-orange font-bold' : 'text-spatial-muted'}`}>
                    {title.length} / 280
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  maxLength={280}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  placeholder={t.report.titlePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-spatial-input border border-spatial-inputBorder text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all"
                />
                {errors.title && (
                  <p className="text-xs text-spatial-red">{errors.title}</p>
                )}
              </section>

              {/* Step 4: Description */}
              <section className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-spatial-muted flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-spatial-blue/20 text-spatial-blue flex items-center justify-center text-[10px]">4</span>
                  <span>{t.report.stepDescriptionTitle}</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder={t.report.descriptionPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-spatial-input border border-spatial-inputBorder text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all resize-y"
                />
              </section>

              {/* Step 5: Urgency */}
              <section className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-spatial-muted flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-spatial-blue/20 text-spatial-blue flex items-center justify-center text-[10px]">5</span>
                  <span>{t.report.stepUrgencyTitle}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['low', 'medium', 'high', 'critical'] as UrgencyType[]).map((level) => {
                    const uMeta = URGENCY_CONFIG[level];
                    const isSelected = urgency === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setUrgency(level)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-spatial-blue/15 border-spatial-blue shadow-spatial-sm ring-1 ring-spatial-blue'
                            : 'bg-spatial-bg border-spatial-border hover:border-spatial-borderHover'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`w-2 h-2 rounded-full ${uMeta.dot}`} />
                          <span className="font-semibold text-xs text-spatial-text">
                            {t.urgencies[level]}
                          </span>
                        </div>
                        <p className="text-[10px] text-spatial-muted line-clamp-2 leading-tight">
                          {t.urgencyDescriptions[level]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Step 6: Location */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-spatial-muted flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-spatial-blue/20 text-spatial-blue flex items-center justify-center text-[10px]">6</span>
                    <span>{t.report.stepLocationTitle}</span>
                  </label>
                  {errors.location && (
                    <span className="text-xs text-spatial-red font-medium">{errors.location}</span>
                  )}
                </div>
                <LocationPicker
                  locationText={locationText}
                  coordinates={coords}
                  onChange={(txt, c) => {
                    setLocationText(txt);
                    setCoords(c);
                    if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                  }}
                />
              </section>

              {/* Step 7: Submission, Public Notice & Auth options */}
              <section className="pt-3 border-t border-spatial-border space-y-4">
                <div className="p-3.5 rounded-2xl bg-spatial-bg border border-spatial-border flex items-start gap-3 text-xs text-spatial-muted leading-relaxed">
                  <Shield className="w-4 h-4 text-spatial-blue shrink-0 mt-0.5" />
                  <p>{t.report.publicNotice}</p>
                </div>

                {/* Submission CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {isAuthenticated ? (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleSubmit(false)}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-spatial-blue hover:bg-blue-600 text-white shadow-spatial-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? t.report.submitting : `${t.report.signInAndSubmit} as ${user?.display_name}`}</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleSignInAndSubmit}
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-spatial-blue hover:bg-blue-600 text-white shadow-spatial-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{t.report.signInAndSubmit}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSubmit(true)}
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-medium bg-spatial-card hover:bg-spatial-cardHover text-spatial-text border border-spatial-border flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <UserX className="w-4 h-4 text-spatial-muted" />
                        <span>{isSubmitting ? t.report.submitting : t.report.reportWithoutAccount}</span>
                      </button>
                    </>
                  )}
                </div>

                {!isAuthenticated && (
                  <p className="text-[11px] text-spatial-muted text-center">
                    {t.report.anonymousDisclaimer}
                  </p>
                )}
              </section>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
