import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    resetPassword,
    loginWithGoogle,
  } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authModalMode === 'signin') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      setIsSubmitting(true);
      const res = await login(email.trim(), password);
      setIsSubmitting(false);
      if (res.success) {
        closeAuthModal();
      } else {
        setErrorMsg(res.error || t.auth.authError);
      }
    } else if (authModalMode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please provide your name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      setIsSubmitting(true);
      const res = await register(name.trim(), email.trim(), password);
      setIsSubmitting(false);
      if (res.success) {
        closeAuthModal();
      } else {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    } else if (authModalMode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please provide a valid email address.');
        return;
      }
      setIsSubmitting(true);
      const res = await resetPassword(email.trim());
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg('Reset instructions have been sent to your email.');
      } else {
        setErrorMsg(res.error || 'Unable to process reset request.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md rounded-spatial-xl bg-spatial-card border border-spatial-border shadow-spatial-lg p-5 sm:p-7 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-spatial-muted hover:text-spatial-text hover:bg-spatial-bg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Branding & Heading */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 overflow-hidden bg-spatial-blue/15 border border-spatial-border flex items-center justify-center">
            <img src="/logo.webp" alt="Better City" className="w-full h-full object-contain p-1" />
          </div>

          <h2 className="text-xl font-bold text-spatial-text">
            {authModalMode === 'signin' && t.auth.signInTitle}
            {authModalMode === 'signup' && t.auth.createAccountTitle}
            {authModalMode === 'forgot' && t.auth.forgotPasswordTitle}
          </h2>
          <p className="text-xs text-spatial-muted mt-1">
            {authModalMode === 'signin' && t.auth.signInSubtitle}
            {authModalMode === 'signup' && t.auth.createAccountSubtitle}
            {authModalMode === 'forgot' && t.auth.forgotPasswordSubtitle}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-spatial-red text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-spatial-green/10 border border-spatial-green/20 text-spatial-green text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-spatial-muted uppercase tracking-wider block mb-1">
                {t.auth.fullName}
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3.5 text-spatial-muted pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-spatial-input border border-spatial-inputBorder text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-spatial-muted uppercase tracking-wider block mb-1">
              {t.auth.email}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3.5 text-spatial-muted pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-spatial-input border border-spatial-inputBorder text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all"
              />
            </div>
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-spatial-muted uppercase tracking-wider">
                  {t.auth.password}
                </label>
                {authModalMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('forgot');
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-spatial-blue hover:underline cursor-pointer"
                  >
                    {t.auth.forgotPasswordLink}
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-spatial-muted pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-spatial-input border border-spatial-inputBorder text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all"
                />
              </div>
            </div>
          )}

          {authModalMode === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-spatial-muted uppercase tracking-wider block mb-1">
                {t.auth.confirmPassword}
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-spatial-muted pointer-events-none" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-spatial-input border border-spatial-inputBorder text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-spatial-blue hover:bg-blue-600 text-white shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>
                  {authModalMode === 'signin' && t.auth.signInBtn}
                  {authModalMode === 'signup' && t.auth.createAccountBtn}
                  {authModalMode === 'forgot' && t.auth.sendResetLink}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Social Google Auth */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-spatial-border" />
          </div>
          <span className="relative px-3 text-[11px] text-spatial-muted bg-spatial-card">
            {t.auth.orContinueWith}
          </span>
        </div>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium bg-spatial-bg hover:bg-spatial-cardHover text-spatial-text border border-spatial-border flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t.auth.googleAuth}</span>
        </button>

        {/* Toggle between Modes */}
        <div className="mt-5 text-center text-xs text-spatial-muted">
          {authModalMode === 'signin' && (
            <p>
              {t.auth.noAccount}{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signup');
                  setErrorMsg('');
                }}
                className="text-spatial-blue font-semibold hover:underline cursor-pointer"
              >
                {t.auth.createAccountBtn}
              </button>
            </p>
          )}

          {authModalMode === 'signup' && (
            <p>
              {t.auth.haveAccount}{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signin');
                  setErrorMsg('');
                }}
                className="text-spatial-blue font-semibold hover:underline cursor-pointer"
              >
                {t.auth.signInBtn}
              </button>
            </p>
          )}

          {authModalMode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('signin');
                setErrorMsg('');
              }}
              className="text-spatial-blue font-semibold hover:underline cursor-pointer"
            >
              {t.auth.backToSignIn}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
