import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VentaUtilsService {
  readonly IGV_RATE = 0.18;

  calcularMontos(detalles: any[]): { subTotal: number; igv: number; total: number } {
    const subTotal = detalles.reduce(
      (acc: number, d: any) => acc + d.cantidad * d.precioUnitario,
      0
    );
    const igv = subTotal * this.IGV_RATE;
    const total = subTotal + igv;
    return { subTotal, igv, total };
  }
}
