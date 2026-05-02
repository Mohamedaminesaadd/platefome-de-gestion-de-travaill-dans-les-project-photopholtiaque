// stats-row.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { forkJoin } from 'rxjs';

import { Tache } from '../../core/models/tache.model';
import { Project } from '../../core/models/project.model';
import { Phase } from '../../core/models/phase.model';
import { TacheService } from '../../services/tache-service';
import { ProjectService } from '../../services/service-project';
import { PhaseService } from '../../services/phase-service';

@Component({
  selector: 'app-stats-row',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule],
  templateUrl: './stats-row.html',
  styleUrl: './stats-row.css',
})
export class StatsRow implements OnInit {

  tasks   : Tache[]   = [];
  phases  : Phase[]   = [];
  projects: Project[] = [];

  isLoading = true;
  hasError  = false;

  constructor(
    private tacheService  : TacheService,
    private projectService: ProjectService,
    private phaseService  : PhaseService,
  ) {}

  ngOnInit(): void {
    forkJoin({
      tasks   : this.tacheService.getAll(),
      projects: this.projectService.getAll(),
      phases  : this.phaseService.getAll(),
    }).subscribe({
      next: ({ tasks, projects, phases }) => {
        this.tasks    = tasks;
        this.projects = projects;
        this.phases   = phases;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('StatsRow load error:', err);
        this.hasError  = true;
        this.isLoading = false;
      },
    });
  }

  // ── KPI 1 : Projets actifs ───────────────────────────────────────────────
  get activeProjectsCount()  { return this.projects.filter(p => p.statut === 'EN COURS').length; }
  get plannedProjectsCount() { return this.projects.filter(p => p.statut === 'PLANIFIE').length; }
  get criticalProjectsCount(){ return this.projects.filter(p => p.priorite === 'CRITIQUE' && p.statut === 'EN COURS').length; }

  // ── KPI 2 : Taux de complétion tâches ────────────────────────────────────
  get completedCount() { return this.tasks.filter(t => t.statut === 'TERMINEE').length; }
  get totalTasks()     { return this.tasks.length; }
  get completionRate() {
    if (!this.tasks.length) return 0;
    return Math.round((this.completedCount / this.tasks.length) * 100);
  }
  get completionTrend() { return Math.abs(this.completionRate - 46); }

  // ── KPI 3 : Tâches en retard ─────────────────────────────────────────────
  get overdueCount() {
    const now = new Date();
    return this.tasks.filter(
      t => t.statut !== 'TERMINEE' && !!t.dateEcheance && new Date(t.dateEcheance) < now
    ).length;
  }
  get highPriorityCount() {
    return this.tasks.filter(t => t.priorite === 'HAUTE' || t.priorite === 'CRITIQUE').length;
  }

  // ── KPI 4 : Avancement phases ────────────────────────────────────────────
  get avgPhaseAvancement() {
    if (!this.phases.length) return 0;
    return Math.round(this.phases.reduce((a, p) => a + (p.avancement ?? 0), 0) / this.phases.length);
  }
  get completedPhasesCount() { return this.phases.filter(p => p.statut === 'TERMINE').length; }
  get totalPhasesCount()     { return this.phases.length; }
  get activePhasesCount()    { return this.phases.filter(p => p.statut === 'EN COURS').length; }
  get blockedPhasesCount()   { return this.phases.filter(p => p.statut === 'BLOQUE').length; }

  // ── KPI 5 : Budget consommé ──────────────────────────────────────────────
  get totalBudget()         { return this.projects.reduce((a, p) => a + p.budgetTotale, 0); }
  get totalBudgetConsomme() { return this.projects.reduce((a, p) => a + (p.budgetConsomme ?? 0), 0); }
  get budgetConsommePct() {
    if (!this.totalBudget) return 0;
    return Math.round((this.totalBudgetConsomme / this.totalBudget) * 100);
  }
  get budgetAlert() { return this.budgetConsommePct > 80; }

  // ── KPI 6 : Charge horaire ───────────────────────────────────────────────
  get totalHeuresEstimees() { return this.tasks.reduce((a, t) => a + t.heureEstimees, 0); }
  get totalHeuresReelles()  { return this.tasks.reduce((a, t) => a + (t.heureRelles ?? 0), 0); }
  get chargeRatio() {
    if (!this.totalHeuresEstimees) return 0;
    return Math.round((this.totalHeuresReelles / this.totalHeuresEstimees) * 100);
  }
  get chargeAlert() { return this.chargeRatio > 100; }

  // ── KPI 7 & 8 ────────────────────────────────────────────────────────────
  get inProgressCount()  { return this.tasks.filter(t => t.statut === 'EN COURS').length; }
  get velociteEquipe() {
    const base = Math.max(1, this.inProgressCount + this.completedCount);
    return Math.round((this.completedCount / base) * 10) / 10;
  }

  // ── Utilitaires ──────────────────────────────────────────────────────────
  formatBudget(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
    }).format(value);
  }

  get today(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }
}