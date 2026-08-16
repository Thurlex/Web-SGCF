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

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/User';

  constructor(private http: HttpClient) {}

  authenticate(request: AuthenticateRequest): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>(
      `${this.apiUrl}/authenticate`,
      request,
      { withCredentials: true }
    );
  }

  session(): Observable<AuthenticatedUser> {
    return this.http.get<AuthenticatedUser>(`${this.apiUrl}/session`, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, null, { withCredentials: true });
  }
}
