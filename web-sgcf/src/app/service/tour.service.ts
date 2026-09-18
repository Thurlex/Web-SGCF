import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Tour, TourForm } from '../models/tour';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  private apiUrl = '/api/tour';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}/findAll`);
  }

  findAllActive(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}/findAll/active`);
  }

  findById(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/findId/${id}`);
  }

  save(tour: TourForm): Observable<string> {
    return this.http.post(`${this.apiUrl}/save`, tour, { responseType: 'text' });
  }

  update(id: number, tour: TourForm): Observable<string> {
    return this.http.put(`${this.apiUrl}/update/${id}`, tour, { responseType: 'text' });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
  }
}
