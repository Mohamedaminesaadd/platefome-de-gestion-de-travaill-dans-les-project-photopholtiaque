import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule],
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