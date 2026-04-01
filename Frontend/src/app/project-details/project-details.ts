import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {  Project } from '../dashboard/list-project/list-project'; // ← adapte le chemin

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
  constructor(
    public dialogRef: MatDialogRef<ProjectDetail>,
    @Inject(MAT_DIALOG_DATA) public data: Project   // reçoit le projet cliqué
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      IN_PROGRESS: 'In Progress',
      DELAYED: 'Delayed',
      COMPLETED: 'Completed',
    };
    return map[status] ?? status;
  }
}