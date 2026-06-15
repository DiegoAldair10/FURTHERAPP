import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employe } from '../model/employe';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private endPoint = 'http://localhost:8090/api/empleados';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employe[]> {
    return this.http
      .get<Employe[]>(this.endPoint)
      .pipe(catchError(this.manejarError));
  }

  getEmployeesId(id: number): Observable<Employe> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de empleado no válido'));
    }
    return this.http
      .get<Employe>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  createEmployees(employe: Employe): Observable<Employe> {
    return this.http.post<Employe>(this.endPoint, employe).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          console.warn('⚠️ Validación fallida (400):', error.error);
          return throwError(
            () => new Error('Datos inválidos. Verifique el formulario.')
          );
        }

        if (error.status === 409) {
          console.warn('⚠️ Empleado duplicado:', error.error);
          return throwError(
            () => new Error('Ya existe un empleado con ese email.')
          );
        }

        const mensaje =
          error.error?.mensaje ||
          'Error desconocido en la creación del empleado';
        console.error('❌ Error al crear empleado:', mensaje);
        return throwError(() => new Error(mensaje));
      })
    );
  }

  updateEmployees(id: number, employe: Employe): Observable<Employe> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de empleado no válido'));
    }
    return this.http
      .put<Employe>(`${this.endPoint}/${id}`, employe)
      .pipe(catchError(this.manejarError));
  }

  deleteEmployees(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de empleado no válido'));
    }
    return this.http
      .delete<void>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  private manejarError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(
      () => new Error('Error en la comunicación con el servidor')
    );
  }
}
