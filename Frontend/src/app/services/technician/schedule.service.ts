import { Injectable } from '@angular/core';
import { ScheduleSlot, TechnicianTask } from '../../core/models/technician.model';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  readonly dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  getWeekStart(referenceDate: Date): Date {
    const date = new Date(referenceDate);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  getWeekDays(referenceDate: Date): { key: string; label: string; date: Date }[] {
    const start = this.getWeekStart(referenceDate);

    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      return {
        key: date.toISOString().slice(0, 10),
        label: `${this.dayLabels[index]} ${date.getDate()}`,
        date,
      };
    });
  }

  buildWeekSlots(tasks: TechnicianTask[], referenceDate: Date): ScheduleSlot[] {
    const days = this.getWeekDays(referenceDate);
    const dayLookup = new Map(days.map((day) => [day.key, day.label]));
    const slots: ScheduleSlot[] = [];

    for (const task of tasks) {
      const deadline = new Date(task.deadline);
      const dayKey = deadline.toISOString().slice(0, 10);
      if (!dayLookup.has(dayKey)) {
        continue;
      }

      const durationMinutes = Math.max(60, Math.round((task.estimatedHours || 1) * 60));
      const endMinute = Math.max(8 * 60, deadline.getHours() * 60 + deadline.getMinutes());
      const startMinute = Math.max(7 * 60, endMinute - durationMinutes);

      slots.push({
        id: `${task.id}-${dayKey}`,
        taskId: task.id,
        title: task.title,
        dayKey,
        dayLabel: dayLookup.get(dayKey) ?? dayKey,
        startMinute,
        endMinute,
        status: task.status,
        priority: task.priority,
        projectName: task.projectName,
      });
    }

    return slots.sort((left, right) => left.startMinute - right.startMinute);
  }
}
