import { Component, HostBinding } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidbar.html',
  styleUrls: ['./sidbar.css'],
  imports: [
    MatIconModule,
    MatRippleModule,
    RouterLink,
    RouterLinkActive
  ],
})
export class Sidebar {

  isCollapsed = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved) {
      this.isCollapsed = JSON.parse(saved);
    }
  }

  // 🔥 applique class "collapsed" sur <app-sidebar>
  @HostBinding('class.collapsed')
  get collapsed() {
    return this.isCollapsed;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this.isCollapsed));
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}