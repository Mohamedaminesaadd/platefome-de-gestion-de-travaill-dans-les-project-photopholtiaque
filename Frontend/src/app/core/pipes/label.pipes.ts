// ============================================================
// label.pipes.ts — Pipes standalone pour les dropdowns
// ============================================================
import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus, TaskPriority, DeadlineFilter } from '../models/task-filter.model';

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  private map: Record<TaskStatus, string> = {
    'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done',
  };
  transform(_: any, value: TaskStatus | null): string {
    return value ? (this.map[value] ?? value) : '';
  }
}

@Pipe({ name: 'priorityLabel', standalone: true })
export class PriorityLabelPipe implements PipeTransform {
  private map: Record<TaskPriority, string> = {
    low: 'Low', medium: 'Medium', high: 'High',
  };
  transform(_: any, value: TaskPriority | null): string {
    return value ? (this.map[value] ?? value) : '';
  }
}

@Pipe({ name: 'deadlineLabel', standalone: true })
export class DeadlineLabelPipe implements PipeTransform {
  private map: Record<NonNullable<DeadlineFilter>, string> = {
    'today': 'Due Today', 'this-week': 'This Week', 'late': 'Overdue',
  };
  transform(_: any, value: DeadlineFilter): string {
    return value ? (this.map[value] ?? value) : '';
  }
}