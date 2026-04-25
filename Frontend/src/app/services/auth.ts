import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  private apiUrl = 'http://localhost:3000/api/users';
  private tokenKey = 'jwtToken'; // clé pour stocker le token

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  login(username: string, password: string): Observable<any> {
    console.log("login fonctionee")
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  

  saveToken(token: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.defaultView?.localStorage?.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return this.document.defaultView?.localStorage?.getItem(this.tokenKey) ?? null;
  }

  logout() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.defaultView?.localStorage?.removeItem(this.tokenKey);
  }

  getProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  forgotPassword(email: string) {
  return this.http.post(`${this.apiUrl}/forget-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
}

  // 🔥 Méthode pour récupérer le rôle depuis le JWT
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = this.decodeTokenPayload(token);
      if (!decoded) {
        return null;
      }

      const payload = JSON.parse(decoded);
      return payload.role || null; // renvoyer le role
    } catch (err) {
      console.error('JWT decode error', err);
      return null;
    }
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const decoded = this.decodeTokenPayload(token);
      if (!decoded) {
        return null;
      }

      const payload = JSON.parse(decoded);
      return payload.id || null;
    } catch {
      return null;
    }
  }

  private decodeTokenPayload(token: string): string | null {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return this.document.defaultView?.atob(normalized) ?? null;
  }
}
