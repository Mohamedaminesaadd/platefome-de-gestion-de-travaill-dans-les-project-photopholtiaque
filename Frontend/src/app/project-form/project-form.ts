import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule }    from '@angular/material/button';
import { MatIconModule }      from '@angular/material/icon';
import {  Project, ProjectStatus } from '../dashboard/list-project/list-project'; // ←

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './project-form.html',
  styleUrls: ['./project-form.css']
})
export class ProjectForm {

  form: FormGroup;
  isEditMode: boolean;

  statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DELAYED',     label: 'Delayed'     },
    { value: 'COMPLETED',   label: 'Completed'   },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectForm>,
    @Inject(MAT_DIALOG_DATA) public data: Project | null
  ) {
    this.isEditMode = !!data;

    this.form = this.fb.group({
      name:          [data?.name          ?? '', [Validators.required, Validators.minLength(3)]],
      client:        [data?.client        ?? '', [Validators.required]],
      status:        [data?.status        ?? 'IN_PROGRESS', [Validators.required]],
      progress:      [data?.progress      ?? 0,  [Validators.required, Validators.min(0), Validators.max(100)]],
      daysRemaining: [data?.daysRemaining ?? null, [Validators.min(0)]],
      daysOverdue:   [data?.daysOverdue   ?? null, [Validators.min(0)]],
      dueToday:      [data?.dueToday      ?? false],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  getError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl?.touched || !ctrl.errors) return '';
    if (ctrl.errors['required'])  return 'Ce champ est obligatoire';
    if (ctrl.errors['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} caractères`;
    if (ctrl.errors['min'])       return `Valeur minimum : ${ctrl.errors['min'].min}`;
    if (ctrl.errors['max'])       return 'Valeur maximum : 100';
    return '';
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}