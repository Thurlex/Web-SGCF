import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PasswordResetRequest {
  email: string;
}
@Injectable({
  providedIn: 'root'
})
export class resetPassword{

  private url = "/api/password/reset";

  constructor(private http: HttpClient) {}

  request(request : PasswordResetRequest): Observable<PasswordResetRequest>{
    return this.http.post<PasswordResetRequest>(`${this.url}/request`, request)
  }
}
