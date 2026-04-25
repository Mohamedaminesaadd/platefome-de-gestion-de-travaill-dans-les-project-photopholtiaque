export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type DeadlineFilter = 'today' | 'this-week' | 'late' | null;

export interface Technician {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatarColor: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  complexity?: string;
  estimatedHours?: number;
  actualHours?: number;
  deadline: Date;
  assignedTo: Technician | null;
  phaseId?: string;
  phaseName?: string;
  projectId?: string;
}

export interface TaskFilters {
  search: string;
  technicianId: string | null;
  status: TaskStatus | null;
  projectId    : string | null;  
  priority: TaskPriority | null;
  deadline: DeadlineFilter;
}

export interface ActiveChip {
  key: keyof TaskFilters;
  label: string;
  value: any;
}