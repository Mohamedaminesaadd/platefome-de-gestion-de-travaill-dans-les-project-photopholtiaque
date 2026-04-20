// src/app/services/toast.service.ts
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id:      number;
  message: string;
  type:    ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  private _toasts = signal<Toast[]>([]);
  readonly toasts  = this._toasts.asReadonly();
  private counter  = 0;

  show(message: string, type: ToastType = 'success', duration = 3000): void {
    const id = ++this.counter;
    this._toasts.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  // ✅ dismiss() — nom unifié (appelé par toast-container)
  dismiss(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  // ✅ remove() gardé pour compatibilité avec l'ancien code
  remove(id: number): void {
    this.dismiss(id);
  }
}

//service de toast pour afficher des notifications temporaires à l'utilisateur. Il utilise un signal pour stocker la liste des toasts et fournit des méthodes pour afficher et supprimer les toasts.  