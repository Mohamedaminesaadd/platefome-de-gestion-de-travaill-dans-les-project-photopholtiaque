// ── src/app/pages/project-manager/kanban-board/kanban-board.ts ──────────────
import {
  Component, OnInit, computed, signal, effect
} from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { MatIconModule }       from '@angular/material/icon';
import { MatRippleModule }     from '@angular/material/core';
import { MatTooltipModule }    from '@angular/material/tooltip';
import { MatSelectModule }     from '@angular/material/select';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule }      from '@angular/material/badge';
import {
  CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem
} from '@angular/cdk/drag-drop';

import { Sidebar }      from '../../../layout/sidbar/sidbar';
import { Topbar }       from '../../../layout/topbar/topbar';
import { TacheService } from '../../../services/tache-service';
import { Tache, StatutTache, PrioriteTache } from '../../../core/models/tache.model';
// Ligne à corriger dans kanban-board-component.ts
import { TacheFormDialogComponent } from '../tache-form-dialog-component/tache-form-dialog-component';

// ── MOCK TECHNICIENS ──────────────────────────────────────────────────────────
export interface Technicien {
  id: string; nom: string; email: string; specialite?: string;
}

export const TECHNICIENS: Technicien[] = [
  { id: 'u1', nom: 'Amine Sadda',    email: 'amine@mail.com',  specialite: 'Électricité'  },
  { id: 'u2', nom: 'Sara Benmoussa', email: 'sara@mail.com',   specialite: 'Mécanique'    },
  { id: 'u3', nom: 'Karim Ouali',    email: 'karim@mail.com',  specialite: 'Informatique' },
  { id: 'u4', nom: 'Nadia Ferhat',   email: 'nadia@mail.com',  specialite: 'Hydraulique'  },
  { id: 'u5', nom: 'Youcef Amrani',  email: 'youcef@mail.com', specialite: 'Électricité'  },
  { id: 'u6', nom: 'Lina Hadjadj',   email: 'lina@mail.com',   specialite: 'Topographie'  },
];

// ── COLUMN CONFIG ─────────────────────────────────────────────────────────────
export interface KanbanColumn {
  statut:    StatutTache;
  label:     string;
  icon:      string;
  colorVar:  string;
  tasks:     Tache[];
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatIconModule, MatRippleModule, MatTooltipModule,
    MatSelectModule, MatFormFieldModule,
    MatDialogModule, MatSnackBarModule, MatBadgeModule,
    DragDropModule,
    Sidebar, Topbar,
  ],
  templateUrl: './kanban-board-component.html',
  styleUrls:   ['./kanban-board-component.css'],
})
export class KanbanBoardComponent implements OnInit {

  // ── FILTERS ─────────────────────────────────────────────────────────────────
  searchTerm      = '';
  filterTechId    = '';
  filterPriorite: PrioriteTache | '' = '';

  readonly techniciens = TECHNICIENS;

  // ── COLUMNS ─────────────────────────────────────────────────────────────────
  columns: KanbanColumn[] = [
    { statut: 'A FAIRE',  label: 'À Faire',    icon: 'radio_button_unchecked', colorVar: '--col-todo',  tasks: [] },
    { statut: 'EN COURS', label: 'En Cours',   icon: 'play_circle',            colorVar: '--col-doing', tasks: [] },
    { statut: 'TERMINEE', label: 'Terminée',   icon: 'check_circle',           colorVar: '--col-done',  tasks: [] },
  ];

  /** IDs for cdkDropListConnectedTo */
  readonly connectedIds = ['col-A FAIRE', 'col-EN COURS', 'col-TERMINEE'];

  // ── QUICK ADD STATE ──────────────────────────────────────────────────────────
  quickAddActive: Record<string, boolean> = {};
  quickAddTitle:  Record<string, string>  = {};

  constructor(
    private tacheSvc: TacheService,
    private dialog:   MatDialog,
    private snack:    MatSnackBar,
  ) {
    // React to signal changes automatically
    effect(() => { this.rebuildColumns(); });
  }

  ngOnInit(): void {
    this.rebuildColumns();
  }

  // ── REBUILD COLUMNS ──────────────────────────────────────────────────────────
  private rebuildColumns(): void {
    const all = this.filteredTasks();
    this.columns.forEach(col => {
      col.tasks = all.filter(t => t.statut === col.statut);
    });
  }

  private filteredTasks(): Tache[] {
    return this.tacheSvc.filter({
      technicienId: this.filterTechId   || undefined,
      search:       this.searchTerm     || undefined,
    }).filter(t =>
      !this.filterPriorite || t.priorite === this.filterPriorite
    );
  }

  onFilterChange(): void { this.rebuildColumns(); }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterTechId = '';
    this.filterPriorite = '';
    this.rebuildColumns();
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterTechId || this.filterPriorite);
  }

  // ── DRAG & DROP ──────────────────────────────────────────────────────────────
  drop(event: CdkDragDrop<Tache[]>, targetStatut: StatutTache): void {
    if (event.previousContainer === event.container) {
      // Same column reorder
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Cross-column move
      const task = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.tacheSvc.moveToStatut(task._id, targetStatut);
      this.notify(`"${task.titre}" déplacée vers ${this.statutLabel(targetStatut)}`, 'check_circle');
    }
  }

  // ── QUICK ADD ────────────────────────────────────────────────────────────────
  toggleQuickAdd(statut: string): void {
    this.quickAddActive[statut] = !this.quickAddActive[statut];
    this.quickAddTitle[statut]  = '';
  }

  confirmQuickAdd(statut: StatutTache): void {
    const titre = (this.quickAddTitle[statut] ?? '').trim();
    if (!titre) return;
    const newTask = this.tacheSvc.add({
      titre, statut, priorite: 'MOYENNE', heureEstimees: 0,
      idPhase: 'ph-1', idProject: 'proj-1',
    });
    this.quickAddActive[statut] = false;
    this.quickAddTitle[statut]  = '';
    this.rebuildColumns();
    this.notify(`Tâche "${newTask.titre}" ajoutée`, 'add_task');
  }

  // ── OPEN DIALOG ──────────────────────────────────────────────────────────────
  openDialog(task?: Tache, defaultStatut?: StatutTache): void {
    const ref = this.dialog.open(TacheFormDialogComponent, {
      width: '560px',
      panelClass: 'kanban-dialog-panel',
      data: { task: task ?? null, defaultStatut, techniciens: this.techniciens },
    });

    ref.afterClosed().subscribe((result: { action: string; task: Partial<Tache> } | null) => {
      if (!result) return;

      if (result.action === 'save' && task) {
        this.tacheSvc.update(task._id, result.task);
        this.notify(`Tâche mise à jour`, 'edit');
      } else if (result.action === 'create') {
        this.tacheSvc.add(result.task as Omit<Tache, '_id' | 'createdAt'>);
        this.notify(`Tâche créée`, 'add_task');
      }
      this.rebuildColumns();
    });
  }

  deleteTask(task: Tache, event: Event): void {
    event.stopPropagation();
    this.tacheSvc.delete(task._id);
    this.rebuildColumns();
    this.notify(`Tâche "${task.titre}" supprimée`, 'delete');
  }

  // ── HELPERS ──────────────────────────────────────────────────────────────────
  prioriteClass(p: PrioriteTache): string {
    return { CRITIQUE: 'p-critique', HAUTE: 'p-haute', MOYENNE: 'p-moyenne', BASSE: 'p-basse' }[p] ?? '';
  }

  prioriteIcon(p: PrioriteTache): string {
    return { CRITIQUE: 'priority_high', HAUTE: 'arrow_upward', MOYENNE: 'drag_handle', BASSE: 'arrow_downward' }[p] ?? '';
  }

  avatarColor(name: string): string {
    const colors = ['#2563EB', '#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];
    return colors[(name?.charCodeAt(0) ?? 0) % colors.length];
  }

  initials(name: string): string {
    return (name ?? '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  isOverdue(date?: string): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  formatDate(d?: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  statutLabel(s: StatutTache): string {
    return { 'A FAIRE': 'À Faire', 'EN COURS': 'En Cours', 'TERMINEE': 'Terminée' }[s];
  }

  totalTasks(): number {
    return this.columns.reduce((sum, c) => sum + c.tasks.length, 0);
  }

  trackById(_: number, t: Tache): string { return t._id; }

  private notify(msg: string, icon: string): void {
    this.snack.open(`${msg}`, '✕', {
      duration: 3000,
      panelClass: ['kanban-snack'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}