import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';

export interface TimerStopSnapshot {
  taskId: string;
  elapsedSeconds: number;
}

@Injectable({ providedIn: 'root' })
export class TimerStateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  private readonly currentTaskId = signal<string | null>(null);
  private readonly running = signal(false);
  private readonly paused = signal(false);
  private readonly startedAt = signal<number | null>(null);
  private readonly carriedSeconds = signal(0);
  private readonly clock = signal(Date.now());
  private readonly trackedTotal = signal(0);

  private tickHandle: ReturnType<typeof setInterval> | null = null;

  readonly taskId = this.currentTaskId.asReadonly();
  readonly isRunning = this.running.asReadonly();
  readonly isPaused = this.paused.asReadonly();
  readonly totalTrackedSeconds = this.trackedTotal.asReadonly();
  readonly hasActiveTimer = computed(() => !!this.currentTaskId());

  readonly elapsedSeconds = computed(() => {
    const startedAt = this.startedAt();
    if (!startedAt || !this.running()) {
      return this.carriedSeconds();
    }

    return this.carriedSeconds() + Math.max(0, Math.floor((this.clock() - startedAt) / 1000));
  });

  readonly elapsedLabel = computed(() => this.formatAsClock(this.elapsedSeconds()));

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        this.stopTicker();
        return;
      }

      if (this.running()) {
        this.startTicker();
        return;
      }

      this.stopTicker();
    });

    const view = this.document.defaultView;
    if (view) {
      view.addEventListener('beforeunload', () => this.stopTicker());
    }
  }

  start(taskId: string): void {
    if (!taskId) {
      return;
    }

    this.currentTaskId.set(taskId);
    this.carriedSeconds.set(0);
    this.paused.set(false);
    this.running.set(true);
    this.startedAt.set(Date.now());
    this.clock.set(Date.now());
  }

  pause(): void {
    if (!this.running() || !this.currentTaskId()) {
      return;
    }

    this.carriedSeconds.set(this.elapsedSeconds());
    this.running.set(false);
    this.paused.set(true);
    this.startedAt.set(null);
  }

  resume(): void {
    if (!this.currentTaskId() || !this.paused()) {
      return;
    }

    this.startedAt.set(Date.now());
    this.clock.set(Date.now());
    this.paused.set(false);
    this.running.set(true);
  }

  stop(): TimerStopSnapshot | null {
    const taskId = this.currentTaskId();
    if (!taskId) {
      return null;
    }

    const elapsedSeconds = this.elapsedSeconds();

    if (elapsedSeconds > 0) {
      this.trackedTotal.update((value) => value + elapsedSeconds);
    }

    this.running.set(false);
    this.paused.set(false);
    this.startedAt.set(null);
    this.currentTaskId.set(null);
    this.carriedSeconds.set(0);
    this.clock.set(Date.now());

    return { taskId, elapsedSeconds };
  }

  private startTicker(): void {
    if (this.tickHandle) {
      return;
    }

    this.tickHandle = setInterval(() => {
      this.clock.set(Date.now());
    }, 1000);
  }

  private stopTicker(): void {
    if (!this.tickHandle) {
      return;
    }

    clearInterval(this.tickHandle);
    this.tickHandle = null;
  }

  private formatAsClock(totalSeconds: number): string {
    const safeSeconds = Math.max(0, totalSeconds);
    const hours = Math.floor(safeSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((safeSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(safeSeconds % 60)
      .toString()
      .padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }
}
