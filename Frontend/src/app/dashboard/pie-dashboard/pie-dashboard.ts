import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, PieController);

export interface CountryData {
  country: string;
  value: number;
  color: string;
  flag: string;
}

@Component({
  selector: 'app-pie-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './pie-dashboard.html',
  styleUrls: ['./pie-dashboard.css'],
})
export class PieDashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;

  countryData: CountryData[] = [
    { country: 'USA',     value: 55, color: '#6C8EF5', flag: '🇺🇸' },
    { country: 'Germany', value: 15, color: '#F5C842', flag: '🇩🇪' },
    { country: 'France',  value: 13, color: '#42C8F5', flag: '🇫🇷' },
    { country: 'Canada',  value: 10, color: '#F56C8E', flag: '🇨🇦' },
    { country: 'Russia',  value: 7,  color: '#42F5A2', flag: '🇷🇺' },
  ];

  activeIndex: number | null = null;
  totalValue = 0;

  ngOnInit(): void {
    this.totalValue = this.countryData.reduce((sum, d) => sum + d.value, 0);
  }

  ngAfterViewInit(): void {
    this.buildChart();
  }

  buildChart(): void {
    const ctx = this.pieCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.countryData.map(d => d.country),
        datasets: [
          {
            data: this.countryData.map(d => d.value),
            backgroundColor: this.countryData.map(d => d.color),
            hoverBackgroundColor: this.countryData.map(d => d.color),
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverOffset: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,20,40,0.92)',
            titleColor: '#ffffff',
            bodyColor: '#a0aec0',
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed as number;
                const pct = ((val / this.totalValue) * 100).toFixed(1);
                return `  ${val} units  (${pct}%)`;
              },
            },
          },
        },
        onHover: (_, elements) => {
          this.activeIndex = elements.length ? elements[0].index : null;
        },
      },
    });
  }

  getPercentage(value: number): number {
    return Math.round((value / this.totalValue) * 100);
  }

  highlightSlice(index: number): void {
    if (!this.chart) return;
    this.activeIndex = index;
    this.chart.setDatasetVisibility(0, true);
    // Trigger tooltip
    this.chart.tooltip?.setActiveElements(
      [{ datasetIndex: 0, index }],
      { x: 0, y: 0 }
    );
    this.chart.update();
  }

  resetHighlight(): void {
    if (!this.chart) return;
    this.activeIndex = null;
    this.chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
    this.chart.update();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}