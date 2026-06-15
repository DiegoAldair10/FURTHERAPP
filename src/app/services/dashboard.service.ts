import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDashboardData(): Observable<any> {
    const headers = this.getHeaders();

    return forkJoin({
      productos: this.http.get<any[]>(`${this.baseUrl}/api/productos`, { headers }),
      clientes: this.http.get<any[]>(`${this.baseUrl}/api/clientes`, { headers }),
      ventas: this.http.get<any[]>(`${this.baseUrl}/api/ventas`, { headers }),
      usuarios: this.http.get<any[]>(`${this.baseUrl}/users`, { headers })
    });
  }
}