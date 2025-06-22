import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Supplier } from '../model/supplier';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private endPoint = 'http://localhost:8090/api/proveedores';

  constructor(private http: HttpClient) {}

  getSupplier(): Observable<Supplier[]> {
    return this.http
      .get<Supplier[]>(this.endPoint)
      .pipe(catchError(this.manejarError));
  }

  getSuppliersId(id: number): Observable<Supplier> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de proveedor no válido'));
    }
    return this.http
      .get<Supplier>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  createSuppliers(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.endPoint, supplier).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          console.warn('⚠️ Validación fallida (400):', error.error);
          return throwError(
            () => new Error('Datos inválidos. Verifique el formulario.')
          );
        }

        if (error.status === 409) {
          console.warn('⚠️ Proveedor duplicado:', error.error);
          return throwError(
            () => new Error('Ya existe un proveedor con ese email.')
          );
        }

        const mensaje =
          error.error?.mensaje ||
          'Error desconocido en la creación del proveedor';
        console.error('❌ Error al crear proveedor:', mensaje);
        return throwError(() => new Error(mensaje));
      })
    );
  }

  updateSuppliers(id: number, supplier: Supplier): Observable<Supplier> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de cliente no válido'));
    }
    return this.http
      .put<Supplier>(`${this.endPoint}/${id}`, supplier)
      .pipe(catchError(this.manejarError));
  }

  deleteSuppliers(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de proveedor no válido'));
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
