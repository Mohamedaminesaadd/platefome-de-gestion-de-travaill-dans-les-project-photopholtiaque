import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule }        from '@angular/material/card';
import { MatButtonModule }      from '@angular/material/button';
import { MatIconModule }        from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule }      from '@angular/material/core';
import { MatTooltipModule }     from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';


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
    MatIconModule,   // ✅ ADD
    MatButtonModule  // ✅ (recommended)
  ],
  templateUrl: './list-project.html',
  styleUrls: ['./list-project.css']
})
export class ListProject {
  @Input() projects: Project[] = [];
  @Output() newProjectClick = new EventEmitter<void>();
  @Output() projectClick = new EventEmitter<Project>();

  // ── DATA ─────────────────────────────────────────────────────
    project: Project[] = [
      { id:'p1', name:'West Side Solar Farm',  client:'Green Energy Co',  status:'IN_PROGRESS', progress:75, daysRemaining:12 },
      { id:'p2', name:'Residential Cluster A', client:'Horizon Homes',    status:'DELAYED',     progress:40, daysOverdue:3   },
      { id:'p3', name:'Downtown Tech Park',    client:'Urban Solutions',  status:'COMPLETED',   progress:100, dueToday:true  },
      { id:'p4', name:'Mountain Ridge Array',  client:'Peak Power',       status:'IN_PROGRESS', progress:15, daysRemaining:45 },
      { id:'p4', name:'sidi abdlah',  client:'amine sadda',       status:'IN_PROGRESS', progress:70, daysRemaining:45 },
    ]

  

  statusLabel(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'DELAYED':
        return 'Delayed';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  }

  onNewProject(): void {
    this.newProjectClick.emit();
  }

  onOpenProject(project: Project): void {
    this.projectClick.emit(project);
  }

  trackById(index: number, project: Project): string {
    return project.id;
  }
}