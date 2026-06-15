import { DetailSale } from './detailSale';

export interface Sales {
  ventaId: number;
  clienteId: number;
  clienteNombre: string;
  empleadoId: number;
  empleadoNombre: string;
  fechaVenta: string;
  tipoComprobante: string;
  serie: string;
  numeroComprobante: string;
  moneda: string;
  subTotal: number;
  igv: number;
  total: number;
  estado: string;
  estadoPago: string;
  fecha_Creacion: string;
  detalles: DetailSale[];
}
