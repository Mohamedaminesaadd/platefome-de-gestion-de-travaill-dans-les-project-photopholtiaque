// sidebar-state.service.ts
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarState {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private _collapsed: boolean;

  constructor() {
    const saved = isPlatformBrowser(this.platformId)
      ? this.document.defaultView?.localStorage?.getItem('sidebarCollapsed')
      : null;
    this._collapsed = saved ? JSON.parse(saved) : false;
  }

  get isCollapsed(): boolean {
    return this._collapsed;
  }

  toggle(): void {
    this._collapsed = !this._collapsed;
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.defaultView?.localStorage?.setItem('sidebarCollapsed', JSON.stringify(this._collapsed));
  }
}
