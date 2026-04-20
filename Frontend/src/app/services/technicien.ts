import { Injectable } from '@angular/core';
import { User } from '../core/models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Technicien {
  private readonly API = 'http://localhost:3000/api/users/role';

  constructor(private http: HttpClient) {}

  //get /api/role:technicien
  getTechniciens() {
    return this.http.get<User[]>(`${this.API}/technicien`);
  }
  
  
}
