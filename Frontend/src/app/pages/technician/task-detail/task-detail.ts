import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, of, switchMap } from 'rxjs';
import { TechnicianPhoto, TechnicianTaskStatus } from '../../../core/models/technician.model';
import { TechnicianTaskService } from '../../../services/technician/task.service';
import { TimerStateService } from '../../../services/technician/timer-state.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-technician-task-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianTaskDetailPage {
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly taskService = inject(TechnicianTaskService);
  readonly timerState = inject(TimerStateService);
  private readonly toast = inject(ToastService);

  readonly taskId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('taskId') ?? '')),
    { initialValue: '' },
  );
  readonly task = toSignal(
    toObservable(this.taskId).pipe(
      switchMap((taskId) => (taskId ? this.taskService.getById(taskId) : of(null))),
    ),
    { initialValue: null },
  );

  readonly issueMessage = signal('');
  readonly notesDraft = signal('');
  readonly canResume = computed(
    () => this.timerState.taskId() === this.taskId() && this.timerState.isPaused(),
  );
  readonly canControlTimer = computed(() => this.timerState.taskId() === this.taskId());

  constructor() {
    effect(() => {
      const task = this.task();
      if (!task) {
        return;
      }

      this.notesDraft.set(task.notes);
      this.issueMessage.set(task.issueMessage ?? '');
    });
  }

  toggleChecklist(itemId: string, event: MatCheckboxChange): void {
    const task = this.task();
    if (!task) {
      return;
    }

    const checklist = task.checklist.map((item) =>
      item.id === itemId ? { ...item, done: event.checked } : item,
    );
    this.taskService.updateEnhancement(task.id, { checklist });
  }

  saveNotes(): void {
    const task = this.task();
    if (!task) {
      return;
    }

    this.taskService.updateEnhancement(task.id, { notes: this.notesDraft() });
    this.toast.show('Notes enregistrées localement.', 'success');
  }

  reportIssue(): void {
    const task = this.task();
    if (!task) {
      return;
    }

    this.taskService.updateEnhancement(task.id, {
      issueReported: true,
      issueMessage: this.issueMessage(),
    });
    this.toast.show('Signalement ajouté.', 'warning');
  }

  onPhotoSelection(event: Event): void {
    const task = this.task();
    if (!task || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) {
      return;
    }

    const newPhotos: TechnicianPhoto[] = files.map((file, index) => ({
      id: `${task.id}-${Date.now()}-${index}`,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    }));

    this.taskService.updateEnhancement(task.id, {
      photos: [...task.photos, ...newPhotos],
    });

    input.value = '';
    this.toast.show(`${files.length} photo(s) ajoutée(s).`, 'success');
  }

  startTimer(): void {
    const task = this.task();
    if (!task) {
      return;
    }

    this.taskService.updateStatus(task.id, 'in_progress').subscribe({
      next: () => {
        this.timerState.start(task.id);
        this.toast.show('Chronomètre démarré.', 'success');
        this.router.navigate(['/technician/focus']);
      },
      error: () => this.toast.show('Impossible de démarrer la tâche.', 'error'),
    });
  }

  pauseTimer(): void {
    this.timerState.pause();
    this.toast.show('Chronomètre en pause.', 'info');
  }

  resumeTimer(): void {
    this.timerState.resume();
    this.toast.show('Chronomètre repris.', 'success');
    this.router.navigate(['/technician/focus']);
  }

  stopTimer(): void {
    const snapshot = this.timerState.stop();
    if (!snapshot) {
      return;
    }

    this.taskService.syncTrackedTime(snapshot.taskId, snapshot.elapsedSeconds, 'in_progress').subscribe({
      next: () => this.toast.show('Temps synchronisé.', 'success'),
      error: () => this.toast.show('Temps arrêté localement.', 'warning'),
    });
  }

  finishTask(): void {
    const task = this.task();
    if (!task) {
      return;
    }

    const snapshot = this.timerState.taskId() === task.id ? this.timerState.stop() : null;
    const elapsedSeconds = snapshot?.elapsedSeconds ?? Math.round(task.actualHours * 3600);

    this.taskService.syncTrackedTime(task.id, elapsedSeconds, 'done').subscribe({
      next: () => this.toast.show('Tâche terminée et enregistrée.', 'success'),
      error: () => this.toast.show('Fin de tâche non persistée.', 'error'),
    });
  }

  setStatus(status: TechnicianTaskStatus): void {
    const task = this.task();
    if (!task) {
      return;
    }

    this.taskService.updateStatus(task.id, status).subscribe({
      next: () => this.toast.show('État mis à jour.', 'success'),
      error: () => this.toast.show('Mise à jour impossible.', 'error'),
    });
  }
}
