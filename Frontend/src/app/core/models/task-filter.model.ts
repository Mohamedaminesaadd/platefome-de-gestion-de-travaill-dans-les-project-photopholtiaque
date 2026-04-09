// ============================================================
// task-filter.model.ts — Interfaces métier
// ============================================================
export type TaskStatus   = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type DeadlineFilter = 'today' | 'this-week' | 'late' | null;

export interface Technician {
  id: string;
  name: string;
  avatar: string;       // initiales
  avatarColor: string;  // couleur de fond
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: Date;
  assignedTo: Technician | null;
  phaseId: string;
  phaseName: string;
  projectId: string;
}

export interface TaskFilters {
  search: string;
  technicianId: string | null;
  status: TaskStatus | null;
  priority: TaskPriority | null;
  deadline: DeadlineFilter;
}

export interface ActiveChip {
  key: keyof TaskFilters;
  label: string;
  value: string;
}