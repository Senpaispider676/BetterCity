import React, { useState } from 'react';
import { verifiedAuthorities } from '../services/authorities';
import { useLanguage } from '../contexts/LanguageContext';
import { AuthorityItem } from '../types';
import {
  Search,
  Building2,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  MapPin,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const RepresentativesPage: React.FC = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const cities = Array.from(new Set(verifiedAuthorities.map((a) => a.city)));
  const departments = Array.from(new Set(verifiedAuthorities.map((a) => a.department)));

  const filteredAuthorities = verifiedAuthorities.filter((auth) => {
    if (selectedCity !== 'all' && auth.city !== selectedCity) return false;
    if (selectedDept !== 'all' && auth.department !== selectedDept) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = auth.name.toLowerCase().includes(q);
      const matchDept = auth.department.toLowerCase().includes(q);
      const matchJuris = auth.jurisdiction.toLowerCase().includes(q);
      const matchDistrict = auth.district.toLowerCase().includes(q);
      const matchServices = auth.services.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchDept && !matchJuris && !matchDistrict && !matchServices) return false;
    }
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-68px)] max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-spatial-xl glass-panel p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-spatial-card/90 to-spatial-card/40 border border-white/10 shadow-spatial">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spatial-blue/15 text-spatial-blue text-xs font-semibold border border-spatial-blue/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>Civic Administration Directory</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-spatial-text tracking-tight">
            {t.representatives.title}
          </h1>

          <p className="text-xs sm:text-sm text-spatial-muted leading-relaxed">
            {t.representatives.subtitle}
          </p>
        </div>

        {/* Verification Note */}
        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-xs text-spatial-muted">
          <CheckCircle className="w-4 h-4 text-spatial-green shrink-0" />
          <span>{t.representatives.verifiedNotice}</span>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative flex items-center sm:col-span-1">
          <Search className="w-4 h-4 absolute left-3.5 text-spatial-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.representatives.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 text-xs sm:text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue transition-colors"
          />
        </div>

        {/* City Filter */}
        <div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 text-xs sm:text-sm text-spatial-text focus:outline-none focus:border-spatial-blue"
          >
            <option value="all">{t.representatives.allCities}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full py-2.5 px-3.5 rounded-xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 text-xs sm:text-sm text-spatial-text focus:outline-none focus:border-spatial-blue"
          >
            <option value="all">{t.representatives.allDepts}</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Authority Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAuthorities.map((auth) => (
          <motion.div
            key={auth.id}
            whileHover={{ y: -3 }}
            className={`rounded-spatial-lg glass-panel p-5 space-y-4 border transition-all duration-200 shadow-spatial-sm ${
              auth.emergency ? 'border-red-500/40 bg-red-500/5' : 'border-white/10'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-spatial-blue bg-spatial-blue/15 px-2 py-0.5 rounded-md inline-block mb-1">
                  {auth.city}
                </span>
                <h3 className="font-bold text-base text-spatial-text leading-snug">
                  {auth.name}
                </h3>
                <p className="text-xs text-spatial-muted mt-0.5">
                  {auth.department}
                </p>
              </div>

              {auth.emergency && (
                <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1 border border-red-500/30">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Emergency</span>
                </span>
              )}
            </div>

            {/* Jurisdiction */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-spatial-muted space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-spatial-text">
                <MapPin className="w-3.5 h-3.5 text-spatial-blue" />
                <span>{t.representatives.jurisdiction}:</span>
              </div>
              <p className="pl-5 leading-relaxed">{auth.jurisdiction}</p>
            </div>

            {/* Services Offered */}
            <div>
              <span className="text-[11px] font-semibold text-spatial-muted uppercase tracking-wider block mb-2">
                {t.representatives.servicesOffered}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {auth.services.map((svc, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-spatial-text"
                  >
                    {svc}
                  </span>
                ))}
              </div>
            </div>

            {/* Contacts & Portals Action Buttons */}
            <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {/* Phone */}
              <a
                href={`tel:${auth.phone}`}
                className="p-2.5 rounded-xl bg-spatial-green/15 text-spatial-green hover:bg-spatial-green/25 font-semibold flex items-center justify-center gap-1.5 transition-colors border border-spatial-green/25"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{auth.phone}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${auth.email}`}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-spatial-text font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/10 truncate"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Email</span>
              </a>

              {/* Complaint Portal */}
              <a
                href={auth.complaintPortal}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-spatial-blue/15 text-spatial-blue hover:bg-spatial-blue/25 font-semibold flex items-center justify-center gap-1.5 transition-colors border border-spatial-blue/25"
              >
                <span>Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
