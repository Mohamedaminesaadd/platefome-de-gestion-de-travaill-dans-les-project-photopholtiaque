import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { of, switchMap } from 'rxjs';
import { TechnicianProfileService } from '../../../services/technician/technician-profile.service';
import { TechnicianTaskService } from '../../../services/technician/task.service';

@Component({
  selector: 'app-technician-projects-page',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianProjectsPage {
  readonly router = inject(Router);
  private readonly profileService = inject(TechnicianProfileService);
  private readonly taskService = inject(TechnicianTaskService);

  readonly profile = toSignal(this.profileService.getCurrentProfile(), { initialValue: null });
  readonly userId = computed(() => this.profile()?._id ?? null);
  readonly projects = toSignal(
    toObservable(this.userId).pipe(
      switchMap((userId) => (userId ? this.taskService.getProjectsByTechnician(userId) : of([]))),
    ),
    { initialValue: [] },
  );
}
