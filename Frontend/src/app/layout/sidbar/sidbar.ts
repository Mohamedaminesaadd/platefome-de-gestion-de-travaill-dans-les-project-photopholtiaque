// sidebar.component.ts
import { Component, HostBinding } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { SidebarState } from '../../service/sidebar-state';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidbar.html',
  styleUrls: ['./sidbar.css'],
  imports: [MatIconModule, MatRippleModule, RouterLink, RouterLinkActive],
})
export class Sidebar {

  constructor(
    private auth: Auth,
    private router: Router,
    public sidebarState: SidebarState   // public → accessible dans le template
  ) {}

  @HostBinding('class.collapsed')
  get collapsed() {
    return this.sidebarState.isCollapsed;
  }

  get isCollapsed() {
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