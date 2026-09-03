import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthenticateRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  userName: string;
  permission: 'Manager' | 'Employee';
  email: string;
  employeeId: number | null;
}
export interface AuthenticateEmail {
  email: string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/user';


  constructor(private http: HttpClient) {}

  authenticate(request: AuthenticateRequest): Observable<boolean> {
    console.log(`${this.apiUrl}/authenticate`)
    return this.http.post<boolean>(
      `${this.apiUrl}/authenticate`,
      request,
      { withCredentials: true }
    );
  }

  session(): Observable<AuthenticatedUser> {
  const emailStored = localStorage.getItem('user') ?? '';

  const request: AuthenticateEmail = {
    email: emailStored
  };

  return this.http.post<AuthenticatedUser>(`${this.apiUrl}/is-manager`, request);
}

  logout(): void {
    localStorage.removeItem('user');
  }
}
