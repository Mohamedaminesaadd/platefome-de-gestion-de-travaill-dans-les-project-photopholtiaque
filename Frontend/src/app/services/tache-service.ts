import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// adapte selon ton environnement
const API_URL = 'http://localhost:3000/api/users';

export interface Technician {
  _id: string;
  username: string;
  email: string;
  role: string;

  // champs backend ajoutés
  specialite?: string;
  disponible?: boolean;
  tachesEnCours?: number;
  efficacite?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class TechnicienService {

  constructor(private http: HttpClient) {}

  // ================= GET ALL TECHNICIANS =================
  getAll(): Observable<Technician[]> {
    return this.http.get<Technician[]>(`${API_URL}/technicians`);
  }

  // ================= GET BY ROLE =================
  getByRole(role: string): Observable<Technician[]> {
    return this.http.get<Technician[]>(`${API_URL}/role/${role}`);
  }

  // ================= GET ONE TECHNICIAN =================
  getById(id: string): Observable<Technician> {
    return this.http.get<Technician>(`${API_URL}/${id}`);
  }

  // ================= UPDATE TECHNICIAN =================
  update(id: string, data: Partial<Technician>): Observable<Technician> {
    return this.http.put<Technician>(`${API_URL}/${id}`, data);
  }

  // ================= DELETE TECHNICIAN =================
  delete(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}