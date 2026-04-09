// task-card.ts
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

  get deadlineLabel(): string {
    const diff = Math.ceil(
      (this.task.deadline.getTime() - new Date().getTime()) / 86400000
    );
    if (diff < 0)  return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Due tomorrow';
    return `Due in ${diff}d`;
  }

  get isLate(): boolean {
    return this.task.deadline < new Date() && this.task.status !== 'done';
  }

  get priorityConfig(): { label: string; cls: string } {
    return { low: { label:'Low', cls:'low' }, medium: { label:'Medium', cls:'medium' }, high: { label:'High', cls:'high' } }[this.task.priority];
  }

  get statusConfig(): { label: string; cls: string } {
    return {
      'todo':        { label: 'To Do',       cls: 'todo'        },
      'in-progress': { label: 'In Progress', cls: 'in-progress' },
      'done':        { label: 'Done',        cls: 'done'        },
    }[this.task.status];
  }
}