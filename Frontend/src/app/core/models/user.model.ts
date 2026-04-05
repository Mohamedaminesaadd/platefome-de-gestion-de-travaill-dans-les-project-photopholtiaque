export type Role = 'admin' | 'director' | 'technician' | 'project_manager';

export interface User {
  _id?:      string;
  username:  string;
  email:     string;
  password?: string;
  role?:     Role;
}

export interface AuthResponse {
  token:   string;
  user:    User;
  message?: string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email:    string;
  password: string;
  role?:    Role;
}