import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Technician {
  _id         : string;
  username    : string;
  email       : string;
  role        : string;
  status?     : string;
  specialite? : string;
  disponible? : boolean;
  tachesEnCours?: number;
  efficacite? : number[];
}

@Injectable({ providedIn: 'root' })
export class TechnicienService {

  private readonly API = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getTechniciens(): Observable<Technician[]> {
    return this.http.get<Technician[]>(`${this.API}/technicians`);
  }
}