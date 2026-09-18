import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Customer, CustomerRequest } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = '/api/customer';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/findAll`);
  }

  findAllActive(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/findAll/active`);
  }

  findById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/findById/${id}`);
  }

  save(customer: CustomerRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/save`, customer, { responseType: 'text' });
  }

  update(id: number, customer: CustomerRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/update/${id}`, customer, { responseType: 'text' });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
  }
}
