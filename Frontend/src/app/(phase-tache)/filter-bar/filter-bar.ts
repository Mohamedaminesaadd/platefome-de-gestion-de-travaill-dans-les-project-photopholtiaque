// ============================================================
// filter-bar.ts — Barre de filtres avec debounce + chips
// ============================================================
import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { Subject }      from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import {
  ActiveChip, TaskFilters, TaskPriority,
  TaskStatus, Technician, DeadlineFilter
} from '../../core/models/task-filter.model';
import {
  StatusLabelPipe, PriorityLabelPipe, DeadlineLabelPipe
} from '../../core/pipes/label.pipes';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusLabelPipe, PriorityLabelPipe, DeadlineLabelPipe],
  templateUrl: './filter-bar.html',
  styleUrls: ['./filter-bar.css'],
})
export class FilterBar implements OnInit, OnDestroy {
  @Input()  technicians: Technician[] = [];
  @Input()  filters!: TaskFilters;
  @Output() filtersChange = new EventEmitter<TaskFilters>();

  private searchSubject = new Subject<string>();
  private destroy$      = new Subject<void>();

  searchInput = '';

  readonly statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'todo',        label: 'To Do'       },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done',        label: 'Done'        },
  ];

  readonly priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'low',    label: 'Low'    },
    { value: 'medium', label: 'Medium' },
    { value: 'high',   label: 'High'   },
  ];

  readonly deadlineOptions: { value: DeadlineFilter; label: string }[] = [
    { value: 'today',     label: 'Due Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'late',      label: 'Overdue'   },
  ];

  ngOnInit(): void {
    this.searchInput = this.filters?.search ?? '';
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(value => this.emit({ search: value }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  /** Toggle off si même valeur, sinon set */
  setFilter(key: keyof TaskFilters, value: any): void {
    this.emit({ [key]: this.filters[key] === value ? null : value });
  }

  emit(partial: Partial<TaskFilters>): void {
    this.filtersChange.emit({ ...this.filters, ...partial });
  }

  get activeChips(): ActiveChip[] {
    const chips: ActiveChip[] = [];
    if (this.filters.search)
      chips.push({ key: 'search', label: `"${this.filters.search}"`, value: this.filters.search });
    if (this.filters.technicianId) {
      const t = this.getTechnicianById(this.filters.technicianId);
      chips.push({ key: 'technicianId', label: t?.name ?? 'Technician', value: this.filters.technicianId });
    }
    if (this.filters.status) {
      const s = this.statusOptions.find(s => s.value === this.filters.status);
      chips.push({ key: 'status', label: s?.label ?? this.filters.status!, value: this.filters.status! });
    }
    if (this.filters.priority) {
      const p = this.priorityOptions.find(p => p.value === this.filters.priority);
      chips.push({ key: 'priority', label: p?.label ?? this.filters.priority!, value: this.filters.priority! });
    }
    if (this.filters.deadline) {
      const d = this.deadlineOptions.find(d => d.value === this.filters.deadline);
      chips.push({ key: 'deadline', label: d?.label ?? this.filters.deadline!, value: this.filters.deadline! });
    }
    return chips;
  }

  removeChip(chip: ActiveChip): void {
    if (chip.key === 'search') this.searchInput = '';
    this.emit({ [chip.key]: chip.key === 'search' ? '' : null });
  }

  clearAll(): void {
    this.searchInput = '';
    this.filtersChange.emit({
      search: '', technicianId: null, status: null, priority: null, deadline: null,
    });
  }

  getTechnicianById(id: string | null): Technician | undefined {
    return this.technicians.find(t => t.id === id);
  }
}