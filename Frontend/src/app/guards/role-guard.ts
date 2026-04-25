import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Auth } from '../services/auth';

// Configuration des routes par défaut pour la redirection automatique
const ROLE_ROUTES: Record<string, string> = {
  'admin':           '/admin-profil',
  'director':        '/director-profil',
  'technician':      '/technician/dashboard',
  'project_manager': '/projectManager-profil',
};

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth     = inject(Auth);
  const router   = inject(Router);

  // 1. Récupération du rôle requis (défini dans app.routes.ts)
  // On force en minuscule pour éviter les erreurs de frappe
  const requiredRole = route.data['role']?.toLowerCase();

  // 2. Récupération du rôle de l'utilisateur (depuis le JWT)
  const userRole = auth.getUserRole()?.toLowerCase();

  console.log('--- [ROLE GUARD CHECK] ---');
  console.log('Rôle requis par la route :', requiredRole);
  console.log('Rôle trouvé dans le JWT  :', userRole);

  // ✅ CAS 1 : L'utilisateur a le bon rôle
  if (userRole === requiredRole) {
    console.log('✅ Accès autorisé');
    return true;
  }

  // ❌ CAS 2 : L'utilisateur est connecté mais n'a pas le bon rôle
  if (userRole && ROLE_ROUTES[userRole]) {
    console.warn(`🚫 Accès refusé. Redirection vers le dashboard ${userRole}`);
    router.navigate([ROLE_ROUTES[userRole]]);
    return false;
  }

  // ❌ CAS 3 : Aucun rôle reconnu ou pas de token
  console.error('🛑 Rôle inconnu ou session expirée. Retour au login.');
  auth.logout();
  router.navigate(['/login']);
  return false;
};
