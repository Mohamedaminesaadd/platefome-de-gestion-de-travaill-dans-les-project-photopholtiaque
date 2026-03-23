import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(Auth);
  const router = inject(Router);

  // 1. Récupérer le token depuis le localStorage via le service
  const token = auth.getToken();

  // ❌ CAS 1 : Pas de token du tout
  if (!token) {
    console.warn(' [AUTH GUARD] Pas de token trouvé. Redirection vers /login');
    router.navigate(['/login']);
    return false;
  }

  // 2. Vérifier si le token est expiré (Lecture du payload JWT)
  try {
    // Le JWT est composé de 3 parties séparées par des points. La 2ème [1] est le payload.
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    // payload.exp est en secondes, Date.now() est en millisecondes
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      console.error(' [AUTH GUARD] Session expirée !');
      auth.logout(); // On nettoie le localStorage
      router.navigate(['/login']);
      return false;
    }

    // ✅ CAS 2 : Token présent et valide
    console.log(' [AUTH GUARD] Token valide. Accès autorisé.');
    return true;

  } catch (error) {
    // ❌ CAS 3 : Token malformé ou erreur de parsing
    console.error(' [AUTH GUARD] Erreur de lecture du token :', error);
    auth.logout();
    router.navigate(['/login']);
    return false;
  }
};