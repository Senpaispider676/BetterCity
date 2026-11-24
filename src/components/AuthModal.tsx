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
