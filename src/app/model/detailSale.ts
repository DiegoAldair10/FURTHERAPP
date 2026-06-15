import { Product } from "./product";

export interface DetailSale {
  detalleVentaId: number;
  productoId?: number;
  productoNombre?: string;
  producto?: Product;
  cantidad: number;
  precioUnitario: number;
  subTotal?: number;
}