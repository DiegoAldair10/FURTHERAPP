import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryDashboard } from '../model/InventoryDashboard';
import { MovimientoMes } from '../model/movimientoMes';
import { Kardex } from '../model/kardex';
import { ProductoStock } from '../model/productoStock';
import { StockCategoria } from '../model/stockCategoria';




@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private http = inject(HttpClient);

   private endPoint = 'http://localhost:8090/api/inventario';

  constructor() { }

  /**
   * Dashboard
   */
  obtenerDashboard(): Observable<InventoryDashboard> {
    return this.http.get<InventoryDashboard>(`${this.endPoint}/dashboard`);
  }

  /**
   * Entradas vs Salidas por mes
   */
  obtenerMovimientosMes(): Observable<MovimientoMes[]> {
    return this.http.get<MovimientoMes[]>(`${this.endPoint}/movimientos-mes`);
  }

  /**
   * Stock por categoría
   */
  obtenerStockCategoria(): Observable<StockCategoria[]> {
    return this.http.get<StockCategoria[]>(`${this.endPoint}/stock-categoria`);
  }

  /**
   * Productos con stock bajo
   */
  obtenerProductosStockBajo(): Observable<ProductoStock[]> {
    return this.http.get<ProductoStock[]>(`${this.endPoint}/productos-stock-bajo`);
  }

  /**
   * Últimos movimientos
   */
  obtenerUltimosMovimientos(): Observable<Kardex[]> {
    return this.http.get<Kardex[]>(`${this.endPoint}/ultimos-movimientos`);
  }

  /**
   * Kardex con filtros
   */
  obtenerKardex(
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
      `${this.endPoint}/kardex`,
      { params }
    );

  }

}