import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export interface RadarSeries {
  label: string;
  data: number[];
  color: string;
  fill: string;
}

@Component({
  selector: 'app-radar-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './radar-dashboard.html',
  styleUrls: ['./radar-dashboard.css'],
})
export class RadarDashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('radarCanvas') radarCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;

  labels = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running', 'Testing'];

  series: RadarSeries[] = [
    {
      label: 'Series A',
      data: [65, 59, 80, 81, 56, 55, 40, 90],
      color: '#F4738A',
      fill: 'rgba(244, 115, 138, 0.35)',
    },
    {
      label: 'Series B',
      data: [28, 48, 40, 19, 96, 27, 100],
      color: '#F5C842',
      fill: 'rgba(245, 200, 66, 0.30)',
    },
  ];

  activeSeriesIndex: number | null = null;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.buildChart();
  }

  buildChart(): void {
    const ctx = this.radarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.labels,
        datasets: this.series.map((s) => ({
          label: s.label,
          data: s.data,
          borderColor: s.color,
          backgroundColor: s.fill,
          pointBackgroundColor: s.color,
          pointBorderColor: '#ffffff',
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: s.color,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          fill: true,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 10,
              color: '#94a3b8',
              backdropColor: 'transparent',
              font: { family: "'DM Sans', sans-serif", size: 10 },
            },
            grid: { color: 'rgba(255,255,255,0.08)' },
            angleLines: { color: 'rgba(255,255,255,0.08)' },
            pointLabels: {
              color: '#cbd5e1',
              font: { family: "'DM Sans', sans-serif", size: 12, weight: 500 },
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,20,40,0.92)',
            titleColor: '#ffffff',
            bodyColor: '#a0aec0',
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              title: (items) => items[0].label,
              label: (item) => `  ${item.dataset.label}: ${item.parsed.r}`,
            },
          },
        },
      },
    });
  }

  toggleSeries(index: number): void {
    if (!this.chart) return;
    const meta = this.chart.getDatasetMeta(index);
    meta.hidden = !meta.hidden;
    this.chart.update();
  }

  isSeriesVisible(index: number): boolean {
    if (!this.chart) return true;
    return !this.chart.getDatasetMeta(index).hidden;
  }

  avg(data: number[]): number {
    return Math.round(data.reduce((a, b) => a + b, 0) / data.length);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}