import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, PLATFORM_ID, computed, effect, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of, switchMap } from 'rxjs';
import { TechnicianTaskService } from '../../../services/technician/task.service';
import { TimerStateService, TimerStopSnapshot } from '../../../services/technician/timer-state.service';
import { ToastService } from '../../../services/toast.service';

interface WakeLockSentinelLike {
  release: () => Promise<void>;
}

@Component({
  selector: 'app-technician-timer-focus-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './timer-focus.html',
  styleUrl: './timer-focus.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianTimerFocusPage implements OnDestroy {
  readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly taskService = inject(TechnicianTaskService);
  readonly timerState = inject(TimerStateService);
  private readonly toast = inject(ToastService);

  private wakeLock: WakeLockSentinelLike | null = null;

  readonly task = toSignal(
    toObservable(this.timerState.taskId).pipe(
      switchMap((taskId) => (taskId ? this.taskService.getById(taskId) : of(null))),
    ),
    { initialValue: null },
  );

  readonly stateLabel = computed(() => {
    if (this.timerState.isPaused()) {
      return 'Pause';
    }

    if (this.timerState.isRunning()) {
      return 'En cours';
    }

    return 'Prêt';
  });

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      if (this.timerState.isRunning()) {
        void this.requestWakeLock();
        return;
      }

      void this.releaseWakeLock();
    });
  }

  togglePause(): void {
    if (this.timerState.isRunning()) {
      this.timerState.pause();
      this.toast.show('Chronomètre mis en pause.', 'info');
      return;
    }

    if (this.timerState.isPaused()) {
      this.timerState.resume();
      this.toast.show('Chronomètre repris.', 'success');
    }
  }

  stop(): void {
    const snapshot = this.timerState.stop();
    if (!snapshot) {
      this.router.navigate(['/technician/dashboard']);
      return;
    }

    this.persistSnapshot(snapshot, 'in_progress');
  }

  finishTask(): void {
    const snapshot = this.timerState.stop();
    if (!snapshot) {
      this.router.navigate(['/technician/dashboard']);
      return;
    }

    this.persistSnapshot(snapshot, 'done');
  }

  ngOnDestroy(): void {
    void this.releaseWakeLock();
  }

  private persistSnapshot(snapshot: TimerStopSnapshot, status: 'in_progress' | 'done'): void {
    this.taskService.syncTrackedTime(snapshot.taskId, snapshot.elapsedSeconds, status).subscribe({
      next: () => {
        this.toast.show(
          status === 'done' ? 'Tâche terminée et enregistrée.' : 'Temps synchronisé.',
          'success',
        );
        this.router.navigate(['/technician/tasks', snapshot.taskId]);
      },
      error: () => {
        this.toast.show('Temps arrêté localement, synchronisation à vérifier.', 'warning');
        this.router.navigate(['/technician/tasks', snapshot.taskId]);
      },
    });
  }

  private async requestWakeLock(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || this.wakeLock) {
      return;
    }

    const navigatorRef = this.document.defaultView?.navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> };
    };

    if (!navigatorRef?.wakeLock?.request) {
      return;
    }

    try {
      this.wakeLock = await navigatorRef.wakeLock.request('screen');
    } catch {
      this.wakeLock = null;
    }
  }

  private async releaseWakeLock(): Promise<void> {
    if (!this.wakeLock) {
      return;
    }

    await this.wakeLock.release();
    this.wakeLock = null;
  }
}
