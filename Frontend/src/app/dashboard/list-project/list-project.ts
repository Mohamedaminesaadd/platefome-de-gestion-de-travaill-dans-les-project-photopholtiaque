// ── src/app/projects/list-project/list-project.ts ────────────────────────────
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProjectDetail } from '../../project-details/project-details';
import { ProjectForm } from '../../project-form/project-form';
import { ProjectService } from '../../services/service-project';
import { Project } from '../../core/models/project.model';
import { AddPhasesDialogComponent, AddPhasesDialogData } from '../add-phases-dialog/add-phases-dialog';

@Component({
  selector: 'app-list-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './list-project.html',
  styleUrls: ['./list-project.css']
})
export class ListProject implements OnInit {

  searchTerm = '';
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading = true;
  errorMsg = '';

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.projectService.getAll().subscribe({
      next: (data: Project[]) => {
        this.projects = [...data];
        this.filteredProjects = [...data];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Impossible de charger les projets.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProjects = this.projects.filter(p =>
      p.nom?.toLowerCase().includes(term) ||
      p.codeProject?.toLowerCase().includes(term) ||
      p.ville?.toLowerCase().includes(term)
    );
  }

  onOpenProject(project: Project): void {
    this.dialog.open(ProjectDetail, {
      data: project,
      width: '520px',
      panelClass: 'detail-panel'
    });
  }

  onNewProject(): void {
    this.dialog.open(ProjectForm, {
      data: null,
      width: '520px',
      panelClass: 'detail-panel'
    }).afterClosed().subscribe((result: Partial<Project> | null) => {
      if (!result) return;
      this.projectService.create(result).subscribe({
        next: (created) => {
          this.projects = [created, ...this.projects];
          this.applyFilter();
        },
        error: (err) => console.error(err)
      });
    });
  }

  onEditProject(project: Project): void {
    this.dialog.open(ProjectForm, {
      data: project,
      width: '520px',
      panelClass: 'detail-panel'
    }).afterClosed().subscribe((result: Partial<Project> | null) => {
      if (!result) return;
      this.projectService.update(project._id!, result).subscribe({
        next: (updated) => {
          const i = this.projects.findIndex(p => p._id === project._id);
          if (i !== -1) {
            this.projects[i] = updated;
            this.projects = [...this.projects];
            this.applyFilter();
          }
        },
        error: (err) => console.error(err)
      });
    });
  }

  onDeleteProject(project: Project): void {
    if (!confirm(`Supprimer "${project.nom}" ?`)) return;
    this.projectService.delete(project._id!).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p._id !== project._id);
        this.applyFilter();
      },
      error: (err) => console.error(err)
    });
  }

  // ── FIX : project passé en paramètre ─────────────────────────────────────
  openAddPhases(project: Project): void {
    const ref = this.dialog.open(AddPhasesDialogComponent, {
      data: {
        projectId:  project._id,   // ← project, pas this.data
        projectNom: project.nom,
      } as AddPhasesDialogData,
      panelClass: 'apd-overlay',
      maxWidth: '120vw',
    });

    ref.afterClosed().subscribe(result => {
      if (result?.success) {
        console.log(`${result.count} phase(s) créées avec succès`);
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      PLANIFIE: 'Planifié', 'EN COURS': 'En cours',
      'EN RETARD': 'En retard', SUSPENDU: 'Suspendu',
      TERMINE: 'Terminé', ANNULE: 'Annulé'
    };
    return map[status] ?? status;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PLANIFIE: 'badge-planned', 'EN COURS': 'badge-inprogress',
      'EN RETARD': 'badge-delayed', SUSPENDU: 'badge-suspended',
      TERMINE: 'badge-completed', ANNULE: 'badge-cancelled'
    };
    return map[status] ?? '';
  }

  priorityClass(priority: string): string {
    const map: Record<string, string> = {
      BASSE: 'priority-low', MOYENNE: 'priority-medium',
      HAUTE: 'priority-high', CRITIQUE: 'priority-critical'
    };
    return map[priority] ?? '';
  }

  trackById(index: number, project: Project): string {
    return project._id ?? index.toString();
  }

  budgetPct(project: Project): number {
    if (!project.budgetTotale) return 0;
    const pct = ((project.budgetConsomme ?? 0) / project.budgetTotale) * 100;
    return Math.min(Math.round(pct), 100);
  }
}