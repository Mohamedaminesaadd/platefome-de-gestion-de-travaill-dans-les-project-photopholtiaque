import { Component, Output, EventEmitter, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    MatRippleModule,
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {

  @Output() toggleSidebar = new EventEmitter<void>();

  private auth = inject(Auth);
  private cdr  = inject(ChangeDetectorRef);

  userName     = '';
  userRole     = '';
  userInitials = '';
  notifCount   = 11;
  isLoading    = true;

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (profile: any) => {
        this.userName     = profile.username ?? profile.name ?? 'Utilisateur';
        this.userRole     = profile.role     ?? '';
        this.userInitials = this.buildInitials(this.userName);
        this.isLoading    = false;
        this.cdr.markForCheck();   // ← déclenche la mise à jour sans toucher l'écran
      },
      error: () => {
        this.userName     = 'Utilisateur';
        this.userRole     = this.auth.getUserRole() ?? '';
        this.userInitials = 'U';
        this.isLoading    = false;
        this.cdr.markForCheck();   // ← idem en cas d'erreur
      }
    });
  }

  private buildInitials(name: string): string {
    return name
      .split(' ')
      .map(w => w[0] ?? '')
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  get today(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  toggle(): void {
    this.toggleSidebar.emit();
  }
}