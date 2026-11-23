import { ContactMessage, ReportItem, ReportStatusType } from '../types';
import { ReportService } from './reports';
import { DiscordService } from './discord';

export interface TokenDispatchRecord {
  timestamp: string;
  recipient: string;
  expiresAt: string;
}

export class AdminService {
  private static SALT = 'BETTER_CITY_SECURE_ADMIN_SALT_2026';
  public static ADMIN_EMAIL = 'hr01829019@gmail.com';

  /**
   * Generates a 24-digit token that changes automatically every 24 hours (UTC/Local day).
   * Format: 24 numeric digits, grouped in 4-digit blocks for readability:
   * e.g. "8492-3105-7281-9402-1834-5920"
   */
  static getDailyAdminToken(date: Date = new Date()): { raw: string; formatted: string; expiresAt: Date } {
    // Current calendar date string YYYY-MM-DD
    const dateStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    
    // Simple deterministic hash to 24 digits
    let hash1 = 0;
    let hash2 = 0;
    let hash3 = 0;
    const combined = `${this.SALT}_${dateStr}`;
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash1 = ((hash1 << 5) - hash1) + char;
      hash1 = hash1 & hash1;
      hash2 = ((hash2 << 7) + hash2) ^ (char * 31);
      hash2 = hash2 & hash2;
      hash3 = ((hash3 << 3) - hash3) + (char * 17);
      hash3 = hash3 & hash3;
    }

    const part1 = Math.abs(hash1).toString().padStart(8, '4').slice(0, 8);
    const part2 = Math.abs(hash2).toString().padStart(8, '8').slice(0, 8);
    const part3 = Math.abs(hash3).toString().padStart(8, '2').slice(0, 8);
    const raw = `${part1}${part2}${part3}`.slice(0, 24);

    // Format into 4-digit groups: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX
    const formatted = raw.match(/.{1,4}/g)?.join('-') || raw;

    // Calculate expiry (end of current UTC day)
    const expiresAt = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0));

    return { raw, formatted, expiresAt };
  }

  /**
   * Send the 24-digit token code silently to Discord server & store dispatch record.
   */
  static async sendAdminTokenEmail(recipientEmail: string = this.ADMIN_EMAIL): Promise<{ success: boolean; token: string }> {
    const { formatted, expiresAt } = this.getDailyAdminToken();
    const now = new Date().toISOString();

    const record: TokenDispatchRecord = {
      timestamp: now,
      recipient: recipientEmail,
      expiresAt: expiresAt.toISOString(),
    };

    // Store dispatch log in localStorage
    try {
      const stored = localStorage.getItem('bettercity_admin_token_dispatches');
      const dispatches: TokenDispatchRecord[] = stored ? JSON.parse(stored) : [];
      dispatches.unshift(record);
      localStorage.setItem('bettercity_admin_token_dispatches', JSON.stringify(dispatches));
    } catch (e) {
      console.error('Failed to store dispatch record:', e);
    }

    // Post to Discord Webhook silently
    await DiscordService.sendTokenToDiscord(formatted, expiresAt);

    return {
      success: true,
      token: formatted,
    };
  }

  /**
   * Verify if entered token matches today's 24-digit token.
   * Strips dashes and whitespace.
   */
  static verifyAdminToken(inputToken: string): boolean {
    const cleanInput = inputToken.replace(/[\s-]/g, '').trim();
    const { raw } = this.getDailyAdminToken();
    return cleanInput === raw;
  }

  /**
   * Check if admin is currently authenticated in session storage
   */
  static isAdminAuthenticated(): boolean {
    const session = sessionStorage.getItem('bettercity_admin_auth');
    if (!session) return false;
    try {
      const parsed = JSON.parse(session);
      const today = new Date().toISOString().slice(0, 10);
      return parsed.date === today && parsed.valid === true;
    } catch {
      return false;
    }
  }

  static setAdminAuthenticated(status: boolean): void {
    if (status) {
      const today = new Date().toISOString().slice(0, 10);
      sessionStorage.setItem('bettercity_admin_auth', JSON.stringify({ valid: true, date: today }));
    } else {
      sessionStorage.removeItem('bettercity_admin_auth');
    }
  }

  /**
   * Retrieve all contact messages submitted to admin (hr01829019@gmail.com)
   */
  static getContactMessages(): ContactMessage[] {
    try {
      const stored = localStorage.getItem('bettercity_contact_messages');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to read contact messages:', e);
    }

    // Default sample messages if empty
    return [
      {
        id: 'MSG-2026-901',
        name: 'Sunil Rao (RWA Secretary)',
        email: 'sunil.rao@dwarka-rwa.org',
        message: 'Requesting society integration for Sector 6 Dwarka. We have 450 apartments and want our security team to coordinate directly with MCD via Better City.',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'new',
      },
      {
        id: 'MSG-2026-894',
        name: 'Dr. Meenakshi Sundaram',
        email: 'dr.meenakshi@gmail.com',
        message: 'Correction to Delhi Jal Board helpline: The emergency junior engineer number for South Extension Part 2 was recently updated to 011-26248900.',
        created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
        status: 'reviewed',
      }
    ];
  }

  /**
   * Mark a contact message as reviewed / responded
   */
  static markMessageStatus(id: string, status: 'new' | 'reviewed'): void {
    try {
      const messages = this.getContactMessages();
      const updated = messages.map(m => m.id === id ? { ...m, status } : m);
      localStorage.setItem('bettercity_contact_messages', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update message status:', e);
    }
  }

  /**
   * Update report status and official department note
   */
  static updateReportStatus(reportId: string, status: ReportStatusType, officialResponse?: string): boolean {
    try {
      const all = ReportService.getAllReports();
      const userReportsRaw = localStorage.getItem('bettercity_user_reports');
      const userReports: ReportItem[] = userReportsRaw ? JSON.parse(userReportsRaw) : [];

      let found = false;
      const updatedUserReports = userReports.map(r => {
        if (r.id === reportId) {
          found = true;
          return {
            ...r,
            status,
            official_response: officialResponse || r.official_response,
            updated_at: new Date().toISOString(),
          };
        }
        return r;
      });

      if (found) {
        localStorage.setItem('bettercity_user_reports', JSON.stringify(updatedUserReports));
      } else {
        // If it was in initial reports, add an overridden copy to user reports
        const initial = all.find(r => r.id === reportId);
        if (initial) {
          const modified: ReportItem = {
            ...initial,
            status,
            official_response: officialResponse || initial.official_response,
            updated_at: new Date().toISOString(),
          };
          userReports.unshift(modified);
          localStorage.setItem('bettercity_user_reports', JSON.stringify(userReports));
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to update report status:', e);
      return false;
    }
  }
}
