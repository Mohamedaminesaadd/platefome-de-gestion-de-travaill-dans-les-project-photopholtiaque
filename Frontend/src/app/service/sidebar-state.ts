// sidebar-state.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarState {
  private _collapsed: boolean;

  constructor() {
    const saved = localStorage.getItem('sidebarCollapsed');
    this._collapsed = saved ? JSON.parse(saved) : false;
  }

  get isCollapsed(): boolean {
    return this._collapsed;
  }

  toggle(): void {
    this._collapsed = !this._collapsed;
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this._collapsed));
  }
}