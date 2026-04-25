import { Routes } from '@angular/router';

export const TECHNICIAN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./technician-shell/technician-shell').then((m) => m.TechnicianShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        data: { title: 'Dashboard' },
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.TechnicianDashboardPage),
      },
      {
        path: 'projects',
        data: { title: 'Projets' },
        loadComponent: () => import('./projects/projects').then((m) => m.TechnicianProjectsPage),
      },
      {
        path: 'tasks',
        data: { title: 'Tâches' },
        loadComponent: () => import('./task-list/task-list').then((m) => m.TechnicianTaskListPage),
      },
      {
        path: 'tasks/:taskId',
        data: { title: 'Détail tâche' },
        loadComponent: () => import('./task-detail/task-detail').then((m) => m.TechnicianTaskDetailPage),
      },
      {
        path: 'focus',
        data: { title: 'Focus' },
        loadComponent: () => import('./timer-focus/timer-focus').then((m) => m.TechnicianTimerFocusPage),
      },
      {
        path: 'schedule',
        data: { title: 'Planning' },
        loadComponent: () => import('./schedule/schedule').then((m) => m.TechnicianSchedulePage),
      },
      {
        path: 'profile',
        data: { title: 'Profil' },
        loadComponent: () => import('./profile/profile').then((m) => m.TechnicianProfilePage),
      },
    ],
  },
];
