import { Product } from "./product";

export interface DetailSale {
  detalleVentaId: number;
  producto: Product; 
  cantidad: number;
  precioUnitario: number;
}