import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { of, switchMap } from 'rxjs';
import { TechnicianTaskFilter, TechnicianTaskStatus } from '../../../core/models/technician.model';
import { TechnicianFilterBarComponent } from '../../../shared/technician/filter-bar/filter-bar';
import { TechnicianTaskCardComponent } from '../../../shared/technician/task-card/task-card';
import { TechnicianProfileService } from '../../../services/technician/technician-profile.service';
import { TechnicianTaskService } from '../../../services/technician/task.service';
import { TimerStateService } from '../../../services/technician/timer-state.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-technician-task-list-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TechnicianFilterBarComponent, TechnicianTaskCardComponent],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianTaskListPage {
  private readonly router = inject(Router);
  private readonly profileService = inject(TechnicianProfileService);
  private readonly taskService = inject(TechnicianTaskService);
  private readonly timerState = inject(TimerStateService);
  private readonly toast = inject(ToastService);

  readonly activeFilter = signal<TechnicianTaskFilter>('today');
  readonly profile = toSignal(this.profileService.getCurrentProfile(), { initialValue: null });
  readonly userId = computed(() => this.profile()?._id ?? null);
  readonly tasks = toSignal(
    toObservable(this.userId).pipe(
      switchMap((userId) => (userId ? this.taskService.getByTechnician(userId) : of([]))),
    ),
    { initialValue: [] },
  );

  readonly filteredTasks = computed(() => {
    const now = new Date();
    const weekLimit = new Date(now);
    weekLimit.setDate(now.getDate() + 7);

    return this.tasks().filter((task) => {
      const deadline = new Date(task.deadline).getTime();

      switch (this.activeFilter()) {
        case 'done':
          return task.status === 'done';
        case 'late':
          return task.status !== 'done' && deadline < now.getTime();
        case 'week':
          return deadline >= now.getTime() && deadline <= weekLimit.getTime();
        case 'today':
        default:
          return new Date(task.deadline).toDateString() === now.toDateString();
      }
    });
  });

  readonly counters = computed(() => this.profileService.buildStats(this.tasks(), this.timerState.totalTrackedSeconds()));

  openTask(taskId: string): void {
    this.router.navigate(['/technician/tasks', taskId]);
  }

  openFocus(taskId: string): void {
    if (this.timerState.taskId() !== taskId) {
      this.timerState.start(taskId);
    }

    this.router.navigate(['/technician/focus']);
  }

  updateTaskStatus(taskId: string, status: TechnicianTaskStatus): void {
    this.taskService.updateStatus(taskId, status).subscribe({
      next: () => this.toast.show('État de tâche mis à jour.', 'success'),
      error: () => this.toast.show('Mise à jour impossible.', 'error'),
    });
  }
}
