import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { PasswordForget } from './pages/auth/password-forget/password-forget';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { Profiladmin } from './pages/admin/profileadmin/profileadmin';
import { Profildirector } from './pages/director/profildirector/profildirector';
import { Profiltechnician } from './pages/technincian/profiltechnician/profiltechnician';
import { ProjectManager } from './pages/project-manager/project-manager';
import { ListProject } from './dashboard/list-project/list-project';
import { IaDahsborad } from './dashboard/ia-dahsborad/ia-dahsborad';
import { Proc } from './pages/admin/proc/proc';
import { TechnicianList } from './pages/admin/technician-list/technician-list';
import { GanttChart } from './dashboard/diagramme-grantt/diagramme-grantt';

// ✅ CHEMIN CORRIGÉ — (phase-tache) ajouté
import { TaskManagementComponent } from './(phase-tache)/task-management/task-management';
import { TachesListRecherche } from './pages/admin/taches-list-recherche/taches-list-recherche';

export const routes: Routes = [
  // ── Publiques ────────────────────────────────────────────────────────────
  { path: '',               redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',          component: Login },
  { path: 'forget-password',component: PasswordForget },
  { path: 'reset/:token',   component: ResetPassword },
  { path: 'grantchart',     component: GanttChart },

  // ── Admin ────────────────────────────────────────────────────────────────
  {
    path: 'admin-profil',
    component: Profiladmin,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin-proc',
    component: Proc,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'tasks',
    component: TachesListRecherche,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },

  {
    path: 'page-technician',
    component: TechnicianList,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },

  // ── Director ─────────────────────────────────────────────────────────────
  {
    path: 'director-profil',
    component: Profildirector,
    canActivate: [authGuard, roleGuard],
    data: { role: 'director' }
  },

  // ── Technician ───────────────────────────────────────────────────────────
  {
    path: 'technician-profil',
    component: Profiltechnician,
    canActivate: [authGuard, roleGuard],
    data: { role: 'technician' }
  },

  // ── Project Manager ──────────────────────────────────────────────────────
  {
    path: 'projectManager-profil',
    component: ProjectManager,
    canActivate: [authGuard, roleGuard],
    data: { role: 'project_manager' }
  },

  // ── Dashboard ────────────────────────────────────────────────────────────
  {
    path: 'dashboard',
    component: ListProject,
    canActivate: [authGuard]
  },

  // ── 404 ──────────────────────────────────────────────────────────────────
  { path: '**', redirectTo: 'login' }
];