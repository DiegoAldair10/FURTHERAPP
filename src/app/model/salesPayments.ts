import { DetailSale } from './detailSale';
import { Payment } from './payment';
import { Sales } from './sales';

export interface SalesPayments {
  pagosId: number;
  ventaId: number;
  numeroComprobante: string;
  tipoComprobante: string;
  clienteId: number;
  clienteNombre: string;
  empleadoId: number;
  empleadoNombre: string;
  fechaVenta: string;
  totalVenta: number;
  detalles: DetailSale[];
  metodoPagoId: number;
  nombre: string;
  monto: number;
  fechaPago: string;
}
