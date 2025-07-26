import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sales } from '../model/sales';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private endPoint = 'http://localhost:8090/api/ventas';

  constructor(private http: HttpClient) {}

  getSales(): Observable<Sales[]> {
    return this.http
      .get<Sales[]>(this.endPoint)
      .pipe(catchError(this.manejarError));
  }

  getSalesId(id: number): Observable<Sales> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de venta no válido'));
    }
    return this.http
      .get<Sales>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  createSales(sales: Sales): Observable<Sales> {
    return this.http.post<Sales>(this.endPoint, sales).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          console.warn('Validación fallida (400):', error.error);
          return throwError(
            () => new Error('Datos inválidos. Verifique el formulario.')
          );
        }

        if (error.status === 409) {
          console.warn('Venta duplicado:', error.error);
          return throwError(
            () => new Error('Ya existe un venta con ese nombre.')
          );
        }

        const mensaje =
          error.error?.mensaje ||
          'Error desconocido en la creación de la venta';
        console.error('Error al crear venta:', mensaje);
        return throwError(() => new Error(mensaje));
      })
    );
  }

  
  deleteSales(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de venta no válido'));
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
