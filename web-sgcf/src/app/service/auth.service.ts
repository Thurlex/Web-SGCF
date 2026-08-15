import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthenticateRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  authenticate(request: AuthenticateRequest): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}/authenticate`,
      request
    );
  }
}
