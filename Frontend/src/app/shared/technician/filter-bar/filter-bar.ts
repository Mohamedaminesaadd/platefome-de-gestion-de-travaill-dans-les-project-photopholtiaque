import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TechnicianTaskFilter } from '../../../core/models/technician.model';

@Component({
  selector: 'app-technician-filter-bar',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianFilterBarComponent {
  readonly activeFilter = input<TechnicianTaskFilter>('today');
  readonly filterChange = output<TechnicianTaskFilter>();

  readonly filters: { value: TechnicianTaskFilter; label: string }[] = [
    { value: 'today', label: 'Aujourd’hui' },
    { value: 'week', label: 'Semaine' },
    { value: 'late', label: 'En retard' },
    { value: 'done', label: 'Terminées' },
  ];
}
