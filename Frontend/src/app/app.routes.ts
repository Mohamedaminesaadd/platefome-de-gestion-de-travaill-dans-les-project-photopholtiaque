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


export const routes: Routes = [
  // Routes publiques
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'forget-password', component: PasswordForget },
  { path: 'reset/:token', component: ResetPassword },
  { path: 'page-technician', component: TechnicianList },
  
  // Remove these standalone routes - they should be part of your main layout
  // { path: 'side-bar', component: Sidebar }, // REMOVE
  // { path: 'top-bar', component: Topbar },   // REMOVE
  // { path: 'stats-row', component: StatsRow }, // REMOVE
  // { path: 'list-project', component: ListProject }, // This will be a child route
  // { path: 'ia-dahsborad', component: IaDahsborad }, // This will be a child route

  // Routes protégées
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
    path: 'director-profil',
    component: Profildirector,
    canActivate: [authGuard, roleGuard],
    data: { role: 'director' }
  },
  {
    path: 'technician-profil',
    component: Profiltechnician,
    canActivate: [authGuard, roleGuard],
    data: { role: 'technician' }
  },
  {
    path: 'projectManager-profil',
    component: ProjectManager,
    canActivate: [authGuard, roleGuard],
    data: { role: 'project_manager' }
  },
  {
    path: 'dashboard',
    component: ListProject, // or a dashboard component
    canActivate: [authGuard]
  },

  // 404
  { path: '**', redirectTo: 'login' }
];