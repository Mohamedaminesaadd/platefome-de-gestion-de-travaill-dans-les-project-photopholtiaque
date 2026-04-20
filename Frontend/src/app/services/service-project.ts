import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../core/models/project.model';

export interface ProjectStats {
  total: number;
  byStatus: Record<string, number>;
  budget: {
    total: number;
    consumed: number;
  };
}


@Injectable({ providedIn: 'root' })
export class ProjectService {

  private readonly API = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient) {}

  // GET /api/projects/stats
  getStats(): Observable<ProjectStats> {
    return this.http.get<ProjectStats>(`${this.API}/stats`);
  }

  // GET /api/projects
  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.API);
  }

  // GET /api/projects/:id
  getById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.API}/${id}`);
  }

  // POST /api/projects
  create(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.API, project);
  }

  // PUT /api/projects/:id
  update(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.API}/${id}`, project);
  }

  // DELETE /api/projects/:id
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}