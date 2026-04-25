import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TechnicianTask, TechnicianTaskStatus } from '../../../core/models/technician.model';

@Component({
  selector: 'app-technician-task-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianTaskCardComponent {
  readonly task = input.required<TechnicianTask>();
  readonly showStatusActions = input(true);
  readonly open = output<void>();
  readonly focus = output<void>();
  readonly statusChange = output<TechnicianTaskStatus>();

  readonly statusLabel = computed(() => {
    const status = this.task().status;
    if (status === 'in_progress') {
      return 'En cours';
    }

    if (status === 'done') {
      return 'Terminée';
    }

    return 'À faire';
  });

  readonly priorityLabel = computed(() => {
    const priority = this.task().priority;
    if (priority === 'high') {
      return 'Haute';
    }

    if (priority === 'low') {
      return 'Basse';
    }

    return 'Moyenne';
  });

  readonly isLate = computed(
    () => this.task().status !== 'done' && new Date(this.task().deadline).getTime() < Date.now(),
  );

  updateStatus(status: TechnicianTaskStatus, event: Event): void {
    event.stopPropagation();
    this.statusChange.emit(status);
  }
}
