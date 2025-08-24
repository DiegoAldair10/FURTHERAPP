import { Product } from "./product";

export interface DetailSale {
  detalleVentaId: number;
  productoNombre?: string;
  producto?: Product; 
  cantidad: number;
  precioUnitario: number;
}