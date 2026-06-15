import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Usuario } from '../model/usuario';
import { LoginRequest } from '../model/loginRequest';
import { handleError } from '../model/handleError';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endPoint = 'http://localhost:8090/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getUser(): Observable<any[]> {
    return this.http
      .get<any[]>(this.endPoint, { headers: this.getHeaders() })
      .pipe(catchError(handleError));
  }

  createUser(user: any): Observable<any> {
    return this.http
      .post(this.endPoint, user, { headers: this.getHeaders() })
      .pipe(catchError(handleError));
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http
      .put(`${this.endPoint}/${id}`, user, { headers: this.getHeaders() })
      .pipe(catchError(handleError));
  }
deleteUser(id: number): Observable<string> {
  return this.http
    .delete(`${this.endPoint}/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    })
    .pipe(catchError(handleError));
}
}
