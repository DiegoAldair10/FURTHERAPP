import { DetailSale } from "./detailSale";

export interface Sales {
  ventaId: number;
  cliente: any;
  empleado: any;
  fechaVenta: string;
  totalVenta: number;
  detalles: DetailSale[];
}