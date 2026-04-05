import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tache } from '../core/models/tache.model';

@Injectable({ providedIn: 'root' })
export class TacheService {

  private readonly API = 'http://localhost:3000/api/taches';

  constructor(private http: HttpClient) {}

  // GET /api/taches
  getAll(): Observable<Tache[]> {
    return this.http.get<Tache[]>(this.API);
  }

  // GET /api/taches/:id
  getById(id: string): Observable<Tache> {
    return this.http.get<Tache>(`${this.API}/${id}`);
  }

  // GET /api/taches/phase/:phaseId
  getByPhase(phaseId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/phase/${phaseId}`);
  }

  // GET /api/taches/user/:userId
  getByUser(userId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/user/${userId}`);
  }

  // GET /api/taches/project/:projectId
  getByProject(projectId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/project/${projectId}`);
  }

  // POST /api/taches
  create(tache: Partial<Tache>): Observable<Tache> {
    return this.http.post<Tache>(this.API, tache);
  }

  // PATCH /api/taches/:id
  update(id: string, tache: Partial<Tache>): Observable<Tache> {
    return this.http.patch<Tache>(`${this.API}/${id}`, tache);
  }

  // DELETE /api/taches/:id
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}