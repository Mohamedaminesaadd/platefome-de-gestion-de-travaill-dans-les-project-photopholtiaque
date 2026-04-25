import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { of, switchMap } from 'rxjs';
import { TechnicianProfileService } from '../../../services/technician/technician-profile.service';
import { ScheduleService } from '../../../services/technician/schedule.service';
import { TechnicianTaskService } from '../../../services/technician/task.service';

@Component({
  selector: 'app-technician-schedule-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianSchedulePage {
  private readonly profileService = inject(TechnicianProfileService);
  private readonly taskService = inject(TechnicianTaskService);
  readonly scheduleService = inject(ScheduleService);

  readonly referenceDate = signal(new Date());
  readonly profile = toSignal(this.profileService.getCurrentProfile(), { initialValue: null });
  readonly userId = computed(() => this.profile()?._id ?? null);
  readonly tasks = toSignal(
    toObservable(this.userId).pipe(
      switchMap((userId) => (userId ? this.taskService.getByTechnician(userId) : of([]))),
    ),
    { initialValue: [] },
  );
  readonly weekDays = computed(() => this.scheduleService.getWeekDays(this.referenceDate()));
  readonly slots = computed(() => this.scheduleService.buildWeekSlots(this.tasks(), this.referenceDate()));
  readonly hours = Array.from({ length: 12 }).map((_, index) => 7 + index);
  readonly slotHeight = (startMinute: number, endMinute: number) =>
    Math.max(48, (endMinute - startMinute) / 2);

  previousWeek(): void {
    const next = new Date(this.referenceDate());
    next.setDate(next.getDate() - 7);
    this.referenceDate.set(next);
  }

  nextWeek(): void {
    const next = new Date(this.referenceDate());
    next.setDate(next.getDate() + 7);
    this.referenceDate.set(next);
  }
}
