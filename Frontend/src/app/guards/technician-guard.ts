import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

function checkTechnicianAccess(): boolean {
  const auth = inject(Auth);
  const router = inject(Router);
  const token = auth.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (auth.getUserRole()?.toLowerCase() !== 'technician') {
    const role = auth.getUserRole()?.toLowerCase();

    if (role === 'admin') {
      router.navigate(['/admin-profil']);
      return false;
    }

    if (role === 'director') {
      router.navigate(['/director-profil']);
      return false;
    }

    if (role === 'project_manager') {
      router.navigate(['/projectManager-profil']);
      return false;
    }

    auth.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
}

export const technicianGuard: CanActivateFn = () => checkTechnicianAccess();
export const technicianChildGuard: CanActivateChildFn = () => checkTechnicianAccess();
