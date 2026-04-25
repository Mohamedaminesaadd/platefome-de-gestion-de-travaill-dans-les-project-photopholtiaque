import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TechnicianBottomNavComponent } from '../../../shared/technician/bottom-nav/bottom-nav';
import { TechnicianSidebarComponent } from '../../../shared/technician/sidebar/sidebar';
import { TechnicianTopbarComponent } from '../../../shared/technician/topbar/topbar';
import { ToastContainerComponent } from '../../../(phase-tache)/toast-container/toast-container';
import { TechnicianProfileService } from '../../../services/technician/technician-profile.service';
import { TechnicianTaskService } from '../../../services/technician/task.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-technician-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TechnicianBottomNavComponent,
    TechnicianSidebarComponent,
    TechnicianTopbarComponent,
    ToastContainerComponent,
  ],
  templateUrl: './technician-shell.html',
  styleUrl: './technician-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianShell {
  private readonly router = inject(Router);
  private readonly profileService = inject(TechnicianProfileService);
  private readonly taskService = inject(TechnicianTaskService);

  private readonly currentUrl = signal(this.router.url);
  readonly profile = toSignal(this.profileService.getCurrentProfile(), { initialValue: null });
  readonly userId = computed(() => this.profile()?._id ?? null);
  readonly tasks = toSignal(
    toObservable(this.userId).pipe(
      switchMap((userId) => (userId ? this.taskService.getByTechnician(userId) : of([]))),
    ),
    { initialValue: [] },
  );
  readonly hideChrome = computed(() => this.currentUrl().includes('/focus'));
  readonly title = computed(() => {
    const url = this.currentUrl();
    if (url.includes('/projects')) {
      return 'Projets';
    }

    if (url.includes('/tasks/')) {
      return 'Détail tâche';
    }

    if (url.includes('/tasks')) {
      return 'Tâches';
    }

    if (url.includes('/schedule')) {
      return 'Planning';
    }

    if (url.includes('/profile')) {
      return 'Profil';
    }

    if (url.includes('/focus')) {
      return 'Mode focus';
    }

    return 'Dashboard';
  });
  readonly subtitle = computed(() => {
    const profile = this.profile();
    if (!profile) {
      return 'Vue terrain';
    }

    return `${profile.username} · ${profile.disponible ? 'Disponible' : 'Occupé'}`;
  });
  readonly activeTaskCount = computed(
    () => this.tasks().filter((task) => task.status === 'in_progress' || task.status === 'todo').length,
  );

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }
}
