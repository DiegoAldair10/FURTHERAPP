import { DetailPurchase } from "./detailPurchase";

export interface Purchase {

  compraId?: number;

  proveedorId: number;

  proveedorNombre?: string;

  fechaCompra: string;

  tipoComprobante: string;

  serie: string;

  numero: string;

  moneda: string;

  subtotal: number;

  igv: number;

  totalCompra: number;

  estado: string;

  estadoPago: string;

  fechaCreacion?: string;

  detalles: DetailPurchase[];

}