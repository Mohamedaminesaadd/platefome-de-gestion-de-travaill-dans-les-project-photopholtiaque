// ============================================================
// toast.service.ts — Notifications légères (Angular signals)
// ============================================================
import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  readonly toasts  = this._toasts.asReadonly();
  private counter  = 0;

  show(message: string, type: Toast['type'] = 'success', duration = 3500): void {
    const id = ++this.counter;
    this._toasts.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}