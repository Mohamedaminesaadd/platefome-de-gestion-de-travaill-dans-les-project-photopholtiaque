// src/app/dashboard/(phase-tache)/toast-container/toast-container.ts
import { Component, inject } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let t of toasts"
        class="toast"
        [class]="'toast--' + t.type"
        (click)="toastSvc.dismiss(t.id)"
      >
        <span class="toast-icon">
          <ng-container [ngSwitch]="t.type">
            <span *ngSwitchCase="'success'">✓</span>
            <span *ngSwitchCase="'error'">✕</span>
            <span *ngSwitchCase="'warning'">⚠</span>
            <span *ngSwitchDefault>ℹ</span>
          </ng-container>
        </span>
        {{ t.message }}
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; bottom: 28px; right: 28px;
      display: flex; flex-direction: column; gap: 10px;
      z-index: 9999;
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 20px; border-radius: 12px;
      font-size: 14px; font-weight: 600; color: #fff;
      cursor: pointer; min-width: 260px;
      box-shadow: 0 8px 24px rgba(0,0,0,.18);
      animation: toastIn .3s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(20px) scale(.9); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .toast--success { background: linear-gradient(135deg, #22c55e, #16a34a); }
    .toast--error   { background: linear-gradient(135deg, #ef4444, #dc2626); }
    .toast--warning { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .toast--info    { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .toast-icon {
      width: 22px; height: 22px; border-radius: 50%;
      background: rgba(255,255,255,.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; flex-shrink: 0;
    }
  `],
})
export class ToastContainerComponent {
  toastSvc = inject(ToastService);

  get toasts(): Toast[] {
    return this.toastSvc.toasts();
  }
}