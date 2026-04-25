import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { of, switchMap } from 'rxjs';
import { TechnicianTaskCardComponent } from '../../../shared/technician/task-card/task-card';
import { TechnicianProjectSummary } from '../../../core/models/technician.model';
import { TechnicianProfileService } from '../../../services/technician/technician-profile.service';
import { TechnicianTaskService } from '../../../services/technician/task.service';
import { TimerStateService } from '../../../services/technician/timer-state.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-technician-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, TechnicianTaskCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianDashboardPage {
  readonly router = inject(Router);
  private readonly profileService = inject(TechnicianProfileService);
  private readonly taskService = inject(TechnicianTaskService);
  readonly timerState = inject(TimerStateService);
  private readonly toast = inject(ToastService);

  readonly profile = toSignal(this.profileService.getCurrentProfile(), { initialValue: null });
  readonly userId = computed(() => this.profile()?._id ?? null);
  readonly tasks = toSignal(
    toObservable(this.userId).pipe(
      switchMap((userId) => (userId ? this.taskService.getByTechnician(userId) : of([]))),
    ),
    { initialValue: [] },
  );
  readonly projects = toSignal(
    toObservable(this.userId).pipe(
      switchMap((userId) => (userId ? this.taskService.getProjectsByTechnician(userId) : of([]))),
    ),
    { initialValue: [] as TechnicianProjectSummary[] },
  );

  readonly activeTask = computed(
    () =>
      this.tasks().find((task) => task.id === this.timerState.taskId()) ??
      this.tasks().find((task) => task.status === 'in_progress') ??
      this.tasks().find((task) => task.status === 'todo') ??
      null,
  );

  readonly nextTasks = computed(() =>
    this.tasks()
      .filter((task) => task.status !== 'done')
      .slice(0, 3),
  );

  readonly completion = computed(() => this.profileService.buildStats(this.tasks(), this.timerState.totalTrackedSeconds()));

  readonly quickActions = [
    {
      icon: 'task_alt',
      title: 'Voir les tâches',
      description: 'Pilotage terrain du jour',
      action: () => this.router.navigate(['/technician/tasks']),
    },
    {
      icon: 'calendar_month',
      title: 'Planning semaine',
      description: 'Vue chantier glissante',
      action: () => this.router.navigate(['/technician/schedule']),
    },
    {
      icon: 'solar_power',
      title: 'Mes projets',
      description: 'Sites PV assignés',
      action: () => this.router.navigate(['/technician/projects']),
    },
  ];

  startOrResumeTask(): void {
    const task = this.activeTask();
    if (!task) {
      return;
    }

    if (this.timerState.taskId() === task.id && this.timerState.isPaused()) {
      this.timerState.resume();
      this.toast.show('Chronomètre repris.', 'success');
      this.router.navigate(['/technician/focus']);
      return;
    }

    this.timerState.start(task.id);
    this.toast.show(`Chronomètre démarré pour ${task.title}.`, 'success');
    this.router.navigate(['/technician/focus']);
  }

  openTask(taskId: string): void {
    this.router.navigate(['/technician/tasks', taskId]);
  }

  openFocus(taskId: string): void {
    if (this.timerState.taskId() !== taskId) {
      this.timerState.start(taskId);
    }

    this.router.navigate(['/technician/focus']);
  }

  openProject(projectId?: string): void {
    if (!projectId) {
      return;
    }

    this.router.navigate(['/technician/projects'], { fragment: projectId });
  }
}
