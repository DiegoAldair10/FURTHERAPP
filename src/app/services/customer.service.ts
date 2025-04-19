import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private endPoint = 'http://localhost:8090/api/clientes';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http
      .get<Customer[]>(this.endPoint)
      .pipe(catchError(this.manejarError));
  }

  getCustomersId(id: number): Observable<Customer> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de cliente no válido'));
    }
    return this.http
      .get<Customer>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  createCustomers(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.endPoint, customer).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          console.warn('⚠️ Validación fallida (400):', error.error);
          return throwError(
            () => new Error('Datos inválidos. Verifique el formulario.')
          );
        }

        if (error.status === 409) {
          console.warn('⚠️ Cliente duplicado:', error.error);
          return throwError(
            () => new Error('Ya existe un cliente con ese email.')
          );
        }

        const mensaje =
          error.error?.mensaje ||
          'Error desconocido en la creación del cliente';
        console.error('❌ Error al crear cliente:', mensaje);
        return throwError(() => new Error(mensaje));
      })
    );
  }

  updateCustomers(id: number, customer: Customer): Observable<Customer> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de cliente no válido'));
    }
    return this.http
      .put<Customer>(`${this.endPoint}/${id}`, customer)
      .pipe(catchError(this.manejarError));
  }

  deleteCustomers(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de cliente no válido'));
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
