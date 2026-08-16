import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Kardex } from '../model/kardex';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class InventoryReportsService {

  private url = 'http://localhost:8090/api/inventario';

  constructor(private http: HttpClient) {}

  listarKardex(): Observable<Kardex[]> {
    return this.http.get<Kardex[]>(`${this.url}/kardex`);
  }
buscarKardex(
  productoId?: number,
  tipoMov?: string,
  fechaInicio?: string,
  fechaFin?: string
): Observable<Kardex[]> {

  let params = new HttpParams();

  if (productoId) {
    params = params.set('productoId', productoId);
  }

  if (tipoMov) {
    params = params.set('tipoMov', tipoMov);
  }

  if (fechaInicio) {
    params = params.set('fechaInicio', fechaInicio);
  }

  if (fechaFin) {
    params = params.set('fechaFin', fechaFin);
  }

  return this.http.get<Kardex[]>(
      `${this.url}/kardex`,
      { params });
}

  listarProductos(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/productos`);
  }


}