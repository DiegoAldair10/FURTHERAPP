import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Dashboard } from '../model/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

 private url =
    'http://localhost:8090/api/dashboard';

  constructor(
    private http: HttpClient
  ) {}

  getDashboard():
    Observable<Dashboard> {

    return this.http.get<Dashboard>(
      this.url
    );

    
  }

  getVentasMes(): Observable<any[]> {
  return this.http.get<any[]>(
    this.url + '/ventas-mes'
  );
}

}