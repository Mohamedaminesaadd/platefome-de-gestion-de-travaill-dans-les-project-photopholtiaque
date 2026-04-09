import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Task {
  id: string;
  name: string;
  time: string;
  duration: string;
  priority: Priority;
  done: boolean;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    MatRippleModule
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {

  @Output() toggleSidebar = new EventEmitter<void>();

  toggle() {
    this.toggleSidebar.emit();
  }


  notifCount = 11;

  get today(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday:'long', year:'numeric', month:'long', day:'numeric'
    });
  }
}