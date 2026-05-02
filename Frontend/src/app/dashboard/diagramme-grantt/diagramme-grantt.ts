import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Sidebar } from '../../layout/sidbar/sidbar';
import { Topbar } from '../../layout/topbar/topbar';
import { Project } from '../../core/models/project.model';
import { Phase } from '../../core/models/phase.model';
import { ProjectService } from '../../services/service-project';
import { PhaseService } from '../../services/phase-service';
import { TacheService } from '../../services/tache-service';

export type TaskStatus = 'completed' | 'in-progress' | 'delayed' | 'pending';
export type ViewMode   = 'week' | 'month' | 'quarter';

interface ApiTask {
  _id: string;
  title?: string;
  titre?: string;
  description?: string;
  deadline?: string;
  dateEcheance?: string;
  dateDebut?: string;
  dateFin?: string;
  estimatedHours?: number;
  heureEstimees?: number;
  actualHours?: number;
  heureRelles?: number;
  status?: string;
  statut?: string;
  phase?: string | { _id?: string; nom?: string; idProject?: string };
  idPhase?: string;
  idProject?: string;
  assignedTo?: string | { _id?: string; username?: string; email?: string };
  assigneNom?: string;
  assigneEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GanttTask {
  id: string;
  name: string;
  project: string;
  projectName: string;
  phaseName: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  duration: number;
  progress: number;
  estimatedHours: number;
  actualHours: number;
  description?: string;
  dependencies?: string[];
}

export interface GanttProject {
  id: string;
  name: string;
  code: string;
  color: string;
  collapsed: boolean;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: string;
  tasks: GanttTask[];
}

interface GanttDataset {
  projects: GanttProject[];
  tasks: GanttTask[];
}

// ✅ FIX SKELETON : valeur sentinelle null = "pas encore chargé"
type RawData = GanttDataset | null;

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, MatRippleModule, MatTooltipModule, Sidebar, Topbar],
  templateUrl: './diagramme-grantt.html',
  styleUrls: ['./diagramme-grantt.css'],
})
export class GanttChart {

  private readonly projectService = inject(ProjectService);
  private readonly phaseService   = inject(PhaseService);
  private readonly tacheService   = inject(TacheService);
  private readonly cdr            = inject(ChangeDetectorRef);

  // ── LOADING ───────────────────────────────────────────────────────────────
  // ✅ FIX : démarre à true, passe à false seulement quand les données arrivent
  readonly isLoading = signal(true);

  // ── SKELETON DATA ─────────────────────────────────────────────────────────
  readonly skeletonProjects = [
    { barLeft: '5%',  barWidth: '60%' },
    { barLeft: '10%', barWidth: '50%' },
    { barLeft: '2%',  barWidth: '70%' },
  ];

  readonly skeletonTasks = [
    { nameW: '75%', metaW: '55%', barLeft: '5%',  barWidth: '28%' },
    { nameW: '60%', metaW: '45%', barLeft: '20%', barWidth: '22%' },
    { nameW: '85%', metaW: '60%', barLeft: '35%', barWidth: '30%' },
  ];

  readonly skeletonHeaders = Array(8);

  // ── STATE ─────────────────────────────────────────────────────────────────
  private readonly collapsedProjects = signal<Record<string, boolean>>({});
  readonly viewMode     = signal<ViewMode>('month');
  readonly selectedTask = signal<GanttTask | null>(null);

  // ✅ FIX SKELETON : initialValue = null → skeleton visible jusqu'aux vraies données
  private readonly rawData = toSignal<RawData>(
    combineLatest([
      this.projectService.getAll(),
      this.phaseService.getAll(),
      this.tacheService.getAll(),
    ] as const).pipe(
      map((result) => {
        const [projects, phases, tasks] = result as [Project[], Phase[], ApiTask[]];
        return this.buildDataset(projects, phases, tasks ?? []);
      }),
    ),
    { initialValue: null },  // ✅ null = "en cours de chargement"
  );

  constructor() {
    // ✅ FIX : effect détecte quand rawData passe de null à une valeur réelle
    effect(() => {
      const data = this.rawData();
      if (data !== null) {
        // Données reçues (même tableau vide) → fin du skeleton
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  // ── COMPUTED ──────────────────────────────────────────────────────────────
  readonly projects = computed(() =>
    (this.rawData()?.projects ?? []).map((project) => ({
      ...project,
      collapsed: this.collapsedProjects()[project.id] ?? false,
    })),
  );

  readonly allTasks = computed(() => this.rawData()?.tasks ?? []);

  readonly timelineStart = computed(() => {
    const dates = [
      ...this.projects().map((p) => p.startDate),
      ...this.allTasks().map((t) => t.startDate),
    ];
    if (dates.length === 0) {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), 1);
    }
    return this.startOfDay(new Date(Math.min(...dates.map((d) => d.getTime()))));
  });

  readonly timelineEnd = computed(() => {
    const dates = [
      ...this.projects().map((p) => p.endDate),
      ...this.allTasks().map((t) => t.endDate),
    ];
    if (dates.length === 0) {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }
    return this.startOfDay(new Date(Math.max(...dates.map((d) => d.getTime()))));
  });

  readonly totalDays = computed(() =>
    this.diffInDays(this.timelineStart(), this.timelineEnd()) + 1,
  );

  readonly headerStepDays = computed(() => {
    switch (this.viewMode()) {
      case 'week':    return 1;
      case 'month':   return 7;
      case 'quarter': return 30;
    }
  });

  readonly columnHeaders = computed(() => {
    const labels: string[] = [];
    const start     = this.timelineStart();
    const totalDays = this.totalDays();
    const step      = this.headerStepDays();
    for (let offset = 0; offset < totalDays; offset += step) {
      labels.push(this.formatHeader(this.addDays(start, offset), this.viewMode()));
    }
    return labels;
  });

  readonly todayOffset = computed(() => {
    const today = this.startOfDay(new Date());
    if (today.getTime() <= this.timelineStart().getTime()) return 0;
    if (today.getTime() >= this.timelineEnd().getTime())   return 100;
    return (this.diffInDays(this.timelineStart(), today) / this.totalDays()) * 100;
  });

  readonly isTodayVisible = computed(() => {
    const today = this.startOfDay(new Date()).getTime();
    return today >= this.timelineStart().getTime() && today <= this.timelineEnd().getTime();
  });

  // ── STATS ─────────────────────────────────────────────────────────────────
  totalTaskCount(): number { return this.allTasks().length; }
  completedCount(): number { return this.allTasks().filter((t) => t.status === 'completed').length; }
  delayedCount()  : number { return this.allTasks().filter((t) => t.status === 'delayed').length; }

  // ── ACTIONS ───────────────────────────────────────────────────────────────
  setViewMode(mode: ViewMode): void { this.viewMode.set(mode); }

  toggleProject(project: GanttProject): void {
    this.collapsedProjects.update((current) => ({
      ...current,
      [project.id]: !project.collapsed,
    }));
  }

  selectTask(task: GanttTask): void {
    this.selectedTask.update((current) => (current?.id === task.id ? null : task));
  }

  closeDetail(): void { this.selectedTask.set(null); }

  // ── BAR GEOMETRY ──────────────────────────────────────────────────────────
  getBarLeft(task: GanttTask): number {
    return (this.diffInDays(this.timelineStart(), task.startDate) / this.totalDays()) * 100;
  }

  getBarWidth(task: GanttTask): number {
    return Math.max((task.duration / this.totalDays()) * 100, 1.5);
  }

  getProjectBarLeft(project: GanttProject): number {
    return (this.diffInDays(this.timelineStart(), project.startDate) / this.totalDays()) * 100;
  }

  getProjectBarWidth(project: GanttProject): number {
    return Math.max(
      ((this.diffInDays(project.startDate, project.endDate) + 1) / this.totalDays()) * 100,
      2,
    );
  }

  // ── STATUS HELPERS ────────────────────────────────────────────────────────
  statusColor(status: TaskStatus): string {
    const map: Record<TaskStatus, string> = {
      completed:    '#10B981',
      'in-progress':'#2563EB',
      delayed:      '#EF4444',
      pending:      '#94A3B8',
    };
    return map[status];
  }

  statusLabel(status: TaskStatus): string {
    const map: Record<TaskStatus, string> = {
      completed:    'Terminé',
      'in-progress':'En cours',
      delayed:      'En retard',
      pending:      'En attente',
    };
    return map[status];
  }

  projectOf(task: GanttTask): GanttProject {
    return (
      this.projects().find((p) => p.id === task.project) ?? {
        id: '', name: 'Projet', code: '-', color: '#94A3B8',
        collapsed: false, startDate: new Date(), endDate: new Date(),
        progress: 0, status: '', tasks: [],
      }
    );
  }

  // ── UTILS ─────────────────────────────────────────────────────────────────
  trackById(index: number, item: unknown): unknown {
    if (item && typeof item === 'object' && 'id' in item) {
      return (item as { id: unknown }).id;
    }
    return item ?? index;
  }

  colRange(n: number): number[] {
    return Array.from({ length: n + 1 }, (_, i) => i);
  }

  // ── BUILD DATASET ─────────────────────────────────────────────────────────
  private buildDataset(
    projects: Project[],
    phases: Phase[],
    tasks: ApiTask[],
  ): GanttDataset {
    const palette = ['#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#14B8A6'];
    const phaseMap = new Map(
      phases.filter((p) => p._id).map((p) => [p._id!, p]),
    );
    const tasksByProject = new Map<string, GanttTask[]>();
    const mappedTasks: GanttTask[] = [];

    for (const task of tasks) {
      const projectId = this.resolveTaskProjectId(task, phaseMap);
      if (!projectId) continue;

      const project    = projects.find((e) => e._id === projectId);
      const phase      = this.resolveTaskPhase(task, phaseMap);
      const mappedTask = this.mapTask(task, projectId, project, phase);
      mappedTasks.push(mappedTask);

      const bucket = tasksByProject.get(projectId) ?? [];
      bucket.push(mappedTask);
      tasksByProject.set(projectId, bucket);
    }

    const mappedProjects = projects.map((project, index) => {
      const projectTasks = (tasksByProject.get(project._id ?? '') ?? []).sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime(),
      );

      const phaseDates = phases
        .filter((ph) => ph.idProject === project._id)
        .flatMap((ph) => [
          this.parseDate(ph.dateDebutReelle),
          this.parseDate(ph.dateDebutPrevue),
          this.parseDate(ph.dateFinReelle),
          this.parseDate(ph.dateFinPrevue),
        ])
        .filter((d): d is Date => d !== null);

      const startDate =
        this.minDate([
          this.parseDate(project.dateDebut),
          ...phaseDates,
          ...projectTasks.map((t) => t.startDate),
        ]) ?? this.startOfDay(new Date());

      const endDate =
        this.maxDate([
          this.parseDate(project.dateFinReelle),
          this.parseDate(project.dateFinPrevue),
          ...phaseDates,
          ...projectTasks.map((t) => t.endDate),
        ]) ?? startDate;

      const progress = projectTasks.length
        ? Math.round(
            projectTasks.reduce((sum, t) => sum + t.progress, 0) / projectTasks.length,
          )
        : this.projectProgressFromStatus(project.statut);

      return {
        id: project._id ?? `project-${index}`,
        name: project.nom,
        code: project.codeProject,
        color: palette[index % palette.length],
        collapsed: false,
        startDate,
        endDate,
        progress,
        status: project.statut ?? 'PLANIFIE',
        tasks: projectTasks,
      } satisfies GanttProject;
    });

    return {
      projects: mappedProjects.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
      tasks:    mappedTasks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
    };
  }

  // ── MAP TASK ──────────────────────────────────────────────────────────────
  private mapTask(
    task: ApiTask,
    projectId: string,
    project: Project | undefined,
    phase: Phase | null,
  ): GanttTask {
    const estimatedHours = this.normalizeNumber(task.estimatedHours, task.heureEstimees);
    const actualHours    = this.normalizeNumber(task.actualHours,    task.heureRelles);
    const durationDays   = Math.max(1, Math.ceil((estimatedHours || 8) / 8));

    const deadline =
      this.parseDate(task.deadline)        ??
      this.parseDate(task.dateEcheance)    ??
      this.parseDate(phase?.dateFinReelle) ??
      this.parseDate(phase?.dateFinPrevue) ??
      this.parseDate(project?.dateFinPrevue);

    const startDate =
      this.parseDate(task.dateDebut)            ??
      (deadline ? this.addDays(deadline, -(durationDays - 1)) : null) ??
      this.parseDate(phase?.dateDebutReelle)    ??
      this.parseDate(phase?.dateDebutPrevue)    ??
      this.parseDate(project?.dateDebut)        ??
      this.parseDate(task.createdAt)            ??
      this.startOfDay(new Date());

    const endDate =
      this.parseDate(task.dateFin) ??
      deadline                     ??
      this.addDays(startDate, durationDays - 1);

    const status   = this.mapTaskStatus(task, endDate);
    const progress = this.resolveTaskProgress(status, estimatedHours, actualHours);
    const assignee = this.resolveAssigneeName(task);

    return {
      id:               task._id,
      name:             task.title ?? task.titre ?? 'Tâche sans titre',
      project:          projectId,
      projectName:      project?.nom ?? 'Projet',
      phaseName:        phase?.nom   ?? 'Phase non renseignée',
      assignee,
      assigneeInitials: this.toInitials(assignee),
      assigneeColor:    this.avatarColor(assignee),
      status,
      startDate,
      endDate,
      duration:         this.diffInDays(startDate, endDate) + 1,
      progress,
      estimatedHours,
      actualHours,
      description:      task.description,
      dependencies:     [],
    };
  }

  // ── RESOLVE HELPERS ───────────────────────────────────────────────────────
  private resolveTaskProjectId(task: ApiTask, phaseMap: Map<string, Phase>): string | null {
    if (task.idProject) return task.idProject;
    if (task.phase && typeof task.phase !== 'string' && task.phase.idProject) {
      return task.phase.idProject;
    }
    const phaseId = this.resolvePhaseId(task);
    return phaseId ? phaseMap.get(phaseId)?.idProject ?? null : null;
  }

  private resolveTaskPhase(task: ApiTask, phaseMap: Map<string, Phase>): Phase | null {
    const phaseId = this.resolvePhaseId(task);
    return phaseId ? phaseMap.get(phaseId) ?? null : null;
  }

  private resolvePhaseId(task: ApiTask): string | null {
    if (task.idPhase) return task.idPhase;
    if (typeof task.phase === 'string') return task.phase;
    return task.phase?._id ?? null;
  }

  private mapTaskStatus(task: ApiTask, endDate: Date): TaskStatus {
    const raw = (task.status ?? task.statut ?? '').toString().toLowerCase();
    if (['done', 'terminee', 'terminée'].includes(raw)) return 'completed';
    if (['in_progress', 'en cours', 'in progress'].includes(raw)) {
      return endDate.getTime() < Date.now() ? 'delayed' : 'in-progress';
    }
    if (endDate.getTime() < Date.now()) return 'delayed';
    return 'pending';
  }

  private resolveTaskProgress(
    status: TaskStatus,
    estimatedHours: number,
    actualHours: number,
  ): number {
    if (status === 'completed') return 100;
    if (estimatedHours > 0 && actualHours > 0) {
      return Math.min(95, Math.round((actualHours / estimatedHours) * 100));
    }
    if (status === 'in-progress') return 55;
    if (status === 'delayed')     return 65;
    return 0;
  }

  private resolveAssigneeName(task: ApiTask): string {
    if (task.assigneNom) return task.assigneNom;
    if (task.assignedTo && typeof task.assignedTo !== 'string') {
      return task.assignedTo.username ?? task.assignedTo.email ?? 'Non assigné';
    }
    return task.assigneEmail ?? 'Non assigné';
  }

  private projectProgressFromStatus(status?: string): number {
    const v = (status ?? '').toUpperCase();
    if (v === 'TERMINE')   return 100;
    if (v === 'EN COURS')  return 60;
    if (v === 'EN RETARD') return 55;
    return 0;
  }

  // ── DATE UTILS ────────────────────────────────────────────────────────────
  private parseDate(value?: string | null): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : this.startOfDay(date);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private diffInDays(start: Date, end: Date): number {
    return Math.max(
      0,
      Math.round(
        (this.startOfDay(end).getTime() - this.startOfDay(start).getTime()) / 86_400_000,
      ),
    );
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return this.startOfDay(next);
  }

  private formatHeader(date: Date, mode: ViewMode): string {
    if (mode === 'week') {
      return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(date);
    }
    if (mode === 'month') return `S${this.weekNumber(date)}`;
    return new Intl.DateTimeFormat('fr-FR', { month: 'short', year: '2-digit' }).format(date);
  }

  private weekNumber(date: Date): number {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((this.diffInDays(firstDay, date) + firstDay.getDay() + 1) / 7);
  }

  private minDate(dates: Array<Date | null>): Date | null {
    const filtered = dates.filter((d): d is Date => d !== null);
    return filtered.length ? new Date(Math.min(...filtered.map((d) => d.getTime()))) : null;
  }

  private maxDate(dates: Array<Date | null>): Date | null {
    const filtered = dates.filter((d): d is Date => d !== null);
    return filtered.length ? new Date(Math.max(...filtered.map((d) => d.getTime()))) : null;
  }

  private normalizeNumber(...values: Array<number | undefined>): number {
    for (const v of values) {
      if (typeof v === 'number' && !Number.isNaN(v)) return v;
    }
    return 0;
  }

  private toInitials(value: string): string {
    return value
      .split(/[.\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk[0]?.toUpperCase() ?? '')
      .join('');
  }

  private avatarColor(value: string): string {
    const palette = ['#DBEAFE', '#D1FAE5', '#FEE2E2', '#EDE9FE', '#FEF3C7', '#CCFBF1'];
    const seed    = value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return palette[seed % palette.length] ?? '#DBEAFE';
  }
}