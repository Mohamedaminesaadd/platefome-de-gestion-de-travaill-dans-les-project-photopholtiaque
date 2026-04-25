import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../core/models/task-filter.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.css'],
})
export class TaskCardComponent {
  @Input()  task!: Task;
  @Input()  multiSelectMode = false;
  @Input()  selected = false;
  @Output() selectionToggled = new EventEmitter<string>();

  onCardClick(): void {
    if (this.multiSelectMode) this.selectionToggled.emit(this.task.id);
  }

  // ✅ FIX : génère les initiales si avatar est vide
  get avatarInitials(): string {
    const name = this.task.assignedTo?.name ?? '';
    return name
      .split(' ')
      .map(w => w[0] ?? '')
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // ✅ FIX : génère une couleur déterministe depuis le nom
  get avatarColor(): string {
    if (this.task.assignedTo?.avatarColor) return this.task.assignedTo.avatarColor;
    const colors = [
      '#6366f1','#8b5cf6','#ec4899','#f59e0b',
      '#10b981','#3b82f6','#ef4444','#14b8a6'
    ];
    const name = this.task.assignedTo?.name ?? '';
    const idx  = name.charCodeAt(0) % colors.length;
    return colors[idx] ?? '#6366f1';
  }

  get deadlineLabel(): string {
    const diff = Math.ceil(
      (this.task.deadline.getTime() - Date.now()) / 86_400_000
    );
    if (diff < 0)  return `${Math.abs(diff)}j de retard`;
    if (diff === 0) return 'Aujourd\'hui';
    if (diff === 1) return 'Demain';
    return `Dans ${diff}j`;
  }

  get isLate(): boolean {
    return this.task.deadline < new Date() && this.task.status !== 'done';
  }

  get priorityConfig(): { label: string; cls: string } {
    return {
      low    : { label: 'Faible',  cls: 'low'    },
      medium : { label: 'Moyen',   cls: 'medium' },
      high   : { label: 'Urgent',  cls: 'high'   },
    }[this.task.priority] ?? { label: 'Inconnu', cls: 'unknown' };
  }

  get statusConfig(): { label: string; cls: string } {
    return {
      'todo'        : { label: 'À faire',     cls: 'todo'        },
      'in-progress' : { label: 'En cours',    cls: 'in-progress' },
      'done'        : { label: 'Terminé',     cls: 'done'        },
    }[this.task.status] ?? { label: 'Inconnu', cls: 'unknown' };
  }
}