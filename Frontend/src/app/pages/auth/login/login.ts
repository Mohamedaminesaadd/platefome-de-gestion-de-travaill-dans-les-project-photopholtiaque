import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../services/auth';


const ROLE_ROUTES: Record<string, string> = {
  'admin':           '/admin-profil',
  'director':        '/director-profil',
  'technician':      '/technician-profil',
  'project_manager': '/manager-profil',
};

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf, RouterLink],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'], // CORRIGÉ
})



export class Login {
  loginData = { username: '', password: '' };
  errorMessage = '';
  isLoading    = false; // ← loading state

  constructor(private auth: Auth, private router: Router) {}

  // =================== SUBMIT LOGIN ===================
  /*
  onSubmit(loginForm: NgForm) {
  if (!this.isValidUsername(this.loginData.username)) {
    this.errorMessage = 'Username invalide';
    return;
  }

  if (!this.isValidPassword(this.loginData.password)) {
    this.errorMessage = 'Mot de passe invalide';
    return;
  }

  this.isLoading = true;
  this.errorMessage = ''; // Effacer les erreurs précédentes
  
  console.log('Tentative de connexion avec:', this.loginData.username); // Log avant appel

  this.auth.login(this.loginData.username, this.loginData.password)
  .subscribe({
    next: (res) => {
      console.log('Réponse complète du backend:', res); // Voir la structure exacte
      
      // Vérifier la structure de la réponse
      if (res && res.token) {
        this.auth.saveToken(res.token);
        const role = this.auth.getUserRole();
        console.log("ROLE extrait du token:", role);
        
        const route = role ? ROLE_ROUTES[role] : null;
        if (route) {
          this.router.navigate([route]);
        } else {
          this.errorMessage = 'Rôle non reconnu';
        }
      } else {
        console.error('Structure de réponse inattendue:', res);
        this.errorMessage = 'Erreur: format de réponse invalide';
      }
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Erreur HTTP complète:', err);
      
      // Afficher plus de détails sur l'erreur
      if (err.status === 0) {
        this.errorMessage = 'Erreur de connexion au serveur. Vérifiez que le backend est démarré.';
        console.log('Problème CORS ou serveur inaccessible');
      } else if (err.status === 401) {
        this.errorMessage = 'Identifiants incorrects';
      } else if (err.status === 404) {
        this.errorMessage = 'Endpoint non trouvé. Vérifiez l\'URL de l\'API.';
      } else {
        this.errorMessage = `Erreur: ${err.status} - ${err.message || 'Erreur inconnue'}`;
      }
      
      this.isLoading = false;
    }
  });

  


   this.auth.login(this.loginData.username, this.loginData.password).subscribe({
      next: (res) => {
        // ✅ sauvegarder le token
        this.auth.saveToken(res.token);

        // ✅ récupérer le rôle depuis JWT
        const role = this.auth.getUserRole();
        console.log("ROLE =", role);

        // 🚀 redirection selon rôle
        if (role === 'admin') {
          this.router.navigate(['/admin-profil']);
        } else if (role === 'DIRECTOR') {
          this.router.navigate(['/director-profil']);
        } else if (role === 'TECHNICIAN') {
          this.router.navigate(['/techninician-profil']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Échec de connexion';
      }
    });
}
      */

onSubmit(loginForm: NgForm) {
  if (loginForm.invalid) return;

  this.isLoading = true;
  this.errorMessage = '';

  this.auth.login(this.loginData.username, this.loginData.password).subscribe({
    next: (res) => {
      this.auth.saveToken(res.token);
      
      // On force en minuscule pour éviter les erreurs de casse (DIRECTOR vs director)
      const role = this.auth.getUserRole()?.toLowerCase();
      console.log("ROLE détecté :", role);

      switch (role) {
        case 'admin':
          this.router.navigate(['/admin-profil']);
          break;
        case 'director':
          this.router.navigate(['/director-profil']);
          break;
        case 'technician':
          this.router.navigate(['/technician-profil']); // Attention à l'orthographe ici
          break;
        case 'chefsproject':
        case 'project_manager':
          this.router.navigate(['/manager-profil']);
          break;
        default:
          this.router.navigate(['/']);
          this.errorMessage = 'Rôle non reconnu, redirection accueil.';
      }
      this.isLoading = false;
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Erreur login:', err);
      this.errorMessage = 'Identifiants incorrects ou serveur injoignable';
    }
  });
}


  // =================== VALIDATIONS ===================
  isValidUsername(username: string): boolean {
    if (!username) return false;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
  }

  isValidPassword(password: string): boolean {
    return !!(password && password.length >= 8);
  }

  // =================== SOCIAL LOGIN ===================
  onGoogleLogin(): void {
    console.log('Google login clicked');
    // Exemple : this.auth.loginWithGoogle()
  }

  onFacebookLogin(): void {
    console.log('Facebook login clicked');
    // Exemple : this.auth.loginWithFacebook()
  }
}