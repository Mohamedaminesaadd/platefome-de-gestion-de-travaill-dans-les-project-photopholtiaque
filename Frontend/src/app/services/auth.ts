import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {


  private apiUrl = 'http://localhost:3000/api/users';
  private tokenKey = 'jwtToken'; // clé pour stocker le token


  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  login(username: string, password: string): Observable<any> {
    console.log("login fonctionee")
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/profileadmin`, { headers });
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
      const payload = JSON.parse(atob(token.split('.')[1])); // décoder JWT
      return payload.role || null; // renvoyer le role
    } catch (err) {
      console.error('JWT decode error', err);
      return null;
    }
  }
}