import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface PredictionRequest {
  heure_estimee: number;
  complexite: number;
  priorite: number;
  phase: number;
  experience_technicien: number;
  meteo: number;
  saison: number;
}

export interface PredictionResponse {
  valeurPredite: number;
  unite: string;
}


@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:3000/api/predict';

  constructor(private http: HttpClient) {}

  predict(data: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.apiUrl, data)
      .pipe(
        retry(1), // Réessaie 1 fois en cas d'échec
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code ${error.status}: ${error.message}`;
    }
    
    console.error('Prediction API error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}