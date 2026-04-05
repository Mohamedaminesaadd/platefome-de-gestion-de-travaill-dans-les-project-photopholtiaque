import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';
import { Project, StatutProject, Priorite } from '../core/models/project.model';

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

  statutOptions: { value: StatutProject; label: string }[] = [
    { value: 'PLANIFIE',  label: 'Planifié'  },
    { value: 'EN COURS',  label: 'En cours'  },
    { value: 'EN RETARD', label: 'En retard' },
    { value: 'SUSPENDU',  label: 'Suspendu'  },
    { value: 'TERMINE',   label: 'Terminé'   },
    { value: 'ANNULE',    label: 'Annulé'    },
  ];

  prioriteOptions: { value: Priorite; label: string }[] = [
    { value: 'BASSE',    label: 'Basse'    },
    { value: 'MOYENNE',  label: 'Moyenne'  },
    { value: 'HAUTE',    label: 'Haute'    },
    { value: 'CRITIQUE', label: 'Critique' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectForm>,
    @Inject(MAT_DIALOG_DATA) public data: Project | null
  ) {
    this.isEditMode = !!data;

    this.form = this.fb.group({
      codeProject:   [data?.codeProject   ?? '', [Validators.required]],
      nom:           [data?.nom           ?? '', [Validators.required, Validators.minLength(3)]],
      description:   [data?.description   ?? ''],
      dateDebut:     [data?.dateDebut     ?? '', [Validators.required]],
      dateFinPrevue: [data?.dateFinPrevue ?? '', [Validators.required]],
      dateFinReelle: [data?.dateFinReelle ?? ''],
      budgetTotale:  [data?.budgetTotale  ?? 0,  [Validators.required, Validators.min(0)]],
      budgetConsomme:[data?.budgetConsomme ?? 0,  [Validators.min(0)]],
      priorite:      [data?.priorite      ?? 'MOYENNE', [Validators.required]],
      statut:        [data?.statut        ?? 'PLANIFIE', [Validators.required]],
      adresse:       [data?.adresse       ?? ''],
      ville:         [data?.ville         ?? ''],
      codePostal:    [data?.codePostal    ?? ''],
      coordonnesGPS: [data?.coordonnesGPS ?? ''],
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
    return '';
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}