import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-ia-dahsborad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ia-dahsborad.html',
  styleUrl: './ia-dahsborad.css',
})
export class IaDahsborad implements AfterViewInit, OnDestroy {
  @ViewChild('durationChart') durationChartRef!: ElementRef<HTMLCanvasElement>;

  private durationChart!: Chart;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Léger délai pour que le DOM soit prêt
    setTimeout(() => {
      this.buildDurationChart();
      this.cdr.markForCheck();
    }, 0);
  }

  ngOnDestroy(): void {
    this.durationChart?.destroy();
  }

  private buildDurationChart(): void {
    if (!this.durationChartRef) return;
    const ctx = this.durationChartRef.nativeElement.getContext('2d')!;

    const fillGradient = ctx.createLinearGradient(0, 0, 0, 220);
    fillGradient.addColorStop(0, 'rgba(16,185,129,.12)');
    fillGradient.addColorStop(1, 'rgba(16,185,129,.01)');

    this.durationChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'Predicted',
            data: [50, 48, 47, 46, 46, 45],
            borderColor: '#7C3AED',
            borderWidth: 2,
            pointBackgroundColor: '#7C3AED',
            pointRadius: 4,
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Actual',
            data: [52, 50, 51, 50, 47, null],
            borderColor: '#F59E0B',
            borderWidth: 2,
            pointBackgroundColor: '#F59E0B',
            pointRadius: 4,
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Optimized',
            data: [48, 46, 44, 43, 41, 39],
            borderColor: '#10B981',
            borderWidth: 2,
            pointBackgroundColor: '#10B981',
            pointRadius: 4,
            tension: 0.4,
            fill: {
              target: 'end',
              above: fillGradient,
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,.9)',
            titleFont: { family: 'DM Sans', size: 12 },
            bodyFont: { family: 'DM Sans', size: 11 },
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              font: { family: 'DM Sans', size: 11 },
              color: '#94A3B8',
            },
          },
          y: {
            min: 30,
            max: 60,
            grid: { color: '#F1F5F9' },
            border: { display: false, dash: [3, 3] },
            ticks: {
              font: { family: 'DM Sans', size: 11 },
              color: '#94A3B8',
              stepSize: 8,
            },
          },
        },
      },
    });
  }
}