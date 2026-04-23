import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Phase } from '../core/models/phase.model';

// ── Interface pour création avec tâches ──────────────────────
export interface PhaseWithTaches extends Partial<Phase> {
  taches?: {
    title:          string;       // ✅ était "titre"
    estimatedHours: number;       // ✅ était "heureEstimee"
    priorite:       string;
    complexite:     string;
    statut:         string;
    deadline:       Date | null;  // ✅ champ manquant
  }[];
}

@Injectable({ providedIn: 'root' })
export class PhaseService {

  private readonly API = 'http://localhost:3000/api/phases';

  constructor(private http: HttpClient) {}

  // GET /api/phases
  getAll(): Observable<Phase[]> {
    return this.http.get<Phase[]>(this.API);
  }

  // GET /api/phases/project/:projectId
  getByProject(projectId: string): Observable<Phase[]> {
    return this.http.get<Phase[]>(`${this.API}/project/${projectId}`);
  }

  // GET /api/phases/:id
  getById(id: string): Observable<Phase> {
    return this.http.get<Phase>(`${this.API}/${id}`);
  }

  // POST /api/phases/:projectId  ← crée phase + tâches en une seule requête
  create(projectId: string, phase: PhaseWithTaches): Observable<{ message: string; data: Phase }> {
    return this.http.post<{ message: string; data: Phase }>(
      `${this.API}/${projectId}`,
      phase
    );
  }

  // PUT /api/phases/:id
  update(id: string, phase: Partial<Phase>): Observable<Phase> {
    return this.http.put<Phase>(`${this.API}/${id}`, phase);
  }

  // DELETE /api/phases/:id
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}