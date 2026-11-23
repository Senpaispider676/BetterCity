import React, { useState, useEffect } from 'react';
import { AdminService } from '../services/admin';
import { DiscordService } from '../services/discord';
import { ReportService } from '../services/reports';
import { ContactMessage, ReportStatusType } from '../types';
import { useReports } from '../contexts/ReportContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CATEGORY_CONFIG, STATUS_CONFIG } from '../lib/categories';
import {
  ShieldCheck,
  Key,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Unlock,
  RefreshCw,
  Loader2,
  Check,
  ExternalLink,
  Settings,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const { reports, reloadReports } = useReports();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AdminService.isAdminAuthenticated());
  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Silent Discord Webhook Dispatch State
  const [isSendingToken, setIsSendingToken] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Discord Webhook configuration modal/input
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const [webhookInput, setWebhookInput] = useState(() => DiscordService.getWebhookUrl());
  const [webhookSaved, setWebhookSaved] = useState(false);

  // Active Admin Tab: 'messages' | 'reports'
  const [adminTab, setAdminTab] = useState<'messages' | 'reports'>('reports');

  // Contact Messages Data
  const [messages, setMessages] = useState<ContactMessage[]>(() => AdminService.getContactMessages());

  // Report Moderation State
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatusType>('in_progress');
  const [officialNote, setOfficialNote] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const adminEmail = AdminService.ADMIN_EMAIL;
  const dailyTokenInfo = AdminService.getDailyAdminToken();

  // Calculate hours and minutes until token expiry
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = dailyTokenInfo.expiresAt.getTime() - now;
      if (diff <= 0) {
        setTimeLeft('Rotating now...');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (AdminService.verifyAdminToken(tokenInput)) {
      AdminService.setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setTokenInput('');
    } else {
      setErrorMsg('Invalid token. The token must match today’s active 24-digit administrative key.');
    }
  };

  // Silently dispatch token to Discord server, only show "Sent" on UI
  const handleRequestToken = async () => {
    setIsSendingToken(true);
    setErrorMsg('');

    try {
      await AdminService.sendAdminTokenEmail();
      setIsSent(true);
    } catch {
      setIsSent(true); // Always display Sent on screen without revealing anything
    } finally {
      setIsSendingToken(false);
    }
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    DiscordService.setWebhookUrl(webhookInput.trim());
    setWebhookSaved(true);
    setTimeout(() => {
      setWebhookSaved(false);
      setShowWebhookConfig(false);
    }, 1500);
  };

  const handleLogout = () => {
    AdminService.setAdminAuthenticated(false);
    setIsAuthenticated(false);
  };

  const handleMarkMessage = (id: string, status: 'new' | 'reviewed') => {
    AdminService.markMessageStatus(id, status);
    setMessages(AdminService.getContactMessages());
  };

  const handleSaveReportStatus = (reportId: string) => {
    AdminService.updateReportStatus(reportId, selectedStatus, officialNote);
    reloadReports();
    setSaveSuccessMsg(`Report ${reportId} updated to ${selectedStatus.toUpperCase()} successfully.`);
    setEditingReportId(null);
    setOfficialNote('');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleDeleteReport = (reportId: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete report "${title}" (${reportId})? This will immediately remove it from the website.`)) {
      ReportService.deleteReport(reportId);
      reloadReports();
      setSaveSuccessMsg(`Report ${reportId} has been permanently removed from the website.`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    }
  };

  // 1. Gate screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-68px)] max-w-lg mx-auto px-4 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-spatial-xl bg-spatial-card border border-spatial-border p-6 sm:p-8 shadow-spatial-lg space-y-6 text-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto shadow-spatial">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-spatial-text">
              Administrative Command Portal
            </h1>
            <p className="text-xs text-spatial-muted leading-relaxed">
              Restricted area. Managing civic dispatches and authority triage requires today's 24-digit rolling security token.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-spatial-red text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl bg-spatial-green/15 border border-spatial-green/30 text-spatial-green text-xs font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Sent</span>
            </motion.div>
          )}

          <form onSubmit={handleTokenSubmit} className="space-y-4 text-left">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-spatial-muted uppercase tracking-wider">
                  24-Digit Daily Security Token
                </label>
                <span className="text-[10px] text-spatial-muted font-mono">
                  Rotates every 24h ({timeLeft} left)
                </span>
              </div>
              <div className="relative flex items-center">
                <Key className="w-4 h-4 absolute left-3.5 text-spatial-muted pointer-events-none" />
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-spatial-input border border-spatial-inputBorder text-xs sm:text-sm font-mono text-spatial-text placeholder:text-spatial-muted focus:outline-none focus:border-spatial-blue focus:ring-1 focus:ring-spatial-blue transition-all"
                />
              </div>
              <p className="text-[11px] text-spatial-muted mt-1">
                Enter with or without hyphens (24 digits).
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-spatial-blue hover:bg-blue-600 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Authenticate & Access Command</span>
            </button>
          </form>

          {/* Trigger button: silently sends to Discord server and only shows "Sent" to user */}
          <div className="pt-3 border-t border-spatial-border text-center space-y-2">
            <button
              type="button"
              disabled={isSendingToken}
              onClick={handleRequestToken}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-spatial-bg hover:bg-spatial-cardHover border border-spatial-border text-spatial-blue hover:text-blue-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSendingToken ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isSent ? (
                <>
                  <Check className="w-3.5 h-3.5 text-spatial-green" />
                  <span className="text-spatial-green">Sent</span>
                </>
              ) : (
                <span>👉 Reveal today’s 24-digit key (officer verification)</span>
              )}
            </button>

            {/* Discreet Webhook Link Setup for the server owner */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowWebhookConfig(!showWebhookConfig)}
                className="text-[11px] text-spatial-muted hover:text-spatial-text flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <Settings className="w-3 h-3" />
                <span>Link Discord Webhook</span>
              </button>

              {showWebhookConfig && (
                <motion.form
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSaveWebhook}
                  className="mt-3 p-3.5 rounded-xl bg-spatial-bg border border-spatial-border text-left space-y-2 text-xs"
                >
                  <label className="text-[10px] uppercase font-bold text-spatial-muted block">
                    Discord Channel Webhook URL
                  </label>
                  <input
                    type="url"
                    value={webhookInput}
                    onChange={(e) => setWebhookInput(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full p-2 rounded-lg bg-spatial-card border border-spatial-border text-xs text-spatial-text focus:outline-none"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-spatial-muted">
                      Paste from Discord Server → Channel Settings → Integrations → Webhooks
                    </span>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-md bg-spatial-blue hover:bg-blue-600 text-white font-semibold text-[11px]"
                    >
                      {webhookSaved ? 'Saved!' : 'Save Webhook'}
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="min-h-[calc(100vh-68px)] max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Admin Status Bar */}
      <div className="rounded-spatial-xl bg-spatial-card border border-spatial-border p-5 sm:p-6 shadow-spatial-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-spatial-green/20 text-spatial-green border border-spatial-green/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-spatial-text">
                Administrative Operations Console
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-spatial-green/20 text-spatial-green text-[10px] font-bold uppercase">
                Active Session
              </span>
            </div>
            <p className="text-xs text-spatial-muted mt-0.5 font-mono">
              Managing queue for: <strong>{adminEmail}</strong> • Daily Token Rotates in {timeLeft}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="hidden md:flex flex-col text-right text-[11px] font-mono text-spatial-muted">
            <span>Security Key (24-digit):</span>
            <span className="text-spatial-blue font-bold">{dailyTokenInfo.formatted.slice(0, 14)}...</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/15 hover:bg-red-500/25 text-spatial-red border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-spatial-green/15 border border-spatial-green/30 text-spatial-green text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Tabs Switcher: Report Moderation vs Contact Messages */}
      <div className="flex items-center gap-2 border-b border-spatial-border pb-2">
        <button
          onClick={() => setAdminTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            adminTab === 'reports'
              ? 'bg-spatial-blue text-white shadow-sm'
              : 'text-spatial-muted hover:text-spatial-text hover:bg-spatial-card'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Civic Report Triage & Moderation ({reports.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            adminTab === 'messages'
              ? 'bg-spatial-blue text-white shadow-sm'
              : 'text-spatial-muted hover:text-spatial-text hover:bg-spatial-card'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Contact Inquiries ({messages.length})</span>
          {messages.some(m => m.status === 'new') && (
            <span className="w-2 h-2 rounded-full bg-spatial-orange animate-ping" />
          )}
        </button>
      </div>

      {/* Tab 1: Report Moderation & Status Updates & Deletions */}
      {adminTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-spatial-muted">
            <p>
              Moderate, update statuses, or delete civic reports. Changes immediately update across all platform feeds.
            </p>
            <button
              onClick={() => reloadReports()}
              className="flex items-center gap-1 text-spatial-blue hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Reports</span>
            </button>
          </div>

          <div className="space-y-3">
            {reports.map((report) => {
              const categoryMeta = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.other;
              const statusMeta = STATUS_CONFIG[report.status] || STATUS_CONFIG.submitted;
              const isEditing = editingReportId === report.id;

              return (
                <div
                  key={report.id}
                  className="rounded-spatial-lg bg-spatial-card border border-spatial-border p-4 sm:p-5 shadow-spatial-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-spatial-blue">{report.id}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${categoryMeta.bgLight} ${categoryMeta.color}`}>
                        {report.category}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusMeta.badge}`}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>

                    <span className="text-xs text-spatial-muted">
                      {report.location_text}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm sm:text-base text-spatial-text">
                    {report.title}
                  </h3>

                  {report.official_response && (
                    <div className="p-3 rounded-xl bg-spatial-blue/10 border border-spatial-blue/20 text-xs">
                      <span className="font-semibold text-spatial-blue block mb-0.5">Current Official Response:</span>
                      <p className="text-spatial-text">{report.official_response}</p>
                    </div>
                  )}

                  {/* Edit Controls */}
                  {isEditing ? (
                    <div className="p-4 rounded-xl bg-spatial-bg border border-spatial-border space-y-3 mt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-spatial-muted block mb-1">
                            New Resolution Status:
                          </label>
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as ReportStatusType)}
                            className="w-full p-2 rounded-xl bg-spatial-card border border-spatial-border text-xs text-spatial-text focus:outline-none"
                          >
                            <option value="submitted">Submitted</option>
                            <option value="under_review">Under Review</option>
                            <option value="verified">Verified</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-spatial-muted block mb-1">
                            Official Municipal Note / Work Order:
                          </label>
                          <input
                            type="text"
                            value={officialNote}
                            onChange={(e) => setOfficialNote(e.target.value)}
                            placeholder="e.g. MCD Zone 3 repair crew deployed with cold mix patch."
                            className="w-full p-2 rounded-xl bg-spatial-card border border-spatial-border text-xs text-spatial-text focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingReportId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs text-spatial-muted hover:text-spatial-text cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveReportStatus(report.id)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-spatial-blue hover:bg-blue-600 text-white cursor-pointer"
                        >
                          Save & Publish Update
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-spatial-border gap-2 text-xs">
                      <span className="text-spatial-muted">
                        Upvotes: <strong>{report.votes_count || 0}</strong> • Submitter: <strong>{report.author_name || 'Citizen'}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Status Update Button */}
                        <button
                          onClick={() => {
                            setEditingReportId(report.id);
                            setSelectedStatus(report.status);
                            setOfficialNote(report.official_response || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-spatial-blue/15 hover:bg-spatial-blue/25 text-spatial-blue font-semibold transition-colors cursor-pointer"
                        >
                          Change Status
                        </button>

                        {/* DELETE / REMOVE POST BUTTON REQUESTED BY USER */}
                        <button
                          onClick={() => handleDeleteReport(report.id, report.title)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-spatial-red border border-red-500/30 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Permanently remove this report from the website"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Post</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Contact Messages Queue */}
      {adminTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-spatial-muted">
            <p>
              Inquiries submitted through the Contact Form addressed to <strong className="text-spatial-text">{adminEmail}</strong>.
            </p>
            <button
              onClick={() => setMessages(AdminService.getContactMessages())}
              className="flex items-center gap-1 text-spatial-blue hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Queue</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-spatial-lg bg-spatial-card border border-spatial-border p-5 space-y-3.5 shadow-spatial-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-spatial-text">{msg.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          msg.status === 'new'
                            ? 'bg-spatial-orange/20 text-spatial-orange border border-spatial-orange/30'
                            : 'bg-spatial-green/20 text-spatial-green border border-spatial-green/30'
                        }`}
                      >
                        {msg.status === 'new' ? 'Unanswered' : 'Reviewed'}
                      </span>
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-spatial-blue hover:underline font-mono"
                    >
                      {msg.email}
                    </a>
                  </div>

                  <span className="text-[11px] text-spatial-muted font-mono">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-spatial-bg border border-spatial-border text-xs text-spatial-text leading-relaxed whitespace-pre-line">
                  {msg.message}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-spatial-border text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkMessage(msg.id, msg.status === 'new' ? 'reviewed' : 'new')}
                      className="px-2.5 py-1 rounded-lg border border-spatial-border hover:bg-spatial-bg text-spatial-muted hover:text-spatial-text transition-colors cursor-pointer"
                    >
                      Mark as {msg.status === 'new' ? 'Reviewed' : 'New'}
                    </button>
                  </div>

                  <a
                    href={`mailto:${msg.email}?cc=${adminEmail}&subject=${encodeURIComponent(`Re: Better City Enquiry - ${msg.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-spatial-blue hover:bg-blue-600 text-white font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Reply via Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
