import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Auth } from '../../../services/auth';
import { SidebarState } from '../../../service/sidebar-state';

@Component({
  selector: 'app-technician-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatRippleModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianSidebarComponent {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  readonly sidebarState = inject(SidebarState);

  readonly activeTasks = input(0);

  readonly items = [
    { label: 'Dashboard', icon: 'dashboard', link: '/technician/dashboard' },
    { label: 'Projects', icon: 'solar_power', link: '/technician/projects' },
    { label: 'Tasks', icon: 'task_alt', link: '/technician/tasks' },
    { label: 'Schedule', icon: 'calendar_month', link: '/technician/schedule' },
    { label: 'Profile', icon: 'person', link: '/technician/profile' },
  ];

  get isCollapsed(): boolean {
    return this.sidebarState.isCollapsed;
  }

  toggleSidebar(): void {
    this.sidebarState.toggle();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
