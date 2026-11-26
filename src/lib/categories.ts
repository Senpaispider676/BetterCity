import React from 'react';
import {
  AlertCircle,
  Lightbulb,
  Droplets,
  Trash2,
  Construction,
  Volume2,
  ShieldAlert,
  Car,
  Siren,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  XCircle,
  FileCheck,
  Wrench
} from 'lucide-react';
import { CategoryType, UrgencyType, ReportStatusType } from '../types';

export interface CategoryMeta {
  type: CategoryType;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgLight: string;
  borderColor: string;
}

export const CATEGORY_CONFIG: Record<CategoryType, CategoryMeta> = {
  pothole: {
    type: 'pothole',
    icon: Construction,
    color: 'text-amber-500',
    bgLight: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  streetlight: {
    type: 'streetlight',
    icon: Lightbulb,
    color: 'text-yellow-400',
    bgLight: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/30',
  },
  water_leak: {
    type: 'water_leak',
    icon: Droplets,
    color: 'text-sky-400',
    bgLight: 'bg-sky-400/10',
    borderColor: 'border-sky-400/30',
  },
  garbage: {
    type: 'garbage',
    icon: Trash2,
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  road_damage: {
    type: 'road_damage',
    icon: AlertCircle,
    color: 'text-orange-500',
    bgLight: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  noise: {
    type: 'noise',
    icon: Volume2,
    color: 'text-purple-400',
    bgLight: 'bg-purple-400/10',
    borderColor: 'border-purple-400/30',
  },
  safety_hazard: {
    type: 'safety_hazard',
    icon: ShieldAlert,
    color: 'text-rose-500',
    bgLight: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
  },
  traffic: {
    type: 'traffic',
    icon: Car,
    color: 'text-blue-400',
    bgLight: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
  },
  accident: {
    type: 'accident',
    icon: Siren,
    color: 'text-red-500',
    bgLight: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  cleanup: {
    type: 'cleanup',
    icon: Sparkles,
    color: 'text-teal-400',
    bgLight: 'bg-teal-400/10',
    borderColor: 'border-teal-400/30',
  },
  vehicle_breakdown: {
    type: 'vehicle_breakdown',
    icon: Wrench,
    color: 'text-amber-500',
    bgLight: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  other: {
    type: 'other',
    icon: MapPin,
    color: 'text-slate-400',
    bgLight: 'bg-slate-400/10',
    borderColor: 'border-slate-400/30',
  },
};

export const URGENCY_CONFIG: Record<UrgencyType, { label: string; color: string; badge: string; dot: string }> = {
  low: {
    label: 'Low',
    color: 'text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  medium: {
    label: 'Medium',
    color: 'text-spatial-orange',
    badge: 'bg-spatial-orange/15 text-spatial-orange border border-spatial-orange/30',
    dot: 'bg-spatial-orange',
  },
  high: {
    label: 'High',
    color: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
    dot: 'bg-orange-500',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-400',
    badge: 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse',
    dot: 'bg-red-500',
  },
};

export const STATUS_CONFIG: Record<
  ReportStatusType,
  { label: string; icon: React.ComponentType<{ className?: string }>; badge: string; color: string }
> = {
  submitted: {
    label: 'Submitted',
    icon: Clock,
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    color: 'text-blue-400',
  },
  under_review: {
    label: 'Under Review',
    icon: AlertTriangle,
    badge: 'bg-spatial-orange/15 text-spatial-orange border-spatial-orange/30',
    color: 'text-spatial-orange',
  },
  verified: {
    label: 'Verified',
    icon: FileCheck,
    badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    color: 'text-indigo-400',
  },
  in_progress: {
    label: 'In Progress',
    icon: RotateCcw,
    badge: 'bg-spatial-blue/20 text-spatial-blue border-spatial-blue/40',
    color: 'text-spatial-blue',
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle2,
    badge: 'bg-spatial-green/20 text-spatial-green border-spatial-green/40',
    color: 'text-spatial-green',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    color: 'text-slate-400',
  },
};
