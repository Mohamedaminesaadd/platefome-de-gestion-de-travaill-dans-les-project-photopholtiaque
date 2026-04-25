import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Stats, TechnicianProfile, TechnicianTask } from '../../core/models/technician.model';
import { Auth } from '../auth';

interface TechnicianApiUser {
  _id: string;
  username: string;
  email: string;
  role: 'technician';
  status?: 'active' | 'inactive';
  specialite?: string;
  disponible?: boolean;
  tachesEnCours?: number;
}

@Injectable({ providedIn: 'root' })
export class TechnicianProfileService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly API = 'http://localhost:3000/api/users';

  getCurrentProfile(): Observable<TechnicianProfile | null> {
    return this.http.get<TechnicianApiUser>(`${this.API}/profile`).pipe(
      map((profile) => this.mapProfile(profile)),
      catchError(() => of(this.buildFallback())),
    );
  }

  buildStats(tasks: TechnicianTask[], trackedSeconds: number): Stats {
    const assigned = tasks.length;
    const completed = tasks.filter((task) => task.status === 'done').length;
    const inProgress = tasks.filter((task) => task.status === 'in_progress').length;
    const overdue = tasks.filter(
      (task) => task.status !== 'done' && new Date(task.deadline).getTime() < Date.now(),
    ).length;
    const focusHours = Number((trackedSeconds / 3600).toFixed(1));
    const completionRate = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;
    const weeklyPerformance = this.buildWeeklyPerformance(tasks);

    return {
      assigned,
      inProgress,
      completed,
      overdue,
      focusHours,
      completionRate,
      weeklyPerformance,
    };
  }

  private mapProfile(profile: TechnicianApiUser): TechnicianProfile {
    const skills = profile.specialite
      ? profile.specialite.split(',').map((skill) => skill.trim()).filter(Boolean)
      : ['Installation PV', 'Sécurité chantier', 'Reporting'];

    return {
      _id: profile._id,
      username: profile.username,
      email: profile.email,
      role: profile.role,
      status: profile.status ?? 'active',
      specialite: profile.specialite,
      disponible: profile.disponible ?? true,
      tachesEnCours: profile.tachesEnCours ?? 0,
      avatarInitials: this.toInitials(profile.username),
      phone: '+216 70 000 000',
      location: 'Zone Nord chantier',
      skills,
    };
  }

  private buildFallback(): TechnicianProfile {
    return {
      _id: this.auth.getUserId() ?? 'unknown-technician',
      username: 'technician',
      email: 'technician@pv-manager.local',
      role: 'technician',
      status: 'active',
      disponible: true,
      tachesEnCours: 0,
      avatarInitials: this.toInitials('technician'),
      phone: '+216 70 000 000',
      location: 'Zone chantier',
      skills: ['Installation PV', 'Maintenance', 'Contrôle qualité'],
    };
  }

  private buildWeeklyPerformance(tasks: TechnicianTask[]): { label: string; value: number }[] {
    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const result = labels.map((label) => ({ label, value: 0 }));

    for (const task of tasks) {
      const deadline = new Date(task.deadline);
      const jsDay = deadline.getDay();
      const index = jsDay === 0 ? 6 : jsDay - 1;

      if (index >= 0 && index < result.length) {
        result[index].value += task.status === 'done' ? 1 : 0.5;
      }
    }

    return result;
  }

  private toInitials(value: string): string {
    return value
      .split(/[.\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk[0]?.toUpperCase() ?? '')
      .join('');
  }
}
