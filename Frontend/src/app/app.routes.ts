import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { PasswordForget } from './pages/auth/password-forget/password-forget';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import {Profiladmin } from './pages/admin/profileadmin/profileadmin';
import { Profildirector } from './pages/director/profildirector/profildirector';
import { Profiltechnician } from './pages/technincian/profiltechnician/profiltechnician';
import { ProjectManager } from './pages/project-manager/project-manager';
import {  Sidebar } from './layout/sidbar/sidbar';
import { Topbar } from './layout/topbar/topbar';
import { StatsRow } from './dashboard/stats-row/stats-row';
import { ListProject } from './dashboard/list-project/list-project';
import { IaDahsborad } from './dashboard/ia-dahsborad/ia-dahsborad';

export const routes: Routes = [
  // Routes publiques
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'forget-password', component: PasswordForget },
  { path: 'reset/:token', component: ResetPassword }, 
  {path:'side-bar',component:Sidebar},
  {path:'top-bar',component:Topbar},
  {path:'stats-row',component:StatsRow},
  {path: 'list-project', component: ListProject},
  {path:'ia-dahsborad',component:IaDahsborad},


  // Routes protégées (Note: 'technician' est maintenant écrit correctement)
  {
    path: 'admin-profil',
    component: Profiladmin, // Corrigé : c'était Profildirector avant
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
    path: 'technician-profil', // <--- ORTHOGRAPHE FIXÉE
    component: Profiltechnician,
    canActivate: [authGuard, roleGuard],
    data: { role: 'technician' }
  },
  {
    path: 'projectManager-profil', // <--- ORTHOGRAPHE FIXÉE
    component: ProjectManager,
    canActivate: [authGuard, roleGuard],
    data: { role: 'project_manager' }
  },

  // 404
  { path: '**', redirectTo: 'login' }
];