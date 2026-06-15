import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private endPoint = 'http://localhost:8090/api/productos';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.endPoint)
      .pipe(catchError(this.manejarError));
  }

  getProductsId(id: number): Observable<Product> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de producto no válido'));
    }
    return this.http
      .get<Product>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  createProducts(products: Product): Observable<Product> {
    return this.http.post<Product>(this.endPoint, products).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          console.warn('⚠️ Validación fallida (400):', error.error);
          return throwError(
            () => new Error('Datos inválidos. Verifique el formulario.')
          );
        }

        if (error.status === 409) {
          console.warn('⚠️ Producto duplicado:', error.error);
          return throwError(
            () => new Error('Ya existe un producto con ese nombre.')
          );
        }

        const mensaje =
          error.error?.mensaje ||
          'Error desconocido en la creación del producto';
        console.error('❌ Error al crear producto:', mensaje);
        return throwError(() => new Error(mensaje));
      })
    );
  }
  updateProducts(id: number, products: Product): Observable<Product> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de empleado no válido'));
    }
    return this.http
      .put<Product>(`${this.endPoint}/${id}`, products)
      .pipe(catchError(this.manejarError));
  }

  deleteProducts(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de producto no válido'));
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
