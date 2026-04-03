import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../core/models/project.model'

@Injectable({
  providedIn: 'root',
})
export class ServiceProject {

  
  
private apiUrl = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient) {}

  // 🔹 CREATE
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  // 🔹 READ ALL
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  // 🔹 READ ONE
  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  // 🔹 UPDATE
  updateProject(id: string, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  // 🔹 DELETE
  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


