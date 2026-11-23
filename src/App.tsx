import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ReportProvider, useReports } from './contexts/ReportContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { RepresentativesPage } from './pages/RepresentativesPage';
import { ExplanationPage } from './pages/ExplanationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { ReportModal } from './components/ReportModal';
import { AuthModal } from './components/AuthModal';
import { LocationPrompt } from './components/LocationPrompt';

const MainContent: React.FC = () => {
  const { activeTab } = useReports();

  return (
    <div className="relative min-h-screen flex flex-col bg-spatial-bg text-spatial-text transition-colors duration-200">
      {/* Floating Spatial Navbar */}
      <Navbar />

      {/* Main Pages Canvas */}
      <main className="flex-1 w-full">
        {(activeTab === 'home' || activeTab === 'map') && <LandingPage />}
        {activeTab === 'representatives' && <RepresentativesPage />}
        {activeTab === 'explanation' && <ExplanationPage />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'admin' && <AdminPage />}
      </main>

      {/* Global Spatial Modals & Overlays */}
      <ReportModal />
      <AuthModal />
      <LocationPrompt />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ReportProvider>
            <MainContent />
          </ReportProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
