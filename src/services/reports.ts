import { ReportItem, CategoryType, UrgencyType, ReportStatusType, ContactMessage } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Seed community reports mapped around Delhi NCR & urban localities
export const initialCommunityReports: ReportItem[] = [
  {
    id: 'BC-2026-1042',
    user_id: 'user-demo-1',
    title: 'Severe road subsidence & 2ft deep pothole near Metro Pillar 142',
    description: 'A major crater has formed on the main carriageway following pipeline excavation last week. Multiple two-wheelers have skidded during dusk hours. Needs asphalt patch urgently before rain.',
    category: 'pothole',
    urgency: 'critical',
    status: 'in_progress',
    latitude: 28.6139,
    longitude: 77.2090,
    location_text: 'Barakhamba Road, Connaught Place, New Delhi',
    anonymous: false,
    author_name: 'Ananya Sharma',
    photos: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    ],
    votes_count: 42,
    has_voted: false,
    created_at: '2026-11-20T08:30:00.000Z',
    updated_at: '2026-11-21T11:15:00.000Z',
    official_response: 'MCD Zone 3 maintenance crew inspected on Nov 21. Material dispatch scheduled for tonight night-shift.',
  },
  {
    id: 'BC-2026-1055',
    user_id: 'user-demo-2',
    title: '6 consecutive streetlights dark along Outer Ring Road flyover ramp',
    description: 'Entire flyover descent has been pitch black for 4 consecutive nights. Causes intense blind spot for vehicles merging from the service road.',
    category: 'streetlight',
    urgency: 'high',
    status: 'verified',
    latitude: 28.5494,
    longitude: 77.2684,
    location_text: 'Nehru Place Flyover ramp towards Kalkaji, New Delhi',
    anonymous: false,
    author_name: 'Vikram Malhotra',
    photos: [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80'
    ],
    votes_count: 27,
    has_voted: false,
    created_at: '2026-11-19T19:40:00.000Z',
    updated_at: '2026-11-20T14:00:00.000Z',
    official_response: 'PWD Electrical Division has logged Job Order #PWD-EL-8831. Feeder line check pending.',
  },
  {
    id: 'BC-2026-1061',
    user_id: null,
    title: 'High-pressure clean water main leaking 10,000L daily onto street',
    description: 'Underground DJB pipeline ruptured near municipal park gate. Clean drinking water has flooded the street and entered adjacent residential basements.',
    category: 'water_leak',
    urgency: 'critical',
    status: 'submitted',
    latitude: 28.7041,
    longitude: 77.1025,
    location_text: 'Pocket 4, Sector 11, Rohini, Delhi',
    anonymous: true,
    photos: [
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
    ],
    votes_count: 58,
    has_voted: false,
    created_at: '2026-11-21T07:15:00.000Z',
    updated_at: '2026-11-21T07:15:00.000Z',
  },
  {
    id: 'BC-2026-1073',
    user_id: 'user-demo-3',
    title: 'Overflowing open garbage dhalao blocking pedestrian sidewalk & school path',
    description: 'Garbage compactor has not picked up refuse for 3 days. Stray dogs gathered near school gate, foul stench and plastic waste scattering into stormwater drain.',
    category: 'garbage',
    urgency: 'medium',
    status: 'under_review',
    latitude: 28.5245,
    longitude: 77.1855,
    location_text: 'Near Sarvodaya Vidyalaya, Mehrauli, New Delhi',
    anonymous: false,
    author_name: 'Pooja Chawla',
    photos: [
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80'
    ],
    votes_count: 19,
    has_voted: false,
    created_at: '2026-11-21T10:00:00.000Z',
    updated_at: '2026-11-21T12:00:00.000Z',
  },
  {
    id: 'BC-2026-1080',
    user_id: 'user-demo-4',
    title: 'Uncovered live electrical junction box near bus stop',
    description: 'Metal door of distribution panel torn off. Exposed bare wires at child height directly beside DTC bus shelter.',
    category: 'safety_hazard',
    urgency: 'critical',
    status: 'resolved',
    latitude: 28.6328,
    longitude: 77.2197,
    location_text: 'Mandi House Circle, Copernicus Marg, New Delhi',
    anonymous: false,
    author_name: 'Devendra Joshi',
    photos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
    ],
    votes_count: 64,
    has_voted: true,
    created_at: '2026-11-18T14:20:00.000Z',
    updated_at: '2026-11-20T17:45:00.000Z',
    official_response: 'BSES Quick Response Van insulated live terminals and fitted tamper-proof composite enclosure. Inspected and verified safe.',
    resolved_at: '2026-11-20T17:45:00.000Z',
  },
  {
    id: 'BC-2026-1092',
    user_id: 'user-demo-5',
    title: 'Collapsed footpath curb & missing manhole cover',
    description: 'Cement slab broke under heavy vehicle load. Deep concrete pit exposed right at zebra crossing.',
    category: 'road_damage',
    urgency: 'high',
    status: 'in_progress',
    latitude: 28.5833,
    longitude: 77.2289,
    location_text: 'Lodhi Colony Block 17, New Delhi',
    anonymous: false,
    author_name: 'Simran Walia',
    photos: [
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
    ],
    votes_count: 31,
    has_voted: false,
    created_at: '2026-11-20T16:10:00.000Z',
    updated_at: '2026-11-21T09:30:00.000Z',
    official_response: 'Temporary warning barricade placed by MCD junior engineer. Heavy duty cast-iron cover ordered for installation.',
  },
  {
    id: 'BC-2026-1104',
    user_id: null,
    title: 'Severe commercial loading bottleneck blocking emergency corridor',
    description: 'Unregulated double-parking of cargo trucks along narrow market arterial causing 45-minute ambulance delays daily.',
    category: 'traffic',
    urgency: 'high',
    status: 'submitted',
    latitude: 28.6507,
    longitude: 77.2334,
    location_text: 'Chandni Chowk Main Carriage Entry, Old Delhi',
    anonymous: true,
    photos: [],
    votes_count: 22,
    has_voted: false,
    created_at: '2026-11-22T06:00:00.000Z',
    updated_at: '2026-11-22T06:00:00.000Z',
  },
  {
    id: 'BC-2026-1115',
    user_id: 'user-demo-6',
    title: 'Community Yamuna riverbank Sunday plastic cleanup drive',
    description: 'Citizens gathering with local environmental trust for voluntary cleanup of plastic trash and dry leaves along the ghat walkway.',
    category: 'cleanup',
    urgency: 'low',
    status: 'verified',
    latitude: 28.6678,
    longitude: 77.2415,
    location_text: 'Kudshia Ghat Walkway, Kashmere Gate, Delhi',
    anonymous: false,
    author_name: 'Green Delhi Coalition',
    photos: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
    ],
    votes_count: 89,
    has_voted: false,
    created_at: '2026-11-17T11:00:00.000Z',
    updated_at: '2026-11-19T08:00:00.000Z',
  }
];

const LOCAL_STORAGE_REPORTS_KEY = 'bettercity_user_reports';
const LOCAL_STORAGE_DELETED_KEY = 'bettercity_deleted_reports';
const LOCAL_STORAGE_VOTES_KEY = 'bettercity_user_votes';
const LOCAL_STORAGE_CONTACTS_KEY = 'bettercity_contact_messages';

export class ReportService {
  // Retrieve all combined reports (excluding any deleted by admin)
  static getAllReports(): ReportItem[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      const userReports: ReportItem[] = stored ? JSON.parse(stored) : [];
      const userVotes: Record<string, boolean> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VOTES_KEY) || '{}');
      const deletedIds: string[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DELETED_KEY) || '[]');

      // Combine user reports and initial reports (with unique IDs)
      const reportMap = new Map<string, ReportItem>();
      
      // Add initial seed reports
      initialCommunityReports.forEach(r => {
        if (!deletedIds.includes(r.id)) {
          reportMap.set(r.id, { ...r });
        }
      });
      
      // Add/override user submitted reports (newest first)
      userReports.forEach(r => {
        if (!deletedIds.includes(r.id)) {
          reportMap.set(r.id, { ...r });
        }
      });

      const all = Array.from(reportMap.values());

      // Apply vote status from local storage
      return all.map(r => ({
        ...r,
        has_voted: Boolean(userVotes[r.id]),
      })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (e) {
      console.error('Error reading reports from storage:', e);
      return initialCommunityReports;
    }
  }

  // Delete / Remove a report completely (admin action)
  static deleteReport(reportId: string): boolean {
    try {
      // 1. Add to permanent deleted list
      const deletedIds: string[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DELETED_KEY) || '[]');
      if (!deletedIds.includes(reportId)) {
        deletedIds.push(reportId);
        localStorage.setItem(LOCAL_STORAGE_DELETED_KEY, JSON.stringify(deletedIds));
      }

      // 2. Remove from user reports storage if present
      const stored = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (stored) {
        const userReports: ReportItem[] = JSON.parse(stored);
        const filtered = userReports.filter(r => r.id !== reportId);
        localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(filtered));
      }

      // 3. Supabase delete if configured
      if (isSupabaseConfigured) {
        supabase.from('reports').delete().eq('id', reportId).then();
      }

      return true;
    } catch (e) {
      console.error('Failed to delete report:', e);
      return false;
    }
  }

  // Get reports submitted by a specific user
  static getUserReports(userId?: string | null, userEmail?: string | null): ReportItem[] {
    const all = this.getAllReports();
    if (!userId && !userEmail) return [];
    return all.filter(r => (userId && r.user_id === userId) || (userEmail && r.author_name === userEmail));
  }

  // Save a new report
  static async createReport(newReportData: Omit<ReportItem, 'id' | 'votes_count' | 'created_at' | 'updated_at'>): Promise<ReportItem> {
    const uniqueId = `BC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const report: ReportItem = {
      ...newReportData,
      id: uniqueId,
      votes_count: 1, // Submitter initial upvote
      has_voted: true,
      created_at: now,
      updated_at: now,
    };

    // Store in local storage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      const userReports: ReportItem[] = stored ? JSON.parse(stored) : [];
      userReports.unshift(report);
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(userReports));

      // Mark as voted by creator
      const userVotes: Record<string, boolean> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VOTES_KEY) || '{}');
      userVotes[report.id] = true;
      localStorage.setItem(LOCAL_STORAGE_VOTES_KEY, JSON.stringify(userVotes));
    } catch (e) {
      console.error('Failed to write report to localStorage:', e);
    }

    // Attempt Supabase insert if configured
    if (isSupabaseConfigured) {
      try {
        await supabase.from('reports').insert([{
          id: report.id,
          user_id: report.user_id,
          title: report.title,
          description: report.description,
          category: report.category,
          urgency: report.urgency,
          status: report.status,
          latitude: report.latitude,
          longitude: report.longitude,
          location_text: report.location_text,
          anonymous: report.anonymous,
          created_at: report.created_at,
          updated_at: report.updated_at,
        }]);

        if (report.photos && report.photos.length > 0) {
          const photoRows = report.photos.map(p => ({
            report_id: report.id,
            image_url: p,
          }));
          await supabase.from('report_photos').insert(photoRows);
        }
      } catch (err) {
        console.warn('Supabase sync skipped/deferred:', err);
      }
    }

    return report;
  }

  // Upvote / Toggle vote on a report
  static toggleVote(reportId: string): { voted: boolean; newCount: number } {
    try {
      const userVotes: Record<string, boolean> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VOTES_KEY) || '{}');
      const hasVoted = Boolean(userVotes[reportId]);

      const stored = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      const userReports: ReportItem[] = stored ? JSON.parse(stored) : [];

      let newCount = 0;
      let found = false;

      // Update in user reports if present
      const updatedUserReports = userReports.map(r => {
        if (r.id === reportId) {
          found = true;
          const delta = hasVoted ? -1 : 1;
          r.votes_count = Math.max(0, (r.votes_count || 0) + delta);
          newCount = r.votes_count;
        }
        return r;
      });

      if (found) {
        localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(updatedUserReports));
      } else {
        // Find in initial community reports
        const initial = initialCommunityReports.find(r => r.id === reportId);
        if (initial) {
          const delta = hasVoted ? -1 : 1;
          initial.votes_count = Math.max(0, (initial.votes_count || 0) + delta);
          newCount = initial.votes_count;
        }
      }

      // Update vote state
      if (hasVoted) {
        delete userVotes[reportId];
      } else {
        userVotes[reportId] = true;
      }
      localStorage.setItem(LOCAL_STORAGE_VOTES_KEY, JSON.stringify(userVotes));

      return { voted: !hasVoted, newCount };
    } catch (e) {
      console.error('Error toggling vote:', e);
      return { voted: false, newCount: 0 };
    }
  }

  // Compress image client-side before upload
  static compressImage(file: File, maxWidth = 1400, quality = 0.82): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const elem = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          if (!ctx) {
            resolve(img.src);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = elem.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  // Save Contact Form message
  static async submitContactMessage(name: string, email: string, message: string): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: `MSG-${Date.now()}`,
      name,
      email,
      message,
      created_at: new Date().toISOString(),
      status: 'new',
    };

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CONTACTS_KEY);
      const messages: ContactMessage[] = stored ? JSON.parse(stored) : [];
      messages.unshift(newMessage);
      localStorage.setItem(LOCAL_STORAGE_CONTACTS_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to store contact message locally:', e);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('contact_messages').insert([newMessage]);
      } catch (err) {
        console.warn('Supabase contact message sync skipped:', err);
      }
    }

    return newMessage;
  }
}
