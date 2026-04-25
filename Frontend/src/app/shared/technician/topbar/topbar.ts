import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-technician-topbar',
  standalone: true,
  imports: [CommonModule, MatBadgeModule, MatButtonModule, MatIconModule, MatRippleModule, MatTooltipModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianTopbarComponent {
  readonly title = input('Dashboard');
  readonly subtitle = input('Vue terrain');
  readonly initials = input('PV');
  readonly username = input('Technician');
  readonly role = input('Technician');
  readonly activeTasks = input(0);

  readonly today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
