// ── stats-row.component.ts ───────────────────────────────────────────────────

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

import { Tache } from '../../core/models/tache.model';
import { Project } from '../../core/models/project.model';
import { Phase } from '../../core/models/phase.model';  
import { get } from 'http';

@Component({
  selector: 'app-stats-row',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule],
  templateUrl: './stats-row.html',
  styleUrl: './stats-row.css',
})


export class StatsRow{
//service de donnes pour qui returen kes taches et les projets et les phases dans chaque service project/tache/phase
  tasks: Tache[] = [
    { _id:'t1', titre:'Site survey: Sector 4', heureEstimees:2, heureRelles:0, statut:'A FAIRE', priorite:'HAUTE', idPhase:'p1', dateEcheance:'2025-04-05' },
    { _id:'t2', titre:'Inverter inspection', heureEstimees:1.5, heureRelles:1.2, statut:'EN COURS', priorite:'MOYENNE', idPhase:'p1', dateEcheance:'2025-04-10' },
    { _id:'t3', titre:'Permit review meeting', heureEstimees:1, heureRelles:1.1, statut:'TERMINEE', priorite:'BASSE', idPhase:'p1', dateEcheance:'2025-04-08' },
    { _id:'t4', titre:'Team safety briefing', heureEstimees:0.5, heureRelles:0, statut:'A FAIRE', priorite:'CRITIQUE', idPhase:'p1', dateEcheance:'2025-04-07' },
    { _id:'t5', titre:'Cable routing plan', heureEstimees:3, heureRelles:3.5, statut:'TERMINEE', priorite:'HAUTE', idPhase:'p2', dateEcheance:'2025-04-06' },
    { _id:'t6', titre:'Stakeholder report', heureEstimees:2, heureRelles:0.8, statut:'EN COURS', priorite:'MOYENNE', idPhase:'p2', dateEcheance:'2025-04-09' },
  ];

  phases: Phase[] = [
    { _id:'ph1', nom:'Étude & conception', description:'Avant-projet', order:1, dateDebutPrevue:'2025-02-01', dateFinPrevue:'2025-03-15', dureeEstimee:42, avancement:100, statut:'TERMINE', idProject:'proj1' },
    { _id:'ph2', nom:'Génie civil', description:'Infrastructure', order:2, dateDebutPrevue:'2025-03-16', dateFinPrevue:'2025-05-10', dureeEstimee:55, avancement:65, statut:'EN COURS', idProject:'proj1' },
    { _id:'ph3', nom:'Installation électrique', description:'Câblage', order:3, dateDebutPrevue:'2025-05-11', dateFinPrevue:'2025-06-30', dureeEstimee:50, avancement:10, statut:'EN COURS', idProject:'proj1' },
  ];

  projects: Project[] = [
    { codeProject:'P001', nom:'Solar Farm Alpha', dateDebut:'2025-01-10', dateFinPrevue:'2025-06-30', budgetTotale:850000, budgetConsomme:412000, priorite:'HAUTE', statut:'EN COURS' },
    { codeProject:'P002', nom:'Grid Upgrade β', dateDebut:'2025-02-01', dateFinPrevue:'2025-08-15', budgetTotale:1200000, budgetConsomme:380000, priorite:'CRITIQUE', statut:'EN COURS' },
    { codeProject:'P003', nom:'Wind Turbine Site', dateDebut:'2025-03-01', dateFinPrevue:'2025-09-01', budgetTotale:670000, budgetConsomme:95000, priorite:'MOYENNE', statut:'EN COURS' },
    { codeProject:'P004', nom:'Battery Storage', dateDebut:'2025-03-15', dateFinPrevue:'2025-10-01', budgetTotale:430000, budgetConsomme:62000, priorite:'HAUTE', statut:'EN COURS' },
    { codeProject:'P005', nom:'Substation Renovation', dateDebut:'2024-10-01', dateFinPrevue:'2025-02-28', dateFinReelle:'2025-03-05', budgetTotale:320000, budgetConsomme:335000, priorite:'BASSE', statut:'TERMINE' },
    { codeProject:'P006', nom:'EV Charging Network', dateDebut:'2025-05-01', dateFinPrevue:'2025-12-31', budgetTotale:560000, budgetConsomme:0, priorite:'MOYENNE', statut:'PLANIFIE' },
  ];

  // ── KPI 1 : Projets actifs ───────────────────────────────────────────────
  get activeProjectsCount(): number {
    return this.projects.filter(p => p.statut === 'EN COURS').length;
  }
  get plannedProjectsCount(): number {
    return this.projects.filter(p => p.statut === 'PLANIFIE').length;
  }
  get criticalProjectsCount(): number {
    return this.projects.filter(p => p.priorite === 'CRITIQUE' && p.statut === 'EN COURS').length;
  }

  // ── KPI 2 : Taux de complétion tâches ────────────────────────────────────
  get completedCount(): number {
    return this.tasks.filter(t => t.statut === 'TERMINEE').length;
  }
  get totalTasks(): number {
    return this.tasks.length;
  }
  get completionRate(): number {
    if (!this.tasks.length) return 0;
    return Math.round((this.completedCount / this.tasks.length) * 100);
  }
  get completionTrend(): number {
    return Math.abs(this.completionRate - 46); // vs semaine passée (mock)
  }

  // ── KPI 3 : Tâches en retard ─────────────────────────────────────────────
  get overdueCount(): number {
    const now = new Date();
    return this.tasks.filter(
      t => t.statut !== 'TERMINEE' && !!t.dateEcheance && new Date(t.dateEcheance) < now
    ).length;
  }
  get highPriorityCount(): number {
    return this.tasks.filter(t => t.priorite === 'HAUTE' || t.priorite === 'CRITIQUE').length;
  }

  // ── KPI 4 : Avancement phases ────────────────────────────────────────────
  get avgPhaseAvancement(): number {
    if (!this.phases.length) return 0;
    return Math.round(this.phases.reduce((a, p) => a + (p.avancement ?? 0), 0) / this.phases.length);
  }
  get completedPhasesCount(): number {
    return this.phases.filter(p => p.statut === 'TERMINE').length;
  }
  get totalPhasesCount(): number {
    return this.phases.length;
  }
  get activePhasesCount(): number {
    return this.phases.filter(p => p.statut === 'EN COURS').length;
  }

  // ── KPI 5 : Budget consommé ──────────────────────────────────────────────
  get totalBudget(): number {
    return this.projects.reduce((a, p) => a + p.budgetTotale, 0);
  }
  get totalBudgetConsomme(): number {
    return this.projects.reduce((a, p) => a + (p.budgetConsomme ?? 0), 0);
  }
  get budgetConsommePct(): number {
    if (!this.totalBudget) return 0;
    return Math.round((this.totalBudgetConsomme / this.totalBudget) * 100);
  }
  get budgetAlert(): boolean {
    return this.budgetConsommePct > 80;
  }

  // ── KPI 6 : Charge horaire ───────────────────────────────────────────────
  get totalHeuresEstimees(): number {
    return this.tasks.reduce((a, t) => a + t.heureEstimees, 0);
  }
  get totalHeuresReelles(): number {
    return this.tasks.reduce((a, t) => a + (t.heureRelles ?? 0), 0);
  }
  get chargeRatio(): number {
    if (!this.totalHeuresEstimees) return 0;
    return Math.round((this.totalHeuresReelles / this.totalHeuresEstimees) * 100);
  }
  get chargeAlert(): boolean {
    return this.chargeRatio > 100;
  }

  // ── KPI 7 : Phases ───────────────────────────────────────────────────────
  get blockedPhasesCount(): number {
    return this.phases.filter(p => p.statut === 'BLOQUE').length;
  }

  // ── KPI 8 : Vélocité équipe ──────────────────────────────────────────────
  get velociteEquipe(): number {
    const inProgress = this.tasks.filter(t => t.statut === 'EN COURS').length;
    const base = Math.max(1, inProgress + this.completedCount);
    return Math.round((this.completedCount / base) * 10) / 10;
  }
  get inProgressCount(): number {
    return this.tasks.filter(t => t.statut === 'EN COURS').length;
  }

  // ── Utilitaire : formatage monétaire ─────────────────────────────────────
  formatBudget(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  get today(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  toggleStatus(task: Tache): void {
    task.statut = task.statut === 'TERMINEE' ? 'A FAIRE' : 'TERMINEE';
  }
}