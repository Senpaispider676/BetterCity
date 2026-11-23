export class DiscordService {
  private static STORAGE_KEY = 'bettercity_discord_webhook';
  public static DEFAULT_WEBHOOK = 'https://discord.com/api/webhooks/1574093983695769601/xtzEN61fXr2Td9CWKdsU3kiFrLfoGk4aWyVv-7AvtxFA2clbD8fLHiumjMMVF6x1al3e';

  static getWebhookUrl(): string {
    return (
      import.meta.env.VITE_DISCORD_WEBHOOK_URL ||
      localStorage.getItem(this.STORAGE_KEY) ||
      this.DEFAULT_WEBHOOK
    );
  }

  static setWebhookUrl(url: string): void {
    if (url.trim()) {
      localStorage.setItem(this.STORAGE_KEY, url.trim());
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Post the 24-digit token to Discord via Webhook silently.
   */
  static async sendTokenToDiscord(token: string, expiresAt: Date): Promise<boolean> {
    const webhookUrl = this.getWebhookUrl();
    
    // Save to local dispatch history as well
    try {
      const stored = localStorage.getItem('bettercity_token_dispatches_history') || '[]';
      const history = JSON.parse(stored);
      history.unshift({
        token,
        timestamp: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      });
      localStorage.setItem('bettercity_token_dispatches_history', JSON.stringify(history));
    } catch {
      // fallback
    }

    if (!webhookUrl) {
      return true;
    }

    try {
      const payload = {
        username: 'Better City Security Operations',
        avatar_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=150&q=80',
        content: '🔐 **Administrative Access Token Requested**',
        embeds: [
          {
            title: '🛡️ Better City — 24-Digit Daily Officer Security Token',
            description: 'An officer requested the active security token on the Administrative Command Portal.',
            color: 3901686, // Spatial Blue
            fields: [
              {
                name: '🔑 24-Digit Security Key',
                value: `\`\`\`${token}\`\`\``,
                inline: false,
              },
              {
                name: '⏱️ Validity',
                value: `Expires at: ${expiresAt.toUTCString()}`,
                inline: true,
              },
              {
                name: '🕒 Timestamp',
                value: new Date().toLocaleTimeString(),
                inline: true,
              },
            ],
            footer: {
              text: 'Better City Civic Security Operations • Automated Dispatch',
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return true;
    } catch (e) {
      console.warn('Discord webhook transmission error:', e);
      return true;
    }
  }

  /**
   * Post Contact Inquiries to Discord as well
   */
  static async sendContactMessageToDiscord(name: string, email: string, message: string): Promise<boolean> {
    const webhookUrl = this.getWebhookUrl();
    if (!webhookUrl) return false;

    try {
      const payload = {
        username: 'Better City Civic Inquiries',
        content: `📬 **New Contact Message from ${name}**`,
        embeds: [
          {
            title: 'Citizen Contact Inquiry',
            color: 3054952, // Spatial Green
            fields: [
              { name: 'Name', value: name, inline: true },
              { name: 'Email', value: email, inline: true },
              { name: 'Message', value: message, inline: false },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return true;
    } catch {
      return false;
    }
  }
}
