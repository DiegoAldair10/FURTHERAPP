import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
 private endPoint = 'http://localhost:8090/api/categoria';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.endPoint)
      .pipe(catchError(this.manejarError));
  }

  getCategoryId(id: number): Observable<Category> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de categoria no válido'));
    }
    return this.http
      .get<Category>(`${this.endPoint}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.endPoint, category).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          console.warn('⚠️ Validación fallida (400):', error.error);
          return throwError(
            () => new Error('Datos inválidos. Verifique el formulario.')
          );
        }

       
        const mensaje =
          error.error?.mensaje ||
          'Error desconocido en la creación de la categoría';
        console.error('❌ Error al crear categoría:', mensaje);
        return throwError(() => new Error(mensaje));
      })
    );
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de categoria no válido'));
    }
    return this.http
      .put<Category>(`${this.endPoint}/${id}`, category)
      .pipe(catchError(this.manejarError));
  }

  deleteCategory(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de categoria no válido'));
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
