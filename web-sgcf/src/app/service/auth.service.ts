import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthenticateRequest {
  email: string;
  password: string;
}

export interface AuthenticateResponse {
  success: boolean;
  token: string;
}

export interface AuthenticatedUser {
  id: number;
  userName: string;
  permission: 'MANAGER' | 'EMPLOYEE';
  email: string;
  employeeId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/user';


  constructor(private http: HttpClient) {}

  authenticate(request: AuthenticateRequest): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/authenticate`,
      request,
      { responseType: 'text' }
    );
  }

  session(): Observable<AuthenticatedUser> {
    return this.http.get<AuthenticatedUser>(`${this.apiUrl}/me`);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  }
}
