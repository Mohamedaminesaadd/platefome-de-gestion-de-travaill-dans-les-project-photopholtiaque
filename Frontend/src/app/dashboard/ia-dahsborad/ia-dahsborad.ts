import { CommonModule } from '@angular/common';
import {
  AfterViewInit, ChangeDetectorRef, Component,
  ElementRef, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { Chart } from 'chart.js';
import { forkJoin } from 'rxjs';
import { MlPredictService, TaskPredictRequest } from '../../services/ml-predict.service';

// Tes vraies tâches avec leurs durées réelles
interface TaskEntry {
  label: string;
  request: TaskPredictRequest;
  actualHours: number; // durée réelle observée
}

@Component({
  selector: 'app-ia-dahsborad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ia-dahsborad.html',
  styleUrl: './ia-dahsborad.css',
})
export class IaDahsborad implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('durationChart') durationChartRef!: ElementRef<HTMLCanvasElement>;

  private durationChart!: Chart;

  predictedData: number[] = [];
  actualData: number[] = [];
  labels: string[] = [];
  isLoading = true;
  hasError = false;

  // Statistiques affichées en haut
  avgError = 0;
  accuracy = 0;
  totalTasks = 0;

  // Tes tâches à comparer — adapte selon ton vrai dataset
  private tasks: TaskEntry[] = [
    {
      label: 'Tâche #101',
      request: { heure_estimee: 3, complexite: 'MOYENNE', priorite: 'HAUTE', experience_technicien: 5, meteo: 'SOLEIL', saison: 'PRINTEMPS' },
      actualHours: 3.5
    },
    {
      label: 'Tâche #102',
      request: { heure_estimee: 5, complexite: 'ELEVEE', priorite: 'HAUTE', experience_technicien: 3, meteo: 'PLUIE', saison: 'ETE' },
      actualHours: 7.0
    },
    {
      label: 'Tâche #103',
      request: { heure_estimee: 2, complexite: 'BASSE', priorite: 'BASSE', experience_technicien: 8, meteo: 'NUAGEUX', saison: 'AUTOMNE' },
      actualHours: 1.5
    },
    {
      label: 'Tâche #104',
      request: { heure_estimee: 4, complexite: 'MOYENNE', priorite: 'MOYENNE', experience_technicien: 6, meteo: 'VENT_FORT', saison: 'HIVER' },
      actualHours: 4.5
    },
    {
      label: 'Tâche #105',
      request: { heure_estimee: 6, complexite: 'ELEVEE', priorite: 'HAUTE', experience_technicien: 2, meteo: 'SOLEIL', saison: 'ETE' },
      actualHours: 8.0
    },
    {
      label: 'Tâche #106',
      request: { heure_estimee: 3, complexite: 'MOYENNE', priorite: 'BASSE', experience_technicien: 7, meteo: 'SOLEIL', saison: 'PRINTEMPS' },
      actualHours: 2.5
    },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private mlService: MlPredictService
  ) {}

  ngOnInit(): void {
    this.loadPredictions();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.durationChart?.destroy();
  }

  private loadPredictions(): void {
    const requests = this.tasks.map(t => this.mlService.predict(t.request));

    forkJoin(requests).subscribe({
      next: (responses) => {
        this.labels = this.tasks.map(t => t.label);
        this.actualData = this.tasks.map(t => t.actualHours);
        this.predictedData = responses.map(r => r.prediction ?? r.valeurPredite ?? 0);

        // Calcul stats
        this.totalTasks = this.tasks.length;
        const errors = this.predictedData.map((p, i) => Math.abs(p - this.actualData[i]));
        this.avgError = Math.round((errors.reduce((a, b) => a + b, 0) / errors.length) * 10) / 10;
        const withinThreshold = errors.filter(e => e <= 1).length;
        this.accuracy = Math.round((withinThreshold / this.totalTasks) * 100);

        this.isLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.buildDurationChart(), 0);
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private buildDurationChart(): void {
    if (!this.durationChartRef) return;
    const ctx = this.durationChartRef.nativeElement.getContext('2d')!;

    this.durationChart?.destroy();

    this.durationChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Prédit',
            data: this.predictedData,
            borderColor: '#7C3AED',
            borderWidth: 2,
            pointBackgroundColor: '#7C3AED',
            pointRadius: 5,
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Réel',
            data: this.actualData,
            borderColor: '#F59E0B',
            borderWidth: 2,
            pointBackgroundColor: '#F59E0B',
            pointRadius: 5,
            tension: 0.3,
            fill: false,
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
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}h`
            }
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { font: { family: 'DM Sans', size: 11 }, color: '#94A3B8' },
          },
          y: {
            grid: { color: '#F1F5F9' },
            border: { display: false, dash: [3, 3] },
            ticks: {
              font: { family: 'DM Sans', size: 11 },
              color: '#94A3B8',
              callback: (v) => `${v}h`
            },
          },
        },
      },
    });
  }
}