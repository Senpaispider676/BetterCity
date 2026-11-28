import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ActiveTab } from '../types';
import {
  Home,
  MapPin,
  Users,
  Info,
  HelpCircle,
  Mail,
  PlusCircle,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Compass,
  ShieldCheck,
  Lock,
  BookOpen,
  Volume2,
  VolumeX,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { activeTab, setActiveTab, openReportModal } = useReports();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const {
    isAccessibilityOn,
    speechEnabled,
    fontScale,
    highContrast,
    toggleAccessibility,
    toggleSpeech,
    increaseFont,
    decreaseFont,
    resetFont,
    toggleHighContrast,
  } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const navLinks: Array<{ tab: ActiveTab; label: string; icon: React.ReactNode }> = [
    { tab: 'home', label: t.nav.home || 'Home', icon: <Home className="w-4 h-4" /> },
    { tab: 'representatives', label: t.nav.representatives, icon: <Users className="w-4 h-4" /> },
    { tab: 'explanation', label: t.nav.explanation, icon: <HelpCircle className="w-4 h-4" /> },
    { tab: 'docs', label: t.nav.docs || 'Docs', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'about', label: t.nav.about, icon: <Info className="w-4 h-4" /> },
    { tab: 'contact', label: t.nav.contact, icon: <Mail className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 py-3 pointer-events-none">
      <nav className="pointer-events-auto max-w-7xl mx-auto rounded-spatial-lg bg-white/95 dark:bg-spatial-card border border-slate-200/80 dark:border-spatial-border px-3 sm:px-5 py-2.5 flex items-center justify-between shadow-lg shadow-slate-200/50 dark:shadow-spatial transition-all duration-300 backdrop-blur-xl">
        
        {/* Brand / Logo */}
        <div
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center bg-spatial-blue/10 border border-spatial-border group-hover:scale-105 transition-transform duration-200">
            {!logoError ? (
              <img
                src="/logo.webp"
                alt="Better City"
                className="w-full h-full object-contain p-0.5"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Compass className="w-5 h-5 text-spatial-blue" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-base sm:text-lg text-spatial-text group-hover:text-spatial-blue transition-colors leading-none">
              Better City
            </span>
            <span className="text-[10px] text-spatial-muted font-medium tracking-wide uppercase mt-0.5 hidden sm:inline-block">
              {t.brandTagline || 'Small acts, big change'}
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200/90 dark:border-spatial-border shadow-inner">
          {navLinks.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className={`
                  relative px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200
                  ${isActive
                    ? 'text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-spatial-muted hover:text-slate-900 dark:hover:text-spatial-text hover:bg-white/80 dark:hover:bg-spatial-card'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-slate-900 dark:bg-spatial-blue rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-spatial-muted'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section: Theme, Language, Report CTA, Officer portal & Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <ThemeToggle />
          {/* Accessibility Controls */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setAccOpen(!accOpen)}
              title="Accessibility Tools (Voice & Large Text)"
              aria-label="Accessibility Settings"
              className={`p-2 rounded-xl border transition-all duration-200 relative ${
                isAccessibilityOn || speechEnabled || fontScale > 1
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-spatial-border bg-slate-100/80 dark:bg-spatial-bg hover:bg-slate-200/80 dark:hover:bg-spatial-card text-slate-600 dark:text-spatial-muted hover:text-slate-900 dark:hover:text-spatial-text'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {(isAccessibilityOn || speechEnabled || fontScale > 1) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-spatial-card animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {accOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  className="origin-top-right absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-spatial-card border border-slate-200 dark:border-spatial-border shadow-2xl p-3 z-50 text-xs backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-spatial-border">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-spatial-text">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>Accessibility Hub</span>
                    </div>
                    <button
                      onClick={() => setAccOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-spatial-text"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 1-Click Master Mode */}
                  <div className="mb-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-spatial-text text-xs">
                          Accessibility Mode
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-spatial-muted">
                          Enlarged text + voice reader
                        </div>
                      </div>
                      <button
                        onClick={toggleAccessibility}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                          isAccessibilityOn
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-slate-200 dark:bg-spatial-card text-slate-700 dark:text-spatial-muted hover:bg-slate-300'
                        }`}
                      >
                        {isAccessibilityOn ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>

                  {/* Text To Speech */}
                  <div className="flex items-center justify-between py-2 px-1 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-spatial-text">
                      {speechEnabled ? (
                        <Volume2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Text-to-Speech (TTS)</span>
                    </div>
                    <button
                      onClick={toggleSpeech}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        speechEnabled
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-spatial-bg text-slate-500 dark:text-spatial-muted'
                      }`}
                    >
                      {speechEnabled ? 'Speaking' : 'Muted'}
                    </button>
                  </div>

                  {/* Font Size Scaling */}
                  <div className="py-2.5 px-1 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-1.5 text-slate-700 dark:text-spatial-text">
                      <span>Font Size</span>
                      <span className="font-mono text-emerald-500 font-bold">
                        {Math.round(fontScale * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={decreaseFont}
                        className="flex-1 py-1 px-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-spatial-text font-bold text-center"
                        title="Smaller text"
                      >
                        A-
                      </button>
                      <button
                        onClick={resetFont}
                        className="py-1 px-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-spatial-muted text-[10px]"
                        title="Reset size"
                      >
                        Reset
                      </button>
                      <button
                        onClick={increaseFont}
                        className="flex-1 py-1 px-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-spatial-text font-bold text-center text-sm"
                        title="Larger text"
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between pt-2 px-1">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-spatial-text">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span>High Contrast</span>
                    </div>
                    <button
                      onClick={toggleHighContrast}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        highContrast
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-spatial-bg text-slate-500 dark:text-spatial-muted'
                      }`}
                    >
                      {highContrast ? 'Active' : 'Normal'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Report Issue CTA Button */}
          <button
            onClick={openReportModal}
            className="px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-gradient-to-r dark:from-spatial-blue dark:to-blue-600 text-white shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2] shrink-0" />
            <span className="hidden sm:inline">{t.nav.reportIssue}</span>
            <span className="sm:hidden">Report</span>
          </button>

          {/* Officer Admin Portal Discreet Link (hidden on small mobile to avoid overflow, available in drawer menu) */}
          <button
            onClick={() => handleTabClick('admin')}
            title="Officer & Admin Console"
            className={`hidden sm:flex p-2 rounded-xl border transition-colors ${
              activeTab === 'admin'
                ? 'bg-slate-900 dark:bg-spatial-blue text-white border-slate-900 dark:border-spatial-blue shadow-sm'
                : 'border-slate-200 dark:border-spatial-border bg-slate-100/80 dark:bg-spatial-bg hover:bg-slate-200/80 dark:hover:bg-spatial-card text-slate-600 dark:text-spatial-muted hover:text-slate-900 dark:hover:text-spatial-text'
            }`}
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Authentication & Profile */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200 dark:border-spatial-border bg-slate-100/80 dark:bg-spatial-bg hover:bg-slate-200/80 dark:hover:bg-spatial-card transition-colors text-xs font-medium shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg overflow-hidden bg-spatial-blue/20 flex items-center justify-center text-spatial-blue text-xs font-bold">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                  ) : (
                    user.display_name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="max-w-[80px] sm:max-w-[110px] truncate hidden md:inline text-spatial-text">
                  {user.display_name}
                </span>
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-spatial-card border border-spatial-border p-1.5 z-50 text-xs shadow-spatial-lg"
                  >
                    <div className="px-3 py-2 border-b border-spatial-border mb-1">
                      <p className="font-semibold text-spatial-text truncate">{user.display_name}</p>
                      <p className="text-[11px] text-spatial-muted truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-spatial-bg text-spatial-text transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-spatial-blue" />
                      <span>{t.nav.dashboard}</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-red-500/10 text-spatial-red transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.nav.signOut}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              className="px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-spatial-border bg-slate-100/80 dark:bg-spatial-bg hover:bg-slate-200/80 dark:hover:bg-spatial-card text-slate-800 dark:text-spatial-text transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-spatial-muted" />
              <span className="hidden xs:inline">{t.nav.signIn}</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-spatial-border bg-spatial-bg text-spatial-text hover:bg-spatial-card transition-colors shrink-0"
            aria-label="Open mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto lg:hidden mt-2 max-w-sm mx-auto rounded-spatial-lg bg-spatial-card border border-spatial-border p-4 shadow-spatial-lg"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleTabClick(item.tab)}
                    className={`
                      w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-colors
                      ${isActive
                        ? 'bg-slate-900 dark:bg-spatial-blue text-white font-semibold shadow-sm'
                        : 'text-slate-600 dark:text-spatial-muted hover:text-slate-900 dark:hover:text-spatial-text hover:bg-slate-100 dark:hover:bg-spatial-bg'
                      }
                    `}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => handleTabClick('admin')}
                className={`
                  w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-colors
                  ${activeTab === 'admin'
                    ? 'bg-spatial-blue text-white font-semibold'
                    : 'text-spatial-muted hover:text-spatial-text hover:bg-spatial-bg'
                  }
                `}
              >
                <Lock className="w-4 h-4 text-spatial-orange" />
                <span>Officer Admin Console</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => handleTabClick('dashboard')}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-colors
                    ${activeTab === 'dashboard'
                      ? 'bg-spatial-blue text-white font-semibold'
                      : 'text-spatial-muted hover:text-spatial-text hover:bg-spatial-bg'
                    }
                  `}
                >
                  <LayoutDashboard className="w-4 h-4 text-spatial-blue" />
                  <span>{t.nav.dashboard}</span>
                </button>
              )}

              {/* Mobile Accessibility Bar */}
              <div className="pt-3 mt-2 border-t border-spatial-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-spatial-text font-medium">
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                  <span>Accessibility Mode</span>
                </div>
                <button
                  onClick={toggleAccessibility}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isAccessibilityOn
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-spatial-muted'
                  }`}
                >
                  {isAccessibilityOn ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-spatial-muted">Language / भाषा</span>
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
