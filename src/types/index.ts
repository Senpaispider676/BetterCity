export type CategoryType =
  | 'pothole'
  | 'streetlight'
  | 'water_leak'
  | 'garbage'
  | 'road_damage'
  | 'noise'
  | 'safety_hazard'
  | 'traffic'
  | 'accident'
  | 'cleanup'
  | 'other';

export type UrgencyType = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatusType =
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export interface ReportPhoto {
  id: string;
  report_id: string;
  image_url: string;
  created_at: string;
}

export interface ReportItem {
  id: string;
  user_id?: string | null;
  title: string;
  description: string;
  category: CategoryType;
  urgency: UrgencyType;
  status: ReportStatusType;
  latitude: number;
  longitude: number;
  location_text: string;
  anonymous: boolean;
  photos: string[];
  votes_count: number;
  has_voted?: boolean;
  created_at: string;
  updated_at: string;
  author_name?: string;
  official_response?: string;
  resolved_at?: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  role?: 'citizen' | 'official' | 'admin';
}

export interface AuthorityItem {
  id: string;
  department: string;
  name: string;
  jurisdiction: string;
  city: string;
  district: string;
  email: string;
  phone: string;
  website: string;
  complaint_portal?: string;
  complaintPortal?: string;
  services: string[];
  emergency?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: 'new' | 'reviewed';
}

export type Language = 'en' | 'hi';
export type Theme = 'dark' | 'light';
export type ActiveTab = 'home' | 'map' | 'representatives' | 'about' | 'explanation' | 'contact' | 'dashboard' | 'admin' | 'report';
