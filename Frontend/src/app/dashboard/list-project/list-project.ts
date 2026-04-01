import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectDetail } from '../../project-details/project-details';
import { ProjectForm } from '../../project-form/project-form';


export type ProjectStatus = 'IN_PROGRESS' | 'DELAYED' | 'COMPLETED';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  daysRemaining?: number;
  daysOverdue?: number;
  dueToday?: boolean;
}

@Component({
  selector: 'app-list-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,        // ✅ pour [(ngModel)]
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './list-project.html',
  styleUrls: ['./list-project.css']
})
export class ListProject {

  constructor(private dialog: MatDialog) {}

  searchTerm = '';

  projects: Project[] = [
    { id:'p1', name:'West Side Solar Farm',  client:'Green Energy Co', status:'IN_PROGRESS', progress:75,  daysRemaining:12 },
    { id:'p2', name:'Residential Cluster A', client:'Horizon Homes',   status:'DELAYED',     progress:40,  daysOverdue:3    },
    { id:'p3', name:'Downtown Tech Park',    client:'Urban Solutions', status:'COMPLETED',   progress:100, dueToday:true    },
    { id:'p4', name:'Mountain Ridge Array',  client:'Peak Power',      status:'IN_PROGRESS', progress:15,  daysRemaining:45 },
    { id:'p5', name:'Sidi Abdallah',         client:'Amine Sadda',     status:'IN_PROGRESS', progress:70,  daysRemaining:20 },
  ];

  filteredProjects: Project[] = [...this.projects];

  // ── FILTRE ────────────────────────────────────────────────────
  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProjects = this.projects.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.client.toLowerCase().includes(term)
    );
  }

  // ── VOIR DÉTAILS (Dialog) ─────────────────────────────────────
  onOpenProject(project: Project): void {
    this.dialog.open(ProjectDetail, {
      data: project,
      width: '480px',
      panelClass: 'detail-panel'
    });
  }

  onEditProject(project: Project): void {
  this.dialog.open(ProjectForm, {
    data: project,
    width: '520px',
    panelClass: 'detail-panel'
  }).afterClosed().subscribe((result: Partial<Project> | null) => {
    if (result) {
      const i = this.projects.findIndex(p => p.id === project.id);
      if (i !== -1) {
        this.projects[i] = { ...this.projects[i], ...result };
        this.applyFilter();
      }
    }
  });}

  // ── SUPPRIMER ─────────────────────────────────────────────────
  onDeleteProject(project: Project): void {
    this.projects = this.projects.filter(p => p.id !== project.id);
    this.applyFilter(); // ✅ met à jour filteredProjects aussi
  }

  // ── NOUVEAU ───────────────────────────────────────────────────
  onNewProject(): void {
  this.dialog.open(ProjectForm, {
    data: null,
    width: '520px',
    panelClass: 'detail-panel'
  }).afterClosed().subscribe((result: Project | null) => {
    if (result) {
      this.projects.push({ ...result, id: 'p' + Date.now() });
      this.applyFilter();
    }
  });
}

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      IN_PROGRESS: 'In Progress',
      DELAYED: 'Delayed',
      COMPLETED: 'Completed',
    };
    return map[status] ?? status;
  }

  trackById(index: number, project: Project): string {
    return project.id;
  }
}