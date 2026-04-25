import { Project } from './project.model';
import { User } from './user.model';

export type TechnicianTaskStatus = 'todo' | 'in_progress' | 'done';
export type TechnicianTaskPriority = 'low' | 'medium' | 'high';
export type TechnicianTaskFilter = 'today' | 'week' | 'late' | 'done';

export interface TechnicianChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface TechnicianPhoto {
  id: string;
  name: string;
  previewUrl?: string;
  uploadedAt: string;
}

export interface TechnicianTaskEnhancement {
  checklist?: TechnicianChecklistItem[];
  notes?: string;
  photos?: TechnicianPhoto[];
  issueReported?: boolean;
  issueMessage?: string;
}

export interface TechnicianTask {
  id: string;
  title: string;
  description: string;
  deadline: string;
  estimatedHours: number;
  actualHours: number;
  progressPercent: number;
  status: TechnicianTaskStatus;
  priority: TechnicianTaskPriority;
  complexity?: string;
  cost?: number;
  createdAt?: string;
  updatedAt?: string;
  phaseId?: string;
  phaseName?: string;
  projectId?: string;
  projectName?: string;
  projectCode?: string;
  projectAddress?: string;
  assignedToId?: string;
  assignedTechnicianName?: string;
  checklist: TechnicianChecklistItem[];
  notes: string;
  photos: TechnicianPhoto[];
  issueReported: boolean;
  issueMessage?: string;
}

export interface ScheduleSlot {
  id: string;
  taskId: string;
  title: string;
  dayKey: string;
  dayLabel: string;
  startMinute: number;
  endMinute: number;
  status: TechnicianTaskStatus;
  priority: TechnicianTaskPriority;
  projectName?: string;
}

export interface WeeklyPerformancePoint {
  label: string;
  value: number;
}

export interface TechnicianProfile extends Pick<User, '_id' | 'username' | 'email' | 'role' | 'status'> {
  specialite?: string;
  disponible: boolean;
  tachesEnCours: number;
  avatarInitials: string;
  phone?: string;
  location?: string;
  skills: string[];
}

export interface Stats {
  assigned: number;
  inProgress: number;
  completed: number;
  overdue: number;
  focusHours: number;
  completionRate: number;
  weeklyPerformance: WeeklyPerformancePoint[];
}

export interface TechnicianProjectSummary
  extends Pick<Project, '_id' | 'nom' | 'codeProject' | 'adresse' | 'statut'> {
  taskCount: number;
  completedTaskCount: number;
  activeTaskCount: number;
  overdueTaskCount: number;
  nextDeadline?: string;
}
