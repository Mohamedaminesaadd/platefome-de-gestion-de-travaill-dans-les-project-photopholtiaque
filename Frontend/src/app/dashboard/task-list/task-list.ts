// task-list.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../core/models/task-filter.model';
import {  TaskCardComponent} from '../task-card/task-card';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule,TaskCardComponent ],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskListComponent {
  @Input()  tasks: Task[]         = [];
  @Input()  multiSelectMode       = false;
  @Input()  selectedIds: Set<string> = new Set();
  @Output() selectionToggled      = new EventEmitter<string>();

  isSelected(id: string): boolean { return this.selectedIds.has(id); }

  trackById(_: number, task: Task): string { return task.id; }
}