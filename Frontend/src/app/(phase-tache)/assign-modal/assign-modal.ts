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
  @Input()  technicians : Technician[] = [];
  @Input()  selectedCount = 0;
  @Output() confirmed   = new EventEmitter<Technician>();
  @Output() dismissed   = new EventEmitter<void>();

  pickedTechnician: Technician | null = null;

  pick(t: Technician): void {
    this.pickedTechnician = t;
  }

  confirm(): void {
    if (this.pickedTechnician) this.confirmed.emit(this.pickedTechnician);
  }

  // ✅ Génère les initiales depuis le username (ex: "@asma" → "A")
  getInitials(name: string): string {
    return (name ?? '')
      .replace('@', '')
      .split(' ')
      .map(w => w[0] ?? '')
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';
  }

  // ✅ Couleur déterministe depuis le nom
  getColor(name: string): string {
    const palette = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
      '#10b981', '#3b82f6', '#ef4444', '#14b8a6'
    ];
    const code = (name ?? '').replace('@', '').charCodeAt(0) || 0;
    return palette[code % palette.length];
  }
}