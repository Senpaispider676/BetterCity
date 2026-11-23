import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ReportService } from '../services/reports';
import { DiscordService } from '../services/discord';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  ExternalLink,
  Inbox
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string; message: string } | null>(null);

  const adminEmail = 'hr01829019@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(t.contact.errors.nameRequired);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(t.contact.errors.emailRequired);
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMsg(t.contact.errors.messageRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Submit message to internal admin queue / database
      await ReportService.submitContactMessage(name.trim(), email.trim(), message.trim());
      
      // 2. Post alert to Discord channel
      await DiscordService.sendContactMessageToDiscord(name.trim(), email.trim(), message.trim());

      setSubmittedData({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setErrorMsg('Failed to send message. Please try the direct email below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-spatial-blue/15 text-spatial-blue text-xs font-semibold border border-spatial-blue/20">
          <Mail className="w-3.5 h-3.5" />
          <span>Civic Helpdesk & Authority Liaison</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-spatial-text tracking-tight">
          {t.contact.title}
        </h1>

        <p className="text-xs sm:text-sm text-spatial-muted leading-relaxed max-w-lg mx-auto">
          {t.contact.subtitle}
        </p>

        {/* Target Email Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-spatial-card border border-spatial-border text-xs text-spatial-muted">
          <Inbox className="w-3.5 h-3.5 text-spatial-blue" />
          <span>Dispatched directly to: <strong className="text-spatial-text font-mono">{adminEmail}</strong></span>
        </div>
      </div>

      {/* Main Spatial Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-spatial-xl bg-spatial-card border border-spatial-border p-6 sm:p-8 shadow-spatial-lg space-y-6"
      >
        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-spatial-green/20 text-spatial-green border border-spatial-green/30 flex items-center justify-center mx-auto shadow-spatial">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-spatial-text">
              {t.contact.sentSuccessTitle}
            </h3>

            <p className="text-xs sm:text-sm text-spatial-muted max-w-md mx-auto leading-relaxed">
              Your inquiry has been queued into the Better City administrative inbox and addressed to <strong className="text-spatial-text">{adminEmail}</strong>.
            </p>

            {submittedData && (
              <div className="p-4 rounded-2xl bg-spatial-bg border border-spatial-border text-left max-w-md mx-auto text-xs space-y-1.5">
                <p className="text-spatial-muted">From: <strong className="text-spatial-text">{submittedData.name} ({submittedData.email})</strong></p>
                <p className="text-spatial-muted line-clamp-2">Message: "{submittedData.message}"</p>
                <div className="pt-2 border-t border-spatial-border flex items-center justify-between text-[11px] text-spatial-muted">
                  <span>Routing: <strong>Executive Desk & Discord Channel</strong></span>
                  <span className="text-spatial-green font-semibold">✓ Dispatched</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <a
                href={`mailto:${adminEmail}?subject=${encodeURIComponent(`Better City Message`)}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-spatial-blue hover:bg-blue-600 text-white shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Mail App</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setSubmittedData(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-medium text-spatial-muted hover:text-spatial-text hover:bg-spatial-bg border border-spatial-border transition-colors cursor-pointer"
              >
                Send Another Note
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-spatial-red text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="text-[11px] font-semibold text-spatial-muted uppercase tracking-wider block mb-1">
                {t.contact.nameLabel}
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3.5 text-spatial-muted pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.contact.namePlaceholder}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-spatial-input border border-spatial-inputBorder text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-semibold text-spatial-muted uppercase tracking-wider block mb-1">
                {t.contact.emailLabel}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-spatial-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.contact.emailPlaceholder}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-spatial-input border border-spatial-inputBorder text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-[11px] font-semibold text-spatial-muted uppercase tracking-wider block mb-1">
                {t.contact.messageLabel}
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full p-3.5 rounded-xl bg-spatial-input border border-spatial-inputBorder text-sm text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all resize-y"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-spatial-blue hover:bg-blue-600 text-white shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.contact.sending}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.contact.sendButton} ({adminEmail})</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Direct Email Callout */}
        <div className="pt-4 border-t border-spatial-border text-center text-xs text-spatial-muted">
          <span>{t.contact.preferEmail} </span>
          <a
            href={`mailto:${adminEmail}?subject=Better%20City%20enquiry`}
            className="text-spatial-blue font-semibold hover:underline"
          >
            {adminEmail}
          </a>
        </div>
      </motion.div>
    </div>
  );
};
