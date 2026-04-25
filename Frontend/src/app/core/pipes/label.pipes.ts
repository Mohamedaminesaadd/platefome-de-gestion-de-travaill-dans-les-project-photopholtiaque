// label.pipes.ts
import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus, TaskPriority, DeadlineFilter } from '../models/task-filter.model';

@Pipe({ name: 'statusLabel', standalone: true, pure: true })
export class StatusLabelPipe implements PipeTransform {
  private readonly map: Record<TaskStatus, string> = {
    'todo'       : 'To Do',
    'in-progress': 'In Progress',
    'done'       : 'Done',
  };
  transform(_: unknown, value: TaskStatus | null): string {
    return value ? (this.map[value] ?? value) : '';
  }
}

@Pipe({ name: 'priorityLabel', standalone: true, pure: true })
export class PriorityLabelPipe implements PipeTransform {
  private readonly map: Record<TaskPriority, string> = {
    low   : 'Low',
    medium: 'Medium',
    high  : 'High',
  };
  transform(_: unknown, value: TaskPriority | null): string {
    return value ? (this.map[value] ?? value) : '';
  }
}

@Pipe({ name: 'deadlineLabel', standalone: true, pure: true })
export class DeadlineLabelPipe implements PipeTransform {
  private readonly map: Record<NonNullable<DeadlineFilter>, string> = {
    'today'    : 'Due Today',
    'this-week': 'This Week',
    'late'     : 'Overdue',
  };
  transform(_: unknown, value: DeadlineFilter): string {
    return value ? (this.map[value] ?? value) : '';
  }
}