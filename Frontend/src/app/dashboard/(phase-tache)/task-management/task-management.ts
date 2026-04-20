// task-management.ts — Composant racine, orchestre tout
import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FilterBar }     from '../filter-bar/filter-bar';
import { TaskListComponent } from '../task-list/task-list';
import { AssignModalComponent }   from '../assign-modal/assign-modal';
import { ToastContainerComponent } from '../toast-container/toast-container';
import { MockDataService }        from '../../../services/mock-data.service';
import { ToastService }           from '../../../services/toast.service';
import {
  Task, Technician, TaskFilters
} from '../../../core/models/task-filter.model';

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
  private mockData = inject(MockDataService);
  private toastSvc = inject(ToastService);

  allTasks:    Task[]       = [];
  technicians: Technician[] = [];

  filters         = signal<TaskFilters>({
    search: '', technicianId: null, status: null, priority: null, deadline: null,
  });
  multiSelectMode = signal(false);
  selectedIds     = signal<Set<string>>(new Set());
  showModal       = signal(false);

  /** Tâches filtrées calculées automatiquement */
  filteredTasks = computed(() => this.applyFilters(this.filters()));

  get selectedCount(): number { return this.selectedIds().size; }

  ngOnInit(): void {
    this.allTasks    = [...this.mockData.tasks];
    this.technicians = this.mockData.technicians;
  }

  private applyFilters(f: TaskFilters): Task[] {
    const now     = new Date();
    const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
    const weekEnd  = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);

    return this.allTasks.filter(task => {
      if (f.search) {
        const q = f.search.toLowerCase();
        if (!task.title.toLowerCase().includes(q) &&
            !task.description.toLowerCase().includes(q)) return false;
      }
      if (f.technicianId && task.assignedTo?.id !== f.technicianId) return false;
      if (f.status       && task.status    !== f.status)             return false;
      if (f.priority     && task.priority  !== f.priority)           return false;
      if (f.deadline === 'today'     && task.deadline > todayEnd) return false;
      if (f.deadline === 'this-week' && task.deadline > weekEnd)  return false;
      if (f.deadline === 'late'      &&
         (task.deadline >= now || task.status === 'done'))         return false;
      return true;
    });
  }

  onFiltersChange(updated: TaskFilters): void {
    this.filters.set(updated);
    // Retirer les sélections hors vue
    const visibleIds = new Set(this.filteredTasks().map(t => t.id));
    this.selectedIds.update(ids => new Set([...ids].filter(id => visibleIds.has(id))));
  }

  toggleMultiSelect(): void {
    this.multiSelectMode.update(v => !v);
    if (!this.multiSelectMode()) this.selectedIds.set(new Set());
  }

  toggleTaskSelection(taskId: string): void {
    this.selectedIds.update(ids => {
      const next = new Set(ids);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  }

  selectAll():    void { this.selectedIds.set(new Set(this.filteredTasks().map(t => t.id))); }
  clearSelection(): void { this.selectedIds.set(new Set()); }

  openAssignModal(): void {
    if (this.selectedCount > 0) this.showModal.set(true);
  }

  onAssignConfirmed(technician: Technician): void {
    const ids = this.selectedIds();
    this.allTasks = this.allTasks.map(task =>
      ids.has(task.id) ? { ...task, assignedTo: technician } : task
    );
    this.showModal.set(false);
    this.selectedIds.set(new Set());
    this.toastSvc.show(
      `${ids.size} task${ids.size > 1 ? 's' : ''} assigned to ${technician.name} ✓`,
      'success'
    );
  }

  onModalDismissed(): void { this.showModal.set(false); }

  get stats() {
    const t = this.filteredTasks();
    return {
      total:      t.length,
      todo:       t.filter(x => x.status === 'todo').length,
      inProgress: t.filter(x => x.status === 'in-progress').length,
      done:       t.filter(x => x.status === 'done').length,
      late:       t.filter(x => x.deadline < new Date() && x.status !== 'done').length,
    };
  }
}