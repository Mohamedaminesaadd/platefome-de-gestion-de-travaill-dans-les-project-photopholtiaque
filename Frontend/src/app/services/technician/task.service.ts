import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable, shareReplay, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Phase } from '../../core/models/phase.model';
import {
  TechnicianChecklistItem,
  TechnicianProjectSummary,
  TechnicianTask,
  TechnicianTaskEnhancement,
  TechnicianTaskPriority,
  TechnicianTaskStatus,
} from '../../core/models/technician.model';
import { Project } from '../../core/models/project.model';
import { PhaseService } from '../phase-service';
import { ProjectService } from '../service-project';

interface ApiTask {
  _id: string;
  title: string;
  description?: string;
  deadline?: string;
  estimatedHours?: number;
  actualHours?: number;
  status?: TechnicianTaskStatus;
  priority?: TechnicianTaskPriority;
  complexity?: string;
  cost?: number;
  phase?: string | ({ _id?: string; nom?: string } & Partial<Phase>);
  assignedTo?: string | { _id?: string; username?: string; email?: string; name?: string };
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class TechnicianTaskService {
  private readonly http = inject(HttpClient);
  private readonly phaseService = inject(PhaseService);
  private readonly projectService = inject(ProjectService);
  private readonly API = 'http://localhost:3000/api/taches';

  private readonly enhancements = signal<Record<string, TechnicianTaskEnhancement>>({});
  private readonly refreshTick = signal(0);
  private readonly enhancements$ = toObservable(this.enhancements);
  private readonly refresh$ = toObservable(this.refreshTick);
  private readonly phases$ = this.phaseService.getAll().pipe(shareReplay(1));
  private readonly projects$ = this.projectService.getAll().pipe(shareReplay(1));

  getByTechnician(technicianId: string): Observable<TechnicianTask[]> {
    return combineLatest([
      this.http.get<ApiTask[]>(`${this.API}/user/${technicianId}`),
      this.phases$,
      this.projects$,
      this.enhancements$,
      this.refresh$,
    ]).pipe(
      map(([tasks, phases, projects, enhancements]) =>
        tasks.map((task) => this.mapTask(task, phases, projects, enhancements[task._id])),
      ),
      map((tasks) => tasks.sort((left, right) => +new Date(left.deadline) - +new Date(right.deadline))),
    );
  }

  getById(taskId: string): Observable<TechnicianTask> {
    return combineLatest([
      this.http.get<ApiTask>(`${this.API}/${taskId}`),
      this.phases$,
      this.projects$,
      this.enhancements$,
      this.refresh$,
    ]).pipe(
      map(([task, phases, projects, enhancements]) =>
        this.mapTask(task, phases, projects, enhancements[task._id]),
      ),
    );
  }

  getProjectsByTechnician(technicianId: string): Observable<TechnicianProjectSummary[]> {
    return combineLatest([this.getByTechnician(technicianId), this.projects$]).pipe(
      map(([tasks, projects]) => {
        const projectMap = new Map<string, TechnicianProjectSummary>();

        for (const task of tasks) {
          if (!task.projectId) {
            continue;
          }

          const project = projects.find((entry) => entry._id === task.projectId);
          const current = projectMap.get(task.projectId);
          const isOverdue = task.status !== 'done' && new Date(task.deadline).getTime() < Date.now();

          if (!current) {
            projectMap.set(task.projectId, {
              _id: task.projectId,
              nom: task.projectName ?? project?.nom ?? 'Projet PV',
              codeProject: task.projectCode ?? project?.codeProject ?? 'PV',
              adresse: task.projectAddress ?? project?.adresse,
              statut: project?.statut,
              taskCount: 1,
              completedTaskCount: task.status === 'done' ? 1 : 0,
              activeTaskCount: task.status === 'in_progress' ? 1 : 0,
              overdueTaskCount: isOverdue ? 1 : 0,
              nextDeadline: task.deadline,
            });
            continue;
          }

          current.taskCount += 1;
          current.completedTaskCount += task.status === 'done' ? 1 : 0;
          current.activeTaskCount += task.status === 'in_progress' ? 1 : 0;
          current.overdueTaskCount += isOverdue ? 1 : 0;
          current.nextDeadline =
            new Date(task.deadline).getTime() < new Date(current.nextDeadline ?? task.deadline).getTime()
              ? task.deadline
              : current.nextDeadline;
        }

        return Array.from(projectMap.values()).sort((left, right) =>
          (left.nextDeadline ?? '').localeCompare(right.nextDeadline ?? ''),
        );
      }),
    );
  }

  updateStatus(taskId: string, status: TechnicianTaskStatus): Observable<TechnicianTask> {
    return this.http
      .patch<ApiTask>(`${this.API}/${taskId}`, { status })
      .pipe(
        tap(() => this.refreshTick.update((value) => value + 1)),
        map((task) =>
          this.mapTask(task, [], [], this.enhancements()[taskId]),
        ),
      );
  }

  syncTrackedTime(taskId: string, elapsedSeconds: number, status?: TechnicianTaskStatus): Observable<void> {
    const payload: Record<string, unknown> = {
      actualHours: Number((elapsedSeconds / 3600).toFixed(2)),
      tempsReel: elapsedSeconds,
    };

    if (status) {
      payload['status'] = status;
    }

    return this.http.patch<void>(`${this.API}/${taskId}`, payload).pipe(
      tap(() => this.refreshTick.update((value) => value + 1)),
    );
  }

  updateEnhancement(taskId: string, patch: TechnicianTaskEnhancement): void {
    this.enhancements.update((current) => ({
      ...current,
      [taskId]: {
        ...current[taskId],
        ...patch,
      },
    }));
  }

  private mapTask(
    task: ApiTask,
    phases: Phase[],
    projects: Project[],
    enhancement?: TechnicianTaskEnhancement,
  ): TechnicianTask {
    const phaseId = this.resolvePhaseId(task.phase);
    const phase = phases.find((entry) => entry._id === phaseId);
    const project = projects.find((entry) => entry._id === phase?.idProject);
    const defaultChecklist = this.buildDefaultChecklist(task);
    const actualHours = task.actualHours ?? 0;
    const estimatedHours = task.estimatedHours ?? 0;
    const progressPercent =
      estimatedHours > 0 ? Math.min(100, Math.round((actualHours / estimatedHours) * 100)) : 0;

    return {
      id: task._id,
      title: task.title,
      description: task.description ?? 'Aucune description disponible.',
      deadline: task.deadline ?? new Date().toISOString(),
      estimatedHours,
      actualHours,
      progressPercent,
      status: task.status ?? 'todo',
      priority: task.priority ?? 'medium',
      complexity: task.complexity,
      cost: task.cost,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      phaseId,
      phaseName: this.resolvePhaseName(task.phase) ?? phase?.nom,
      projectId: project?._id,
      projectName: project?.nom,
      projectCode: project?.codeProject,
      projectAddress: project?.adresse,
      assignedToId: this.resolveAssignedId(task.assignedTo),
      assignedTechnicianName: this.resolveAssignedName(task.assignedTo),
      checklist: enhancement?.checklist ?? defaultChecklist,
      notes: enhancement?.notes ?? '',
      photos: enhancement?.photos ?? [],
      issueReported: enhancement?.issueReported ?? false,
      issueMessage: enhancement?.issueMessage,
    };
  }

  private buildDefaultChecklist(task: ApiTask): TechnicianChecklistItem[] {
    return [
      { id: `${task._id}-safety`, label: 'Contrôle sécurité', done: false },
      { id: `${task._id}-materials`, label: 'Matériel prêt', done: false },
      { id: `${task._id}-qa`, label: 'Validation qualité', done: false },
    ];
  }

  private resolvePhaseId(phase: ApiTask['phase']): string | undefined {
    if (!phase) {
      return undefined;
    }

    return typeof phase === 'string' ? phase : phase._id;
  }

  private resolvePhaseName(phase: ApiTask['phase']): string | undefined {
    if (!phase || typeof phase === 'string') {
      return undefined;
    }

    return phase.nom;
  }

  private resolveAssignedId(assignedTo: ApiTask['assignedTo']): string | undefined {
    if (!assignedTo) {
      return undefined;
    }

    return typeof assignedTo === 'string' ? assignedTo : assignedTo._id;
  }

  private resolveAssignedName(assignedTo: ApiTask['assignedTo']): string | undefined {
    if (!assignedTo || typeof assignedTo === 'string') {
      return undefined;
    }

    return assignedTo.name ?? assignedTo.username ?? assignedTo.email;
  }
}
