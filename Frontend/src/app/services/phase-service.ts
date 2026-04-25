import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Phase } from '../core/models/phase.model';

export interface PhaseWithTaches extends Partial<Phase> {
  taches?: {
    title         : string;
    estimatedHours: number;
    priorite      : string;
    complexite    : string;
    statut        : string;
    deadline      : Date | null;
  }[];
}

@Injectable({ providedIn: 'root' })
export class PhaseService {

  private readonly API = 'http://localhost:3000/api/phases';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Phase[]> {
    return this.http.get<Phase[]>(this.API);
  }

  getByProject(projectId: string): Observable<Phase[]> {
    return this.http.get<Phase[]>(`${this.API}/project/${projectId}`);
  }

  getById(id: string): Observable<Phase> {
    return this.http.get<Phase>(`${this.API}/${id}`);
  }

  create(
    projectId: string,
    phase: PhaseWithTaches
  ): Observable<{ message: string; data: Phase }> {
    return this.http.post<{ message: string; data: Phase }>(
      `${this.API}/${projectId}`,
      phase
    );
  }

  update(id: string, phase: Partial<Phase>): Observable<Phase> {
    return this.http.put<Phase>(`${this.API}/${id}`, phase);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}