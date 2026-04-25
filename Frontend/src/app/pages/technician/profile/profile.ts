import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Chart } from 'chart.js/auto';
import { of, switchMap } from 'rxjs';
import { TechnicianProfileService } from '../../../services/technician/technician-profile.service';
import { TechnicianTaskService } from '../../../services/technician/task.service';
import { TimerStateService } from '../../../services/technician/timer-state.service';

@Component({
  selector: 'app-technician-profile-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianProfilePage implements AfterViewInit, OnDestroy {
  @ViewChild('chartRef') private chartRef?: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly profileService = inject(TechnicianProfileService);
  private readonly taskService = inject(TechnicianTaskService);
  private readonly timerState = inject(TimerStateService);

  private chart: Chart | null = null;
  private readonly viewReady = signal(false);

  readonly profile = toSignal(this.profileService.getCurrentProfile(), { initialValue: null });
  readonly userId = computed(() => this.profile()?._id ?? null);
  readonly tasks = toSignal(
    toObservable(this.userId).pipe(
      switchMap((userId) => (userId ? this.taskService.getByTechnician(userId) : of([]))),
    ),
    { initialValue: [] },
  );
  readonly stats = computed(() => this.profileService.buildStats(this.tasks(), this.timerState.totalTrackedSeconds()));

  constructor() {
    effect(() => {
      if (!this.viewReady() || !isPlatformBrowser(this.platformId)) {
        return;
      }

      this.renderChart();
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.chartRef) {
      return;
    }

    this.viewReady.set(true);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  mailtoLink(): string {
    return `mailto:${this.profile()?.email ?? ''}`;
  }

  private renderChart(): void {
    const canvas = this.chartRef?.nativeElement;
    if (!canvas) {
      return;
    }

    const data = this.stats().weeklyPerformance;
    this.chart?.destroy();
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: data.map((point) => point.label),
        datasets: [
          {
            data: data.map((point) => point.value),
            borderColor: '#2E7D32',
            backgroundColor: 'rgba(46, 125, 50, 0.12)',
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
            grid: { color: 'rgba(46, 125, 50, 0.08)' },
          },
        },
      },
    });
  }
}
