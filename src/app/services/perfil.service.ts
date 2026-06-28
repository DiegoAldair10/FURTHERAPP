import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Perfil } from '../model/perfil';
import { UpdatePerfil } from '../model/updatePerfil';
import { UpdatePassword } from '../model/updatePassword';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
 private apiUrl = 'http://localhost:8090/api/perfil';

  constructor(private http: HttpClient) {}

  getPerfil(): Observable<Perfil> {
    return this.http.get<Perfil>(this.apiUrl);
  }

  updatePerfil(data: UpdatePerfil): Observable<Perfil> {
    return this.http.put<Perfil>(this.apiUrl, data);
  }

  cambiarPassword(data: UpdatePassword): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/password`, data);
  }
}
