import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule }    from '@angular/material/icon';
import { MatRippleModule }  from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Sidebar } from "../../layout/sidbar/sidbar";
import { Topbar } from "../../layout/topbar/topbar";

/* ── MODELS ─────────────────────────────────────────────── */
export type TaskStatus = 'completed' | 'in-progress' | 'delayed' | 'pending';
export type ViewMode   = 'week' | 'month' | 'quarter';

export interface GanttTask {
  id: string;
  name: string;
  project: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  status: TaskStatus;
  startDay: number;   // jour depuis début de la période (0-based)
  duration: number;   // durée en jours
  progress: number;   // 0-100
  dependencies?: string[];
}

export interface GanttProject {
  id: string;
  name: string;
  color: string;
  collapsed: boolean;
  tasks: GanttTask[];
}

/* ── COMPONENT ──────────────────────────────────────────── */
@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, MatRippleModule, MatTooltipModule, Sidebar, Topbar],
  templateUrl: './diagramme-grantt.html',
  styleUrls: ['./diagramme-grantt.css'],
})
export class GanttChart implements OnInit {

  /* ── VIEW MODE ────────────────────────────── */
  viewMode = signal<ViewMode>('month');

  totalDays = computed(() => {
    switch (this.viewMode()) {
      case 'week':    return 7;
      case 'month':   return 30;
      case 'quarter': return 90;
    }
  });

  columnHeaders = computed(() => {
    const mode = this.viewMode();
    const days = this.totalDays();
    if (mode === 'week') {
      return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    }
    if (mode === 'month') {
      const headers: string[] = [];
      for (let i = 1; i <= days; i++) headers.push(String(i));
      return headers;
    }
    // quarter → semaines
    const headers: string[] = [];
    for (let i = 1; i <= days / 7; i++) headers.push(`S${i}`);
    return headers;
  });

  /* ── TODAY MARKER ────────────────────────── */
  todayOffset = computed(() => {
    // Simule que "aujourd'hui" = jour 12 dans la période
    return (12 / this.totalDays()) * 50;
  });

  /* ── DATA ────────────────────────────────── */
  projects: GanttProject[] = [
    {
      id: 'p1',
      name: 'West Side Solar Farm',
      color: '#2563EB',
      collapsed: false,
      tasks: [
        {
          id: 't1', name: 'Site Assessment', project: 'p1',
          assignee: 'J. Martin', assigneeInitials: 'JM', assigneeColor: '#DBEAFE',
          status: 'completed', startDay: 0, duration: 5, progress: 100,
        },
        {
          id: 't2', name: 'Engineering Design', project: 'p1',
          assignee: 'S. Chen', assigneeInitials: 'SC', assigneeColor: '#D1FAE5',
          status: 'completed', startDay: 4, duration: 7, progress: 100,
          dependencies: ['t1'],
        },
        {
          id: 't3', name: 'Permit Submission', project: 'p1',
          assignee: 'R. Kumar', assigneeInitials: 'RK', assigneeColor: '#FEE2E2',
          status: 'in-progress', startDay: 10, duration: 8, progress: 60,
          dependencies: ['t2'],
        },
        {
          id: 't4', name: 'Equipment Procurement', project: 'p1',
          assignee: 'L. Park', assigneeInitials: 'LP', assigneeColor: '#EDE9FE',
          status: 'in-progress', startDay: 12, duration: 6, progress: 35,
        },
        {
          id: 't5', name: 'Panel Installation', project: 'p1',
          assignee: 'J. Martin', assigneeInitials: 'JM', assigneeColor: '#DBEAFE',
          status: 'pending', startDay: 18, duration: 9, progress: 0,
          dependencies: ['t3', 't4'],
        },
        {
          id: 't6', name: 'Final Inspection', project: 'p1',
          assignee: 'S. Chen', assigneeInitials: 'SC', assigneeColor: '#D1FAE5',
          status: 'pending', startDay: 26, duration: 4, progress: 0,
          dependencies: ['t5'],
        },
      ],
    },
    {
      id: 'p2',
      name: 'Residential Cluster A',
      color: '#F59E0B',
      collapsed: false,
      tasks: [
        {
          id: 't7', name: 'HOA Approval', project: 'p2',
          assignee: 'R. Kumar', assigneeInitials: 'RK', assigneeColor: '#FEE2E2',
          status: 'delayed', startDay: 0, duration: 10, progress: 45,
        },
        {
          id: 't8', name: 'Roof Structural Review', project: 'p2',
          assignee: 'L. Park', assigneeInitials: 'LP', assigneeColor: '#EDE9FE',
          status: 'in-progress', startDay: 5, duration: 6, progress: 70,
        },
        {
          id: 't9', name: 'Grid Connection Request', project: 'p2',
          assignee: 'J. Martin', assigneeInitials: 'JM', assigneeColor: '#DBEAFE',
          status: 'pending', startDay: 14, duration: 8, progress: 0,
          dependencies: ['t7'],
        },
        {
          id: 't10', name: 'Installation Phase 1', project: 'p2',
          assignee: 'S. Chen', assigneeInitials: 'SC', assigneeColor: '#D1FAE5',
          status: 'pending', startDay: 20, duration: 7, progress: 0,
          dependencies: ['t8', 't9'],
        },
      ],
    },
    {
      id: 'p3',
      name: 'Mountain Ridge Array',
      color: '#10B981',
      collapsed: false,
      tasks: [
        {
          id: 't11', name: 'Environmental Study', project: 'p3',
          assignee: 'R. Kumar', assigneeInitials: 'RK', assigneeColor: '#FEE2E2',
          status: 'completed', startDay: 2, duration: 4, progress: 100,
        },
        {
          id: 't12', name: 'Land Survey', project: 'p3',
          assignee: 'L. Park', assigneeInitials: 'LP', assigneeColor: '#EDE9FE',
          status: 'in-progress', startDay: 5, duration: 5, progress: 80,
        },
        {
          id: 't13', name: 'Foundation Work', project: 'p3',
          assignee: 'J. Martin', assigneeInitials: 'JM', assigneeColor: '#DBEAFE',
          status: 'pending', startDay: 15, duration: 12, progress: 0,
          dependencies: ['t11', 't12'],
        },
      ],
    },
  ];

  /* ── SELECTED TASK ───────────────────────── */
  selectedTask: GanttTask | null = null;

  /* ── LIFECYCLE ───────────────────────────── */
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  /* ── COMPUTED HELPERS ────────────────────── */
  getBarLeft(task: GanttTask): number {
    return (task.startDay / this.totalDays()) * 100;
  }

  getBarWidth(task: GanttTask): number {
    return Math.min((task.duration / this.totalDays()) * 100, 100 - this.getBarLeft(task));
  }

  getProgressWidth(task: GanttTask): number {
    return task.progress;
  }

  allTasks = computed((): GanttTask[] =>
    this.projects.flatMap(p => p.collapsed ? [] : p.tasks)
  );

  totalTaskCount(): number {
    return this.projects.reduce((acc, p) => acc + p.tasks.length, 0);
  }

  completedCount(): number {
    return this.projects
      .flatMap(p => p.tasks)
      .filter(t => t.status === 'completed').length;
  }

  delayedCount(): number {
    return this.projects
      .flatMap(p => p.tasks)
      .filter(t => t.status === 'delayed').length;
  }

  /* ── ACTIONS ─────────────────────────────── */
  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
    this.cdr.markForCheck();
    console.log(`View mode changed to ${mode}. Total days: ${this.totalDays()}.`);
  }

  toggleProject(project: GanttProject): void {
    project.collapsed = !project.collapsed;
    this.cdr.markForCheck();
    console.log(`Project ${project.name} is now ${project.collapsed ? 'collapsed' : 'expanded'}.`);
  }

  selectTask(task: GanttTask): void {
    this.selectedTask = this.selectedTask?.id === task.id ? null : task;
    this.cdr.markForCheck();
    console.log(`Task ${task.name} selected:`, this.selectedTask);
  }

  closeDetail(): void {
    this.selectedTask = null;
    this.cdr.markForCheck();
  }

  /* ── STYLE HELPERS ───────────────────────── */
  statusColor(status: TaskStatus): string {
    const map: Record<TaskStatus, string> = {
      'completed':   '#10B981',
      'in-progress': '#2563EB',
      'delayed':     '#EF4444',
      'pending':     '#94A3B8',
    };
    return map[status];
  }

  statusLabel(status: TaskStatus): string {
    const map: Record<TaskStatus, string> = {
      'completed':   'Terminé',
      'in-progress': 'En cours',
      'delayed':     'En retard',
      'pending':     'En attente',
    };
    return map[status];
  }

  projectOf(task: GanttTask): GanttProject {
    return this.projects.find(p => p.id === task.project)!;
  }

  trackById(index: number, item: any): any {
  return item.id; // ou item si pas de id
}

  colRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}