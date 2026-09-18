import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PasswordResetRequest {
  email: string;
}

export interface TokenRequest {
  email: string;
  token: string;
}

export interface booleanReturn {
  message: string;
  bool: boolean;
}

export interface changePasswordRequest{
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class resetPassword{

  private url = "/api/password/reset";

  constructor(private http: HttpClient) {}

  request(request : PasswordResetRequest): Observable<string>{
    return this.http.post<string>(`${this.url}/request`, request)
  }

  compareTokem(request : TokenRequest): Observable<booleanReturn>{
        return this.http.post<booleanReturn>(`${this.url}/compareToken`, request)
  }

  changePassword(request : changePasswordRequest): Observable<booleanReturn>{
    return this.http.patch<booleanReturn>(`api/user/change`, request)
  }
}
