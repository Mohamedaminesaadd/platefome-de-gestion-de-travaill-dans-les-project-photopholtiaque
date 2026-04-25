import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-technician-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianBottomNavComponent {
  readonly items = [
    { label: 'Accueil', icon: 'dashboard', link: '/technician/dashboard' },
    { label: 'Projets', icon: 'solar_power', link: '/technician/projects' },
    { label: 'Tâches', icon: 'task_alt', link: '/technician/tasks' },
    { label: 'Planning', icon: 'calendar_month', link: '/technician/schedule' },
    { label: 'Profil', icon: 'person', link: '/technician/profile' },
  ];
}
