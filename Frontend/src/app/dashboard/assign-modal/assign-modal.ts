// assign-modal.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Technician } from '../../core/models/task-filter.model';

@Component({
  selector: 'app-assign-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assign-modal.html',
  styleUrls: ['./assign-modal.css'],
})
export class AssignModalComponent {
  @Input()  technicians: Technician[] = [];
  @Input()  selectedCount = 0;
  @Output() confirmed  = new EventEmitter<Technician>();
  @Output() dismissed  = new EventEmitter<void>();

  pickedTechnician: Technician | null = null;

  pick(t: Technician): void     { this.pickedTechnician = t; }
  confirm(): void               { if (this.pickedTechnician) this.confirmed.emit(this.pickedTechnician); }
}