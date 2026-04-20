import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService } from '../../services/service-project';
import { StatutProject } from '../../core/models/project.model';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

export interface StatutSlice {
  statut: StatutProject;
  label:  string;
  value:  number;
  color:  string;
  icon:   string;
}

@Component({
  selector: 'app-pie-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './pie-dashboard.html',
  styleUrls: ['./pie-dashboard.css'],
})
export class PieDashboard implements OnInit, AfterViewInit, OnDestroy {

  // ✅ static: false — résolu APRÈS les ngIf
  @ViewChild('pieCanvas', { static: false }) pieCanvas!: ElementRef<HTMLCanvasElement>;

  private destroy$   = new Subject<void>();
  private chartBuilt = false;
  private MIN_MS     = 900;

  chart:       Chart | null = null;
  activeIndex: number | null = null;

  totalValue          = 0;
  isLoading           = true;
  hasError            = false;
  budgetTotalValue    = 0;
  budgetConsumedValue = 0;

  slices: StatutSlice[] = [];

  private readonly statutConfig: Record<StatutProject, { label: string; color: string; icon: string }> = {
    'PLANIFIE':  { label: 'Planifié',  color: '#6C8EF5', icon: 'schedule'      },
    'EN COURS':  { label: 'En cours',  color: '#42C8F5', icon: 'autorenew'     },
    'EN RETARD': { label: 'En retard', color: '#F5C842', icon: 'warning_amber' },
    'SUSPENDU':  { label: 'Suspendu',  color: '#F56C8E', icon: 'pause_circle'  },
    'TERMINE':   { label: 'Terminé',   color: '#42F5A2', icon: 'check_circle'  },
    'ANNULE':    { label: 'Annulé',    color: '#94A3B8', icon: 'cancel'        },
  };

  // ✅ Injecte ChangeDetectorRef
  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  // ── KPIs ──────────────────────────────────────────────────
  get budgetPct(): number {
    return this.budgetTotalValue
      ? Math.round((this.budgetConsumedValue / this.budgetTotalValue) * 100)
      : 0;
  }

  get enRetard(): number { return this.slices.find(s => s.statut === 'EN RETARD')?.value ?? 0; }
  get termines(): number { return this.slices.find(s => s.statut === 'TERMINE')?.value  ?? 0; }
  get enCours():  number { return this.slices.find(s => s.statut === 'EN COURS')?.value  ?? 0; }

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {}

  // ── Load ──────────────────────────────────────────────────
  loadStats(): void {
    this.isLoading   = true;
    this.hasError    = false;
    this.chartBuilt  = false;

    const t0 = Date.now();
    console.log('🔄 [PieDashboard] loadStats() — requête envoyée...');

    this.projectService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          console.log('✅ stats reçues en', Date.now() - t0, 'ms');
          console.log('📦 stats brutes:', stats);
          console.log('📊 byStatus:', stats.byStatus);
          console.log('💰 budget:', stats.budget);

          this.totalValue          = stats.total;
          this.budgetTotalValue    = stats.budget.total;
          this.budgetConsumedValue = stats.budget.consumed;

          this.slices = (Object.keys(this.statutConfig) as StatutProject[])
            .filter(key => (stats.byStatus[key] ?? 0) > 0)
            .map(key => ({
              statut: key as StatutProject,
              label:  this.statutConfig[key as StatutProject].label,
              color:  this.statutConfig[key as StatutProject].color,
              icon:   this.statutConfig[key as StatutProject].icon,
              value:  stats.byStatus[key],
            }));

          console.log('🍕 slices:', this.slices);

          const remaining = Math.max(0, this.MIN_MS - (Date.now() - t0));
          console.log('⏳ délai skeleton restant:', remaining, 'ms');

          setTimeout(() => {
            this.isLoading = false;

            // ✅ Force Angular à mettre à jour le DOM (résout le *ngIf)
            this.cdr.detectChanges();

            console.log('👁️ isLoading → false, detectChanges() appelé');
            console.log('🖼️ pieCanvas après detectChanges:', this.pieCanvas);

            // ✅ Maintenant le canvas est dans le DOM
            this.buildChart();

          }, remaining);
        },
        error: (err) => {
          console.error('❌ erreur loadStats:', err);
          console.error('❌ status HTTP:', err.status);
          this.isLoading = false;
          this.hasError  = true;
          this.cdr.detectChanges();
        },
      });
  }

  refresh(): void {
    console.log('🔃 [PieDashboard] refresh()');
    this.chart?.destroy();
    this.chart      = null;
    this.chartBuilt = false;
    this.slices     = [];
    this.loadStats();
  }

  // ── Chart ─────────────────────────────────────────────────
  buildChart(): void {
    console.log('🔍 [buildChart] chartBuilt:', this.chartBuilt);
    console.log('🔍 [buildChart] slices.length:', this.slices.length);
    console.log('🔍 [buildChart] pieCanvas:', this.pieCanvas);

    if (this.chartBuilt || !this.slices.length) {
      console.warn('⚠️ [buildChart] annulé — chartBuilt ou slices vide');
      return;
    }
    if (!this.pieCanvas?.nativeElement) {
      console.warn('⚠️ [buildChart] annulé — canvas non disponible dans le DOM');
      return;
    }

    const ctx = this.pieCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.warn('⚠️ [buildChart] annulé — getContext(2d) null');
      return;
    }

    console.log('✅ [buildChart] création du chart doughnut...');
    this.chart?.destroy();

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.slices.map(s => s.label),
        datasets: [{
          data:                 this.slices.map(s => s.value),
          backgroundColor:      this.slices.map(s => s.color + 'cc'),
          hoverBackgroundColor: this.slices.map(s => s.color),
          borderColor:          '#080d1f',
          borderWidth:          3,
          hoverOffset:          14,
        }],
      },
      options: {
        cutout:              '65%',
        responsive:          true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
          duration:      800,
          onComplete: () => console.log('🎬 animation terminée'),
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(8,13,31,0.95)',
            titleColor:      '#f0f4ff',
            bodyColor:       '#6c8ef5',
            borderColor:     'rgba(108,142,245,0.2)',
            borderWidth:     1,
            padding:         12,
            cornerRadius:    10,
            titleFont:       { size: 13, weight: 'bold' },
            bodyFont:        { size: 12 },
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed as number;
                const pct = this.totalValue
                  ? ((val / this.totalValue) * 100).toFixed(1)
                  : '0.0';
                return `  ${val} projet(s)  —  ${pct}%`;
              },
            },
          },
        },
        onHover: (_, elements) => {
          this.activeIndex = elements.length ? elements[0].index : null;
        },
      },
    });

    this.chartBuilt = true;
    console.log('✅ [buildChart] chart créé avec succès');
  }

  // ── Helpers ───────────────────────────────────────────────
  getPercentage(value: number): number {
    return this.totalValue ? Math.round((value / this.totalValue) * 100) : 0;
  }

  highlightSlice(index: number): void {
    if (!this.chart) return;
    this.activeIndex = index;
    this.chart.tooltip?.setActiveElements([{ datasetIndex: 0, index }], { x: 0, y: 0 });
    this.chart.update('none');
  }

  resetHighlight(): void {
    if (!this.chart) return;
    this.activeIndex = null;
    this.chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
    this.chart.update('none');
  }

  // ── Destroy ───────────────────────────────────────────────
  ngOnDestroy(): void {
    console.log('🗑️ [PieDashboard] ngOnDestroy()');
    this.chart?.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}