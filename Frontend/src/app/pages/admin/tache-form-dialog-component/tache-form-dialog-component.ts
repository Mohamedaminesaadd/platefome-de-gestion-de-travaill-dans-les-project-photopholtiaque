import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule }             from '@angular/material/icon';
import { MatRippleModule }           from '@angular/material/core';
import { MatSelectModule }           from '@angular/material/select';
import { MatFormFieldModule }        from '@angular/material/form-field';
import { MatInputModule }            from '@angular/material/input';
import { MatButtonModule }           from '@angular/material/button';

import { Tache, StatutTache, PrioriteTache, Complexite } from '../../../core/models/tache.model';

// ✅ Import depuis technician-list qui a la bonne interface
import { Technician } from '../../../services/technicien';

export interface DialogData {
  task:          Tache | null;
  defaultStatut: StatutTache;
  techniciens:   Technician[];
}

@Component({
  selector: 'app-tache-form-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatIconModule, MatRippleModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatButtonModule,
  ],
  templateUrl: './tache-form-dialog-component.html',
  styleUrls:   ['./tache-form-dialog-component.css'],
})
export class TacheFormDialogComponent implements OnInit {

  isEdit = false;

  form: Partial<Tache> = {
    titre:         '',
    description:   '',
    statut:        'A FAIRE',
    priorite:      'MOYENNE',
    complexite:    'MOYENNE',
    heureEstimees: 0,
    dateEcheance:  '',
    idPhase:       'ph-1',
    idProject:     'proj-1',
  };

  selectedTech?: Technician;

  readonly statuts:     StatutTache[]   = ['A FAIRE', 'EN COURS', 'TERMINEE'];
  readonly priorites:   PrioriteTache[] = ['BASSE', 'MOYENNE', 'HAUTE', 'CRITIQUE'];
  readonly complexites: Complexite[]    = ['BASSE', 'MOYENNE', 'ELEVEE'];

  constructor(
    public dialogRef: MatDialogRef<TacheFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
    if (this.data.task) {
      this.isEdit = true;
      this.form   = { ...this.data.task };
      this.selectedTech = this.data.techniciens.find(
        t => t._id === this.data.task?.idUtilisateur
      );
    } else {
      this.form.statut = this.data.defaultStatut ?? 'A FAIRE';
    }
  }

  onTechChange(): void {
    if (this.selectedTech) {
      this.form.idUtilisateur = this.selectedTech._id;
      this.form.assigneNom    = this.selectedTech.username;
      this.form.assigneEmail  = this.selectedTech.email;
    } else {
      this.form.idUtilisateur = undefined;
      this.form.assigneNom    = undefined;
      this.form.assigneEmail  = undefined;
    }
  }

  isValid(): boolean {
    return !!(this.form.titre?.trim() && this.form.priorite && this.form.statut);
  }

  submit(): void {
    if (!this.isValid()) return;
    this.dialogRef.close({
      action: this.isEdit ? 'save' : 'create',
      task:   this.form,
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  prioriteColor(p: PrioriteTache): string {
    return { CRITIQUE: '#EF4444', HAUTE: '#F59E0B', MOYENNE: '#2563EB', BASSE: '#94A3B8' }[p] ?? '';
  }
}