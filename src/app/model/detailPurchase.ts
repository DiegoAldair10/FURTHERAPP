import { Product } from "./product";

export interface DetailPurchase {

  detalleCompraId?: number;

  productoId: number;

  productoNombre?: string;

  producto?: Product;

  cantidad: number;

  precioUnitario: number;

  subtotal: number;

}