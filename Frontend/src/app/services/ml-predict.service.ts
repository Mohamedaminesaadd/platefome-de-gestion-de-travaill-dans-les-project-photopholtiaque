import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

export interface TaskPredictRequest {
  heure_estimee: number;
  complexite: 'BASSE' | 'MOYENNE' | 'ELEVEE';
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE';
  experience_technicien: number;
  meteo?: 'SOLEIL' | 'NUAGEUX' | 'PLUIE' | 'VENT_FORT';
  saison?: 'PRINTEMPS' | 'ETE' | 'AUTOMNE' | 'HIVER';
}

export interface TaskPredictResponse {
  prediction?: number;
  valeurPredite?: number;
  confiance?: number;
}

@Injectable({ providedIn: 'root' })
export class MlPredictService {
  private readonly API = 'http://localhost:8000/predict_tache1';

  constructor(private http: HttpClient) {}

  predict(data: TaskPredictRequest): Observable<TaskPredictResponse> {
    return this.http.post<TaskPredictResponse>(this.API, data).pipe(
      catchError(err => {
        console.error('ML API error:', err);
        return of({ prediction: this.fallback(data) });
      })
    );
  }

  private fallback(data: TaskPredictRequest): number {
    const c = { BASSE: 0.8, MOYENNE: 1.0, ELEVEE: 1.5 }[data.complexite] ?? 1;
    const p = { BASSE: 0.9, MOYENNE: 1.0, HAUTE: 1.3 }[data.priorite] ?? 1;
    const e = Math.max(0.7, 1 - (data.experience_technicien ?? 0) * 0.05);
    return Math.round(data.heure_estimee * c * p * e * 2) / 2;
  }
}