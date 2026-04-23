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

  // GET /api/taches/project/:projectId
  getByProject(projectId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/project/${projectId}`);
  }

  // GET /api/taches/user/:userId
  getByUser(userId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/user/${userId}`);
  }

  // POST /api/taches
  create(tache: Partial<Tache>): Observable<Tache> {
    return this.http.post<Tache>(this.API, tache);
  }

  // PUT /api/taches/:id
  update(id: string, tache: Partial<Tache>): Observable<Tache> {
    return this.http.put<Tache>(`${this.API}/${id}`, tache);
  }

  // DELETE /api/taches/:id
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  // POST /api/taches/assign
  assign(taskIds: string[], technicianId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/assign`, {
      taskIds,
      technicianId
    });
  }

  // DELETE /api/taches/many
  deleteMany(taskIds: string[]): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API}/many`, {
      body: { taskIds }
    });
  }
}