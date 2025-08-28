import { DetailSale } from './detailSale';


export interface Sales {
  ventaId: number;
  clienteId: number;
  clienteNombre: string;
  empleadoId: number;
  empleadoNombre: string;
  fechaVenta: string;
  totalVenta: number;
  tipoComprobante: string;
  numeroComprobante: string;
  detalles: DetailSale[];
}