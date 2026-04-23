import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule }      from '@angular/material/button';
import { MatIconModule }        from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule }     from '@angular/material/tooltip';
import { PhaseService, PhaseWithTaches } from '../../services/phase-service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TacheTemplate {
  numero:        string;
  titre:         string;
  selected:      boolean;
  heureEstimee?: number;
  priorite:      'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
  complexite:    'BASSE' | 'MOYENNE' | 'ELEVEE';
}

export interface PhaseTemplate {
  numero:       number;
  titre:        string;
  description:  string;
  icon:         string;
  color:        string;
  expanded:     boolean;
  selected:     boolean;
  taches:       TacheTemplate[];
  customTaches: CustomTache[];
}

export interface CustomTache {
  id:           string;
  titre:        string;
  heureEstimee: number;
  priorite:     'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
  complexite:   'BASSE' | 'MOYENNE' | 'ELEVEE';
}

export interface AddPhasesDialogData {
  projectId:  string;
  projectNom: string;
}

const PV_PHASES_SOURCE: Omit<PhaseTemplate, 'customTaches'>[] = [
  {
    numero: 1, titre: 'Étude et administratif',
    description: 'Analyses préliminaires, dimensionnement et démarches administratives',
    icon: 'description', color: 'blue', expanded: false, selected: false,
    taches: [
      { numero: '1.1', titre: 'Analyse de faisabilité',         selected: false, heureEstimee: 8,  priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '1.2', titre: "Étude d'ensoleillement",         selected: false, heureEstimee: 6,  priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '1.3', titre: 'Dimensionnement technique',      selected: false, heureEstimee: 12, priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '1.4', titre: 'Obtention permis de construire', selected: false, heureEstimee: 40, priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '1.5', titre: 'Demande raccordement Enedis',    selected: false, heureEstimee: 16, priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '1.6', titre: 'Validation devis client',        selected: false, heureEstimee: 4,  priorite: 'HAUTE',    complexite: 'BASSE'   },
    ],
  },
  {
    numero: 2, titre: 'Préparation et logistique',
    description: 'Commandes, réceptions des équipements et préparation du chantier',
    icon: 'inventory_2', color: 'amber', expanded: false, selected: false,
    taches: [
      { numero: '2.1', titre: 'Commande matériel',      selected: false, heureEstimee: 4, priorite: 'CRITIQUE', complexite: 'BASSE'   },
      { numero: '2.2', titre: 'Réception panneaux',     selected: false, heureEstimee: 3, priorite: 'HAUTE',    complexite: 'BASSE'   },
      { numero: '2.3', titre: 'Réception onduleur',     selected: false, heureEstimee: 2, priorite: 'HAUTE',    complexite: 'BASSE'   },
      { numero: '2.4', titre: 'Préparation site',       selected: false, heureEstimee: 8, priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '2.5', titre: 'Livraison sur chantier', selected: false, heureEstimee: 4, priorite: 'HAUTE',    complexite: 'BASSE'   },
    ],
  },
  {
    numero: 3, titre: 'Installation',
    description: 'Pose et raccordement complet du système photovoltaïque',
    icon: 'construction', color: 'coral', expanded: false, selected: false,
    taches: [
      { numero: '3.1', titre: 'Installation échafaudage', selected: false, heureEstimee: 6,  priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '3.2', titre: 'Pose rails et fixation',   selected: false, heureEstimee: 10, priorite: 'CRITIQUE', complexite: 'MOYENNE' },
      { numero: '3.3', titre: 'Installation panneaux',    selected: false, heureEstimee: 16, priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '3.4', titre: 'Câblage DC',               selected: false, heureEstimee: 8,  priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '3.5', titre: 'Installation onduleur',    selected: false, heureEstimee: 6,  priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '3.6', titre: 'Raccordement électrique',  selected: false, heureEstimee: 8,  priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '3.7', titre: 'Mise en service',          selected: false, heureEstimee: 4,  priorite: 'CRITIQUE', complexite: 'MOYENNE' },
    ],
  },
  {
    numero: 4, titre: 'Contrôle et validation',
    description: 'Tests, conformité réglementaire et réception officielle',
    icon: 'fact_check', color: 'purple', expanded: false, selected: false,
    taches: [
      { numero: '4.1', titre: 'Tests conformité',        selected: false, heureEstimee: 6, priorite: 'CRITIQUE', complexite: 'MOYENNE' },
      { numero: '4.2', titre: 'Vérification production', selected: false, heureEstimee: 4, priorite: 'HAUTE',    complexite: 'MOYENNE' },
      { numero: '4.3', titre: 'Contrôle Consuel',        selected: false, heureEstimee: 8, priorite: 'CRITIQUE', complexite: 'ELEVEE'  },
      { numero: '4.4', titre: 'Réception client',        selected: false, heureEstimee: 3, priorite: 'HAUTE',    complexite: 'BASSE'   },
    ],
  },
  {
    numero: 5, titre: 'Suivi et maintenance',
    description: 'Formation, monitoring et garantie sur le long terme',
    icon: 'support_agent', color: 'teal', expanded: false, selected: false,
    taches: [
      { numero: '5.1', titre: 'Formation client',         selected: false, heureEstimee: 4, priorite: 'MOYENNE', complexite: 'BASSE'   },
      { numero: '5.2', titre: 'Mise en place monitoring', selected: false, heureEstimee: 6, priorite: 'HAUTE',   complexite: 'MOYENNE' },
      { numero: '5.3', titre: 'Garantie et SAV',          selected: false, heureEstimee: 2, priorite: 'HAUTE',   complexite: 'BASSE'   },
      { numero: '5.4', titre: 'Maintenance annuelle',     selected: false, heureEstimee: 8, priorite: 'MOYENNE', complexite: 'MOYENNE' },
    ],
  },
];

function buildPhases(): PhaseTemplate[] {
  return PV_PHASES_SOURCE.map(p => ({
    ...p,
    taches:       p.taches.map(t => ({ ...t })),
    customTaches: [] as CustomTache[],
  }));
}

@Component({
  selector:    'app-add-phases-dialog',
  standalone:  true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
  ],
  templateUrl: './add-phases-dialog.html',
  styleUrls:   ['./add-phases-dialog.css'],
})
export class AddPhasesDialogComponent implements OnInit {

  private _phaseWrappers = signal<Array<{ data: PhaseTemplate }>>(
    buildPhases().map(p => ({ data: p }))
  );

  saving    = signal(false);
  saveError = signal<string | null>(null);
  step      = signal<'select' | 'done'>('select');

  newTaskForms: Record<number, {
    titre: string; heureEstimee: number;
    priorite: string; complexite: string; open: boolean;
  }> = {};

  readonly phases = computed(() => this._phaseWrappers().map(w => w.data));

  readonly totalSelected = computed(() =>
    this.phases().reduce((sum, p) =>
      sum + (p.selected
        ? p.taches.filter(t => t.selected).length + p.customTaches.length
        : 0), 0)
  );

  readonly phasesSelected = computed(() =>
    this.phases().filter(p => p.selected).length
  );

  readonly totalHeures = computed(() =>
    this.phases().reduce((sum, p) => {
      if (!p.selected) return sum;
      return sum
        + p.taches.filter(t => t.selected).reduce((s, t) => s + (t.heureEstimee ?? 0), 0)
        + p.customTaches.reduce((s, t) => s + (t.heureEstimee ?? 0), 0);
    }, 0)
  );

  constructor(
    public  dialogRef:    MatDialogRef<AddPhasesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddPhasesDialogData,
    private phaseService: PhaseService,
  ) {}

  ngOnInit(): void {
    this.phases().forEach(p => {
      this.newTaskForms[p.numero] = {
        titre: '', heureEstimee: 4, priorite: 'MOYENNE', complexite: 'MOYENNE', open: false,
      };
    });
  }

  // ✅ FIX PRINCIPAL — clone profond pour que les Signals se propagent
  private mutatePhase(numero: number, fn: (p: PhaseTemplate) => void): void {
    this._phaseWrappers.update(wrappers =>
      wrappers.map(w => {
        if (w.data.numero !== numero) return w;
        const cloned: PhaseTemplate = {
          ...w.data,
          taches:       w.data.taches.map(t => ({ ...t })),
          customTaches: w.data.customTaches.map(t => ({ ...t })),
        };
        fn(cloned);
        return { data: cloned }; // ✅ nouvelle référence
      })
    );
  }

  togglePhase(phase: PhaseTemplate): void {
    this.mutatePhase(phase.numero, p => {
      p.selected = !p.selected;
      if (p.selected) {
        p.taches.forEach(t => t.selected = true);
        p.expanded = true;
      } else {
        p.taches.forEach(t => t.selected = false);
      }
    });
  }

  toggleExpand(phase: PhaseTemplate, event: Event): void {
    event.stopPropagation();
    this.mutatePhase(phase.numero, p => { p.expanded = !p.expanded; });
  }

  toggleTache(phase: PhaseTemplate, tache: TacheTemplate): void {
    this.mutatePhase(phase.numero, p => {
      const t = p.taches.find(t => t.numero === tache.numero)!;
      t.selected = !t.selected;
      p.selected = p.taches.some(t => t.selected) || p.customTaches.length > 0;
    });
  }

  countSelected(phase: PhaseTemplate): number {
    return phase.taches.filter(t => t.selected).length + phase.customTaches.length;
  }

  allSelected(phase: PhaseTemplate): boolean {
    return phase.taches.length > 0 && phase.taches.every(t => t.selected);
  }

  toggleAllTaches(phase: PhaseTemplate): void {
    this.mutatePhase(phase.numero, p => {
      const all = p.taches.every(t => t.selected);
      p.taches.forEach(t => t.selected = !all);
      p.selected = !all || p.customTaches.length > 0;
    });
  }

  // ✅ FIX — clone dans selectAll
  selectAll(): void {
    this._phaseWrappers.update(wrappers =>
      wrappers.map(w => ({
        data: {
          ...w.data,
          selected: true,
          expanded: true,
          taches:       w.data.taches.map(t => ({ ...t, selected: true })),
          customTaches: w.data.customTaches.map(t => ({ ...t })),
        }
      }))
    );
  }

  // ✅ FIX — clone dans clearAll
  clearAll(): void {
    this._phaseWrappers.update(wrappers =>
      wrappers.map(w => ({
        data: {
          ...w.data,
          selected: false,
          expanded: false,
          taches:       w.data.taches.map(t => ({ ...t, selected: false })),
          customTaches: [],
        }
      }))
    );
  }

  openNewTaskForm(phase: PhaseTemplate): void {
    this.newTaskForms[phase.numero].open = true;
  }

  cancelNewTask(phase: PhaseTemplate): void {
    Object.assign(this.newTaskForms[phase.numero], {
      open: false, titre: '', heureEstimee: 4, priorite: 'MOYENNE', complexite: 'MOYENNE',
    });
  }

  addCustomTask(phase: PhaseTemplate): void {
    const f = this.newTaskForms[phase.numero];
    if (!f.titre.trim()) return;
    this.mutatePhase(phase.numero, p => {
      p.customTaches.push({
        id:           `custom-${phase.numero}-${Date.now()}`,
        titre:        f.titre.trim(),
        heureEstimee: f.heureEstimee,
        priorite:     f.priorite as CustomTache['priorite'],
        complexite:   f.complexite as CustomTache['complexite'],
      });
      p.selected = true;
    });
    this.cancelNewTask(phase);
  }

  removeCustomTask(phase: PhaseTemplate, id: string): void {
    this.mutatePhase(phase.numero, p => {
      p.customTaches = p.customTaches.filter(t => t.id !== id);
      if (!p.taches.some(t => t.selected) && p.customTaches.length === 0) {
        p.selected = false;
      }
    });
  }

  save(): void {
    this.saving.set(true);
    this.saveError.set(null);

    // ✅ Snapshot immédiat avant tout appel async
    const selectedPhases = this.phases().filter(p => p.selected);

    if (selectedPhases.length === 0) {
      this.saveError.set('Aucune phase sélectionnée.');
      this.saving.set(false);
      return;
    }

    // ✅ Validation : chaque phase doit avoir au moins une tâche
    const phaseSansTache = selectedPhases.find(p =>
      p.taches.filter(t => t.selected).length === 0 &&
      p.customTaches.length === 0
    );
    if (phaseSansTache) {
      this.saveError.set(
        `La phase "${phaseSansTache.titre}" n'a aucune tâche sélectionnée.`
      );
      this.saving.set(false);
      return;
    }

    const requests = selectedPhases.map(p => {
      const tachesSelectionnees = p.taches.filter(t => t.selected);
      const dureeEstimee =
        tachesSelectionnees.reduce((s, t) => s + (t.heureEstimee ?? 0), 0) +
        p.customTaches.reduce((s, t) => s + (t.heureEstimee ?? 0), 0);

        const payload: PhaseWithTaches = {
          nom:          `Phase ${p.numero} : ${p.titre}`,
          description:  p.description,
          order:        p.numero,
          dureeEstimee: dureeEstimee || 1,
          statut:       'NON COMMENCEE',
          taches: [
            ...tachesSelectionnees.map(t => ({
              // ✅ Noms de champs corrects selon ton modèle Mongoose
              title:          t.titre,
              estimatedHours: t.heureEstimee ?? 0,
              priorite:       t.priorite,
              complexite:     t.complexite,
              statut:         'A FAIRE' as const,
              deadline:       null,   // ✅ champ requis — null ou date par défaut
            })),
            ...p.customTaches.map(t => ({
              title:          t.titre,
              estimatedHours: t.heureEstimee,
              priorite:       t.priorite,
              complexite:     t.complexite,
              statut:         'A FAIRE' as const,
              deadline:       null,   // ✅ champ requis
            })),
          ],
        };

      return this.phaseService.create(this.data.projectId, payload).pipe(
        catchError(err => {
          console.error(`❌ Erreur phase "${p.titre}":`, err);
          return of({ error: err });
        })
      );
    });

    forkJoin(requests).subscribe({
      next: results => {
        const errors = results.filter((r: any) => r?.error);
        if (errors.length > 0) {
          this.saveError.set(`${errors.length} phase(s) n'ont pas pu être sauvegardées.`);
          this.saving.set(false);
        } else {
          this.saving.set(false);
          this.step.set('done');
          // ✅ Utilise le snapshot, pas phases() qui peut avoir changé
          setTimeout(() => this.dialogRef.close({
            success: true,
            count: selectedPhases.length
          }), 1400);
        }
      },
      error: () => {
        this.saveError.set('Erreur réseau. Veuillez réessayer.');
        this.saving.set(false);
      },
    });
  }

  close(): void { this.dialogRef.close(null); }

  prioriteLabel(p: string): string {
    return ({ BASSE: 'Basse', MOYENNE: 'Moyenne', HAUTE: 'Haute', CRITIQUE: 'Critique' } as any)[p] ?? p;
  }

  prioriteClass(p: string): string {
    return ({ BASSE: 'prio-low', MOYENNE: 'prio-med', HAUTE: 'prio-high', CRITIQUE: 'prio-crit' } as any)[p] ?? '';
  }
  trackByNumero(index: number, phase: PhaseTemplate): number {
  return phase.numero;
}

trackByNumeroTache(index: number, tache: TacheTemplate): string {
  return tache.numero;
}

trackByCustomId(index: number, ct: CustomTache): string {
  return ct.id;
}
}