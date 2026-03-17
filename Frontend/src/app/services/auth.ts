import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Auth{

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Fonction login
  login(credentials: { username: string, password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(res => {
          // 🔑 Stocker le token dans localStorage
          localStorage.setItem('token', res.token);
        })
      );
  }

  // Vérifier si connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
