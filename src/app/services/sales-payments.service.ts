import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalesPayments } from '../model/salesPayments';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalesPaymentsService {
  private endPoint = 'http://localhost:8090/api/pagos';

  constructor(private http: HttpClient) {}

  getSalesPayments(): Observable<SalesPayments[]> {
    return this.http
      .get<SalesPayments[]>(this.endPoint)
      .pipe(catchError(this.manejarError));
  }

  getSalesPaymentsId(id: number): Observable<SalesPayments> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de pago no válido'));
    }
    return this.http
      .get<SalesPayments>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  createSalesPayment(salesPayment: SalesPayments): Observable<SalesPayments> {
    return this.http.post<SalesPayments>(this.endPoint, salesPayment).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          console.warn('Validación fallida (400):', error.error);
          return throwError(
            () => new Error('Datos inválidos. Verifique el formulario.')
          );
        }

        if (error.status === 409) {
          console.warn('Pago duplicado:', error.error);
          return throwError(
            () => new Error('Ya existe un pago con ese nombre.')
          );
        }

        const mensaje =
          error.error?.mensaje || 'Error desconocido en la creación de la pago';
        console.error('Error al crear pago:', mensaje);
        return throwError(() => new Error(mensaje));
      })
    );
  }

  deleteSalesPayment(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de pago no válido'));
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
