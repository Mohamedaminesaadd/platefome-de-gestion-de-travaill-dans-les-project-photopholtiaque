import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router'; // Add this import
import { MatRippleModule } from '@angular/material/core'; // Add for matRipple

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, RouterModule, MatRippleModule], // Add RouterModule and MatRippleModule
  templateUrl: './sidbar.html',
  styleUrl: './sidbar.css',
})
export class Sidebar {
  isCollapsed: boolean = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    console.log(this.isCollapsed);
  }
}