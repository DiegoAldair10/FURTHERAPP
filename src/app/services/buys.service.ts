import { Injectable } from '@angular/core';
import { Purchase } from '../model/purchase';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BuysService {
  private endPoint = 'http://localhost:8090/api/compras';

  constructor(private http: HttpClient) {}

  getBuys(): Observable<Purchase[]> {
    return this.http
      .get<Purchase[]>(this.endPoint)
      .pipe(catchError(this.manejarError));
  }

  getNextComprobante(tipoComprobante: string) {
    return this.http.get(`${this.endPoint}/proximo-numero/${tipoComprobante}`, {
      responseType: 'text',
    });
  }

  getPurchaseId(id: number): Observable<Purchase> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de compra no válido'));
    }
    return this.http
      .get<Purchase>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  createPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.endPoint, purchase).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          console.warn('Validación fallida (400):', error.error);
          return throwError(
            () => new Error('Datos inválidos. Verifique el formulario.'),
          );
        }

        if (error.status === 409) {
          console.warn('Compra duplicada:', error.error);
          return throwError(
            () => new Error('Ya existe un compra con ese nombre.'),
          );
        }

        const mensaje =
          error.error?.mensaje ||
          'Error desconocido en la creación de la compra';
        console.error('Error al crear compra:', mensaje);
        return throwError(() => new Error(mensaje));
      }),
    );
  }

  deletePurchases(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de compra no válido'));
    }
    return this.http
      .delete<void>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }
  // Agrega este método si no lo tenías:
  obtenerTodasCompras(): Observable<any[]> {
    return this.http.get<any[]>(this.endPoint);
  }

  // Agrega también el método para procesar el pago si aún no lo tienes:
  pagarCompra(compraId: number, metodoPagoId: number): Observable<any> {
    return this.http.put(
      `${this.endPoint}/${compraId}/pagar?metodoPagoId=${metodoPagoId}`,
      {},
    );
  }

  private manejarError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(
      () => new Error('Error en la comunicación con el servidor'),
    );
  }
}
