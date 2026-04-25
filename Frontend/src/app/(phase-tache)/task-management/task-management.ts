import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { FilterBar, ProjectOption } from '../filter-bar/filter-bar';
import { TaskListComponent } from '../task-list/task-list';
import { AssignModalComponent } from '../assign-modal/assign-modal';
import { ToastContainerComponent } from '../toast-container/toast-container';

import { TacheService }      from '../../services/tache-service';
import { TechnicienService } from '../../services/technicien';
import { ToastService }      from '../../services/toast.service';
import { ProjectService }    from '../../services/service-project';
import { PhaseService }      from '../../services/phase-service';

import {
  Task,
  TaskFilters,
  TaskStatus,
  TaskPriority,
  Technician
} from '../../core/models/task-filter.model';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [
    CommonModule,
    FilterBar,
    TaskListComponent,
    AssignModalComponent,
    ToastContainerComponent,
  ],
  templateUrl: './task-management.html',
  styleUrls: ['./task-management.css'],
})
export class TaskManagementComponent implements OnInit {

  private tacheSvc   = inject(TacheService);
  private techSvc    = inject(TechnicienService);
  private toastSvc   = inject(ToastService);
  private projectSvc = inject(ProjectService);
  private phaseSvc   = inject(PhaseService);

  // ── STATE ──────────────────────────────────────────────────────────────────
  allTasks    = signal<Task[]>([]);
  technicians = signal<Technician[]>([]);
  projects    = signal<ProjectOption[]>([]);
  loading     = signal(true);

  // Map phaseId → projectId
  private phaseProjectMap = new Map<string, string>();

  filters = signal<TaskFilters>({
    search       : '',
    technicianId : null,
    projectId    : null,
    status       : null,
    priority     : null,
    deadline     : null,
  });

  multiSelectMode = signal(false);
  selectedIds     = signal<Set<string>>(new Set());
  showModal       = signal(false);

  // ── COMPUTED ───────────────────────────────────────────────────────────────
  filteredTasks = computed(() => this.applyFilters(this.filters()));

  get selectedCount(): number { return this.selectedIds().size; }

  // ── INIT ───────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    // ✅ Charger techniciens + phases + projets en parallèle, puis les tâches
    forkJoin({
      techs   : this.techSvc.getTechniciens(),
      phases  : this.phaseSvc.getAll(),
      projects: this.projectSvc.getAll(),
    }).subscribe({
      next: ({ techs, phases, projects }) => {

        // ✅ Alimenter le signal technicians
        this.technicians.set((techs as any[]).map(t => ({
          id          : t._id      ?? '',
          name        : t.username ?? 'Inconnu',
          role        : t.role     ?? 'technician',
          avatar      : '',
          avatarColor : ''
        })));

        // ✅ Construire map phaseId → projectId
        this.phaseProjectMap.clear();
        (phases as any[]).forEach((phase: any) => {
          const phaseId   = phase._id ?? '';
          const projectId = phase.idProject
            ? (typeof phase.idProject === 'object'
                ? phase.idProject._id ?? ''
                : phase.idProject)
            : '';
          if (phaseId && projectId) {
            this.phaseProjectMap.set(phaseId, projectId);
          }
        });

        // ✅ Alimenter le signal projects
        this.projects.set((projects as any[]).map((p: any) => ({
          id  : p._id ?? '',
          name: p.nom ?? ''
        })));

        // ✅ Charger les tâches une fois que tout est prêt
        this.loadTasks();
      },
      error: (err) => {
        console.error('🔴 Erreur chargement initial:', err);
        this.toastSvc.show('Erreur chargement données', 'error');
        this.loadTasks();
      }
    });
  }

  // ── LOAD TASKS ─────────────────────────────────────────────────────────────
  private loadTasks(): void {
    this.tacheSvc.getAll().subscribe({
      next: (tasks: any[]) => {
        this.allTasks.set((tasks ?? []).map(t => this.mapTask(t)));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('🔴 /api/taches:', err);
        this.toastSvc.show('Erreur chargement des tâches', 'error');
        this.loading.set(false);
      }
    });
  }

  // ── MAPPING backend → frontend ─────────────────────────────────────────────
  private mapTask(t: any): Task {

    // ✅ phase peut être objet populé { _id, nom } ou string id
    const phaseId   = typeof t.phase === 'object' && t.phase !== null
                        ? t.phase._id ?? ''
                        : t.phase     ?? '';
    const phaseName = t.phase?.nom ?? '';

    // ✅ Résoudre projectId via la map phaseId → projectId
    const projectId = this.phaseProjectMap.get(phaseId) ?? '';

    // ✅ Résoudre assignedTo depuis la liste des techniciens déjà chargés
    // L'API retourne assignedTo = { _id: "..." } sans username
    // On cherche le technicien dans la liste pour avoir son vrai nom
    const assignedTo: Technician | null = t.assignedTo
      ? (() => {
          const techId = typeof t.assignedTo === 'object'
            ? t.assignedTo._id ?? t.assignedTo.id ?? ''
            : t.assignedTo ?? '';

          // Chercher dans la liste des techniciens chargés
          const found = this.technicians().find(tech => tech.id === techId);

          return found ?? {
            id          : techId,
            name        : t.assignedTo.username ?? t.assignedTo.name ?? 'Inconnu',
            role        : t.assignedTo.role     ?? 'technician',
            avatar      : '',
            avatarColor : ''
          };
        })()
      : null;

    return {
      id            : t._id             ?? '',
      title         : t.title           ?? t.titre         ?? '(sans titre)',
      description   : t.description     ?? '',
      status        : this.normalizeStatus(t.status    ?? t.statut),
      priority      : this.normalizePriority(t.priority ?? t.priorite),
      complexity    : t.complexity      ?? t.complexite    ?? '',
      estimatedHours: t.estimatedHours  ?? t.heureEstimees ?? 0,
      actualHours   : t.actualHours     ?? t.heureReelles  ?? 0,
      deadline      : t.deadline        ? new Date(t.deadline)
                    : t.dateEcheance    ? new Date(t.dateEcheance)
                    : new Date(),
      phaseId,
      phaseName,
      projectId,
      assignedTo,
    };
  }

  private normalizeStatus(s: string): TaskStatus {
    switch ((s ?? '').toLowerCase().trim()) {
      case 'todo'        :
      case 'a faire'     :
      case 'a_faire'     : return 'todo';
      case 'in-progress' :
      case 'en cours'    :
      case 'en_cours'    : return 'in-progress';
      case 'done'        :
      case 'terminee'    :
      case 'termine'     : return 'done';
      default            : return 'todo';
    }
  }

  private normalizePriority(p: string): TaskPriority {
    switch ((p ?? '').toLowerCase().trim()) {
      case 'low'      :
      case 'basse'    :
      case 'faible'   : return 'low';
      case 'high'     :
      case 'haute'    :
      case 'critique' :
      case 'urgent'   : return 'high';
      default         : return 'medium';
    }
  }

  // ── FILTRES ────────────────────────────────────────────────────────────────
  private applyFilters(f: TaskFilters): Task[] {
    const now = new Date();

    return this.allTasks().filter(task => {

      if (f.search) {
        const q = f.search.toLowerCase();
        if (
          !task.title.toLowerCase().includes(q) &&
          !task.description.toLowerCase().includes(q)
        ) return false;
      }

      if (f.projectId    && task.projectId      !== f.projectId)    return false;
      if (f.technicianId && task.assignedTo?.id !== f.technicianId) return false;
      if (f.status       && task.status         !== f.status)       return false;
      if (f.priority     && task.priority       !== f.priority)     return false;

      if (f.deadline === 'today') {
        const end = new Date(); end.setHours(23, 59, 59, 999);
        if (task.deadline > end) return false;
      }
      if (f.deadline === 'this-week') {
        const week = new Date(); week.setDate(week.getDate() + 7);
        if (task.deadline > week) return false;
      }
      if (f.deadline === 'late') {
        if (task.deadline >= now || task.status === 'done') return false;
      }

      return true;
    });
  }

  // ── EVENTS ─────────────────────────────────────────────────────────────────
  onFiltersChange(updated: TaskFilters): void {
    this.filters.set(updated);
  }

  toggleTaskSelection(id: string): void {
    this.selectedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  selectAll()    : void { this.selectedIds.set(new Set(this.filteredTasks().map(t => t.id))); }
  clearSelection(): void { this.selectedIds.set(new Set()); }

  toggleMultiSelect(): void {
    this.multiSelectMode.update(v => !v);
    if (!this.multiSelectMode()) this.selectedIds.set(new Set());
  }

  openAssignModal(): void {
    if (this.selectedCount > 0) this.showModal.set(true);
  }

  onAssignConfirmed(tech: Technician): void {
    const ids = [...this.selectedIds()];

    this.allTasks.update(tasks =>
      tasks.map(task => ids.includes(task.id) ? { ...task, assignedTo: tech } : task)
    );

    this.tacheSvc.assign(ids, tech.id).subscribe({
      next : () => this.toastSvc.show(
        `${ids.length} tâche(s) assignée(s) à ${tech.name}`, 'success'
      ),
      error: (err) => {
        console.error('🔴 assign error:', err);
        this.loadTasks();
        this.toastSvc.show('Erreur lors de l\'assignation', 'error');
      }
    });

    this.selectedIds.set(new Set());
    this.showModal.set(false);
  }

  onModalDismissed(): void { this.showModal.set(false); }

  get stats() {
    const t = this.filteredTasks(), now = new Date();
    return {
      total     : t.length,
      todo      : t.filter(x => x.status === 'todo').length,
      inProgress: t.filter(x => x.status === 'in-progress').length,
      done      : t.filter(x => x.status === 'done').length,
      late      : t.filter(x => x.deadline < now && x.status !== 'done').length,
    };
  }
}