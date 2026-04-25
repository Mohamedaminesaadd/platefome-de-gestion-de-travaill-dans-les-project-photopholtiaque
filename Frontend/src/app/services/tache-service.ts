import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tache } from '../core/models/tache.model';

@Injectable({ providedIn: 'root' })
export class TacheService {

  private readonly API = 'http://localhost:3000/api/taches';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tache[]> {
    return this.http.get<Tache[]>(this.API);
  }

  getById(id: string): Observable<Tache> {
    return this.http.get<Tache>(`${this.API}/${id}`);
  }

  getByPhase(phaseId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/phase/${phaseId}`);
  }

  getByProject(projectId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/project/${projectId}`);
  }

  getByUser(userId: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.API}/user/${userId}`);
  }

  create(tache: Partial<Tache>): Observable<Tache> {
    return this.http.post<Tache>(this.API, tache);
  }

  update(id: string, tache: Partial<Tache>): Observable<Tache> {
    return this.http.put<Tache>(`${this.API}/${id}`, tache);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  // ✅ Persiste l'assignation en base
  assign(taskIds: string[], technicianId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/assign`, {
      taskIds,
      technicianId
    });
  }

  deleteMany(taskIds: string[]): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API}/many`, {
      body: { taskIds }
    });
  }
}