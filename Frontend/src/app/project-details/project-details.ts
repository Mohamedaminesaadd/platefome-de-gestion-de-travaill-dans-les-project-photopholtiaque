import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Project, StatutProject, Priorite } from '../core/models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.css']
})
export class ProjectDetail {
dismissed: any;

  constructor(
    public dialogRef: MatDialogRef<ProjectDetail>,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  // ── STATUS ────────────────────────────────────────────────────
  statusLabel(status: string): string {
    const map: Record<string, string> = {
      'PLANIFIE':  'Planifié',
      'EN COURS':  'En cours',
      'EN RETARD': 'En retard',
      'SUSPENDU':  'Suspendu',
      'TERMINE':   'Terminé',
      'ANNULE':    'Annulé',
    };
    return map[status] ?? status;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'PLANIFIE':  'badge-planned',
      'EN COURS':  'badge-inprogress',
      'EN RETARD': 'badge-delayed',
      'SUSPENDU':  'badge-suspended',
      'TERMINE':   'badge-completed',
      'ANNULE':    'badge-cancelled',
    };
    return map[status] ?? '';
  }

  // ── PRIORITÉ ──────────────────────────────────────────────────
  prioriteLabel(priorite: string): string {
    const map: Record<string, string> = {
      'BASSE':    'Basse',
      'MOYENNE':  'Moyenne',
      'HAUTE':    'Haute',
      'CRITIQUE': 'Critique',
    };
    return map[priorite] ?? priorite;
  }

  prioriteClass(priorite: string): string {
    const map: Record<string, string> = {
      'BASSE':    'priority-low',
      'MOYENNE':  'priority-medium',
      'HAUTE':    'priority-high',
      'CRITIQUE': 'priority-critical',
    };
    return map[priorite] ?? '';
  }

  // ── BUDGET ────────────────────────────────────────────────────
  budgetPct(): number {
    if (!this.data.budgetTotale || this.data.budgetTotale === 0) return 0;
    const pct = ((this.data.budgetConsomme ?? 0) / this.data.budgetTotale) * 100;
    return Math.min(Math.round(pct), 100);
  }

  budgetProgressColor(): string {
    const pct = this.budgetPct();
    if (pct >= 90) return 'warn';    // rouge
    if (pct >= 70) return 'accent';  // orange
    return 'primary';                // bleu
  }
}