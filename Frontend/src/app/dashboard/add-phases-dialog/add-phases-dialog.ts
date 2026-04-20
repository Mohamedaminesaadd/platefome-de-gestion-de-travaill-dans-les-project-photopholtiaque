// ── src/app/projects/add-phases-dialog/add-phases-dialog.component.ts ────────
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PhaseService } from '../../services/phase-service';
import { Phase } from '../../core/models/phase.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TacheTemplate {
  numero: string;       // ex: "1.1"
  titre: string;
  selected: boolean;
  heureEstimee?: number;
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
  complexite: 'BASSE' | 'MOYENNE' | 'ELEVEE';
}

export interface PhaseTemplate {
  numero: number;
  titre: string;
  description: string;
  icon: string;
  color: string;         // CSS class suffix
  expanded: boolean;
  selected: boolean;
  taches: TacheTemplate[];
  // custom tasks added by user
  customTaches: CustomTache[];
}

export interface CustomTache {
  id: string;
  titre: string;
  heureEstimee: number;
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
  complexite: 'BASSE' | 'MOYENNE' | 'ELEVEE';
}

export interface AddPhasesDialogData {
  projectId: string;
  projectNom: string;
}

// ── PV Phases Template ────────────────────────────────────────────────────────

const PV_PHASES: PhaseTemplate[] = [
  {
    numero: 1,
    titre: 'Étude et administratif',
    description: 'Analyses préliminaires, dimensionnement et démarches administratives',
    icon: 'description',
    color: 'blue',
    expanded: false,
    selected: false,
    customTaches: [],
    taches: [
      { numero: '1.1', titre: 'Analyse de faisabilité',        selected: false, heureEstimee: 8,  priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '1.2', titre: 'Étude d\'ensoleillement',       selected: false, heureEstimee: 6,  priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '1.3', titre: 'Dimensionnement technique',     selected: false, heureEstimee: 12, priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '1.4', titre: 'Obtention permis de construire',selected: false, heureEstimee: 40, priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '1.5', titre: 'Demande raccordement Enedis',   selected: false, heureEstimee: 16, priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '1.6', titre: 'Validation devis client',       selected: false, heureEstimee: 4,  priorite: 'HAUTE',    complexite: 'BASSE'   },
    ],
  },
  {
    numero: 2,
    titre: 'Préparation et logistique',
    description: 'Commandes, réceptions des équipements et préparation du chantier',
    icon: 'inventory_2',
    color: 'amber',
    expanded: false,
    selected: false,
    customTaches: [],
    taches: [
      { numero: '2.1', titre: 'Commande matériel',       selected: false, heureEstimee: 4,  priorite: 'CRITIQUE', complexite: 'BASSE'   },
      { numero: '2.2', titre: 'Réception panneaux',      selected: false, heureEstimee: 3,  priorite: 'HAUTE',    complexite: 'BASSE'   },
      { numero: '2.3', titre: 'Réception onduleur',      selected: false, heureEstimee: 2,  priorite: 'HAUTE',    complexite: 'BASSE'   },
      { numero: '2.4', titre: 'Préparation site',        selected: false, heureEstimee: 8,  priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '2.5', titre: 'Livraison sur chantier',  selected: false, heureEstimee: 4,  priorite: 'HAUTE',    complexite: 'BASSE'   },
    ],
  },
  {
    numero: 3,
    titre: 'Installation',
    description: 'Pose et raccordement complet du système photovoltaïque',
    icon: 'construction',
    color: 'coral',
    expanded: false,
    selected: false,
    customTaches: [],
    taches: [
      { numero: '3.1', titre: 'Installation échafaudage',   selected: false, heureEstimee: 6,  priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '3.2', titre: 'Pose rails et fixation',     selected: false, heureEstimee: 10, priorite: 'CRITIQUE', complexite: 'MOYENNE' },
      { numero: '3.3', titre: 'Installation panneaux',      selected: false, heureEstimee: 16, priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '3.4', titre: 'Câblage DC',                 selected: false, heureEstimee: 8,  priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '3.5', titre: 'Installation onduleur',      selected: false, heureEstimee: 6,  priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '3.6', titre: 'Raccordement électrique',    selected: false, heureEstimee: 8,  priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '3.7', titre: 'Mise en service',            selected: false, heureEstimee: 4,  priorite: 'CRITIQUE', complexite: 'MOYENNE' },
    ],
  },
  {
    numero: 4,
    titre: 'Contrôle et validation',
    description: 'Tests, conformité réglementaire et réception officielle',
    icon: 'fact_check',
    color: 'purple',
    expanded: false,
    selected: false,
    customTaches: [],
    taches: [
      { numero: '4.1', titre: 'Tests conformité',        selected: false, heureEstimee: 6,  priorite: 'CRITIQUE', complexite: 'MOYENNE' },
      { numero: '4.2', titre: 'Vérification production', selected: false, heureEstimee: 4,  priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '4.3', titre: 'Contrôle Consuel',        selected: false, heureEstimee: 8,  priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '4.4', titre: 'Réception client',        selected: false, heureEstimee: 3,  priorite: 'HAUTE',    complexite: 'BASSE'   },
    ],
  },
  {
    numero: 5,
    titre: 'Suivi et maintenance',
    description: 'Formation, monitoring et garantie sur le long terme',
    icon: 'support_agent',
    color: 'teal',
    expanded: false,
    selected: false,
    customTaches: [],
    taches: [
      { numero: '5.1', titre: 'Formation client',          selected: false, heureEstimee: 4,  priorite: 'MOYENNE', complexite: 'BASSE'   },
      { numero: '5.2', titre: 'Mise en place monitoring',  selected: false, heureEstimee: 6,  priorite: 'HAUTE',   complexite: 'MOYENNE' },
      { numero: '5.3', titre: 'Garantie et SAV',           selected: false, heureEstimee: 2,  priorite: 'HAUTE',   complexite: 'BASSE'   },
      { numero: '5.4', titre: 'Maintenance annuelle',      selected: false, heureEstimee: 8,  priorite: 'MOYENNE', complexite: 'MOYENNE' },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-add-phases-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './add-phases-dialog.html',
  styleUrls: ['./add-phases-dialog.css'],
})
export class AddPhasesDialogComponent implements OnInit {

  // Deep clone so mutations don't affect the constant
  phases: PhaseTemplate[] = JSON.parse(JSON.stringify(PV_PHASES));

  // State
  saving        = signal(false);
  saveError     = signal<string | null>(null);
  step          = signal<'select' | 'review' | 'done'>('select');

  // New custom task form (per phase)
  newTaskForms: Record<number, { titre: string; heureEstimee: number; priorite: string; complexite: string; open: boolean }> = {};

  // ── Computed stats ──────────────────────────────────────────────────────────

  readonly totalSelected = computed(() =>
    this.phases.reduce((sum, p) =>
      sum + (p.selected ? p.taches.filter(t => t.selected).length + p.customTaches.length : 0), 0)
  );

  readonly phasesSelected = computed(() =>
    this.phases.filter(p => p.selected).length
  );

  readonly totalHeures = computed(() =>
    this.phases.reduce((sum, p) => {
      if (!p.selected) return sum;
      const templateH = p.taches.filter(t => t.selected).reduce((s, t) => s + (t.heureEstimee ?? 0), 0);
      const customH   = p.customTaches.reduce((s, t) => s + (t.heureEstimee ?? 0), 0);
      return sum + templateH + customH;
    }, 0)
  );

  // ── Constructor ─────────────────────────────────────────────────────────────

  constructor(
    public dialogRef: MatDialogRef<AddPhasesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddPhasesDialogData,
    private phaseService: PhaseService,
  ) {}

  ngOnInit(): void {
    // Init new-task form state per phase
    this.phases.forEach(p => {
      this.newTaskForms[p.numero] = {
        titre: '', heureEstimee: 4, priorite: 'MOYENNE', complexite: 'MOYENNE', open: false
      };
    });
  }

  // ── Phase helpers ───────────────────────────────────────────────────────────

  togglePhase(phase: PhaseTemplate): void {
    phase.selected = !phase.selected;
    if (phase.selected) {
      // Auto-select all taches when phase is selected
      phase.taches.forEach(t => t.selected = true);
      phase.expanded = true;
    } else {
      phase.taches.forEach(t => t.selected = false);
    }
  }

  toggleExpand(phase: PhaseTemplate, event: Event): void {
    event.stopPropagation();
    phase.expanded = !phase.expanded;
  }

  toggleTache(phase: PhaseTemplate, tache: TacheTemplate): void {
    tache.selected = !tache.selected;
    // If at least one tache selected → mark phase selected
    phase.selected = phase.taches.some(t => t.selected) || phase.customTaches.length > 0;
  }

  countSelected(phase: PhaseTemplate): number {
    return phase.taches.filter(t => t.selected).length + phase.customTaches.length;
  }

  allSelected(phase: PhaseTemplate): boolean {
    return phase.taches.every(t => t.selected);
  }

  toggleAllTaches(phase: PhaseTemplate): void {
    const all = this.allSelected(phase);
    phase.taches.forEach(t => t.selected = !all);
    phase.selected = !all || phase.customTaches.length > 0;
  }

  // ── Custom task ─────────────────────────────────────────────────────────────

  openNewTaskForm(phase: PhaseTemplate): void {
    this.newTaskForms[phase.numero].open = true;
  }

  cancelNewTask(phase: PhaseTemplate): void {
    const f = this.newTaskForms[phase.numero];
    f.open = false; f.titre = ''; f.heureEstimee = 4;
    f.priorite = 'MOYENNE'; f.complexite = 'MOYENNE';
  }

  addCustomTask(phase: PhaseTemplate): void {
    const f = this.newTaskForms[phase.numero];
    if (!f.titre.trim()) return;
    const idx = phase.customTaches.length + 1;
    phase.customTaches.push({
      id: `custom-${phase.numero}-${Date.now()}`,
      titre: f.titre.trim(),
      heureEstimee: f.heureEstimee,
      priorite:    f.priorite as CustomTache['priorite'],
      complexite:  f.complexite as CustomTache['complexite'],
    });
    phase.selected = true;
    this.cancelNewTask(phase);
  }

  removeCustomTask(phase: PhaseTemplate, id: string): void {
    phase.customTaches = phase.customTaches.filter(t => t.id !== id);
    if (!phase.taches.some(t => t.selected) && phase.customTaches.length === 0) {
      phase.selected = false;
    }
  }

  // ── Select all ──────────────────────────────────────────────────────────────

  selectAll(): void {
    this.phases.forEach(p => {
      p.selected = true;
      p.taches.forEach(t => t.selected = true);
      p.expanded = true;
    });
  }

  clearAll(): void {
    this.phases.forEach(p => {
      p.selected = false;
      p.taches.forEach(t => t.selected = false);
      p.customTaches = [];
    });
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  goToReview(): void {
    this.step.set('review');
  }

  backToSelect(): void {
    this.step.set('select');
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  save(): void {
    this.saving.set(true);
    this.saveError.set(null);

    const selectedPhases = this.phases.filter(p => p.selected);

    const requests = selectedPhases.map((p, i) => {
      const payload: Partial<Phase> = {
        nom:        `Phase ${p.numero} : ${p.titre}`,
        description: p.description,
        order:       p.numero,
      };
      const taches = [
        ...p.taches
          .filter(t => t.selected)
          .map(t => ({
            titre:        t.titre,
            heureEstimee: t.heureEstimee,
            priorite:     t.priorite,
            complexite:   t.complexite,
            statut:       'A FAIRE',
          })),
        ...p.customTaches.map(t => ({
          titre:        t.titre,
          heureEstimee: t.heureEstimee,
          priorite:     t.priorite,
          complexite:   t.complexite,
          statut:       'A FAIRE',
        })),
      ];
      (payload as any).taches = taches;
      return this.phaseService.create(this.data.projectId, payload).pipe(
        catchError(err => of({ error: err }))
      );
    });

    forkJoin(requests).subscribe({
      next: (results) => {
        const errors = results.filter((r: any) => r?.error);
        if (errors.length > 0) {
          this.saveError.set(`${errors.length} phase(s) n'ont pas pu être sauvegardées.`);
        } else {
          this.step.set('done');
          setTimeout(() => this.dialogRef.close({ success: true, count: selectedPhases.length }), 1400);
        }
        this.saving.set(false);
      },
      error: () => {
        this.saveError.set('Erreur réseau. Veuillez réessayer.');
        this.saving.set(false);
      },
    });
  }

  close(): void {
    this.dialogRef.close(null);
  }

  // ── Display helpers ─────────────────────────────────────────────────────────

  prioriteLabel(p: string): string {
    return { BASSE: 'Basse', MOYENNE: 'Moyenne', HAUTE: 'Haute', CRITIQUE: 'Critique' }[p] ?? p;
  }

  prioriteClass(p: string): string {
    return { BASSE: 'prio-low', MOYENNE: 'prio-med', HAUTE: 'prio-high', CRITIQUE: 'prio-crit' }[p] ?? '';
  }
}