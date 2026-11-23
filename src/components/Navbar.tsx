import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReports } from '../contexts/ReportContext';
import { useAuth } from '../contexts/AuthContext';
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
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { activeTab, setActiveTab, openReportModal } = useReports();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const navLinks: Array<{ tab: ActiveTab; label: string; icon: React.ReactNode }> = [
    { tab: 'home', label: t.nav.home || 'Home', icon: <Home className="w-4 h-4" /> },
    { tab: 'representatives', label: t.nav.representatives, icon: <Users className="w-4 h-4" /> },
    { tab: 'explanation', label: t.nav.explanation, icon: <HelpCircle className="w-4 h-4" /> },
    { tab: 'about', label: t.nav.about, icon: <Info className="w-4 h-4" /> },
    { tab: 'contact', label: t.nav.contact, icon: <Mail className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 py-3 pointer-events-none">
      <nav className="pointer-events-auto max-w-7xl mx-auto rounded-spatial-lg bg-spatial-card border border-spatial-border px-3 sm:px-5 py-2.5 flex items-center justify-between shadow-spatial transition-all duration-300 backdrop-blur-xl">
        
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
              Spatial Civic Network
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-1 bg-spatial-bg p-1 rounded-xl border border-spatial-border">
          {navLinks.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className={`
                  relative px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200
                  ${isActive
                    ? 'text-white font-semibold'
                    : 'text-spatial-muted hover:text-spatial-text hover:bg-spatial-card'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-spatial-blue rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className={isActive ? 'text-white' : 'text-spatial-muted'}>
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

          {/* Report Issue CTA Button */}
          <button
            onClick={openReportModal}
            className="px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 bg-gradient-to-r from-spatial-blue to-blue-600 text-white shadow-md hover:shadow-spatial-lg hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap"
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
                ? 'bg-spatial-blue text-white border-spatial-blue'
                : 'border-spatial-border bg-spatial-bg hover:bg-spatial-card text-spatial-muted hover:text-spatial-text'
            }`}
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Authentication & Profile */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-spatial-border bg-spatial-bg hover:bg-spatial-card transition-colors text-xs font-medium"
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
              className="px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-spatial-border bg-spatial-bg hover:bg-spatial-card text-spatial-text transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
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
                        ? 'bg-spatial-blue text-white font-semibold'
                        : 'text-spatial-muted hover:text-spatial-text hover:bg-spatial-bg'
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

              <div className="pt-3 mt-2 border-t border-spatial-border flex items-center justify-between">
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
