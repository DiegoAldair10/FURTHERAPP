import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '../model/payment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
 private endPoint = 'http://localhost:8090/api/metodos-pago';

  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http
      .get<Payment[]>(this.endPoint)
      .pipe(catchError(this.manejarError));
  }

  getPaymentsId(id: number): Observable<Payment> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID del metodo de pago no válido'));
    }
    return this.http
      .get<Payment>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  createPayments(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.endPoint, payment).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          console.warn('⚠️ Validación fallida (400):', error.error);
          return throwError(
            () => new Error('Datos inválidos. Verifique el formulario.')
          );
        }

       
        const mensaje =
          error.error?.mensaje ||
          'Error desconocido en la creación del metodo de pago';
        console.error('❌ Error al crear metodo de pago:', mensaje);
        return throwError(() => new Error(mensaje));
      })
    );
  }

  updatePayments(id: number, payment: Payment): Observable<Payment> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de metodo de pago  no válido'));
    }
    return this.http
      .put<Payment>(`${this.endPoint}/${id}`, payment)
      .pipe(catchError(this.manejarError));
  }

  deletePayments(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de metodo de pago no válido'));
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
