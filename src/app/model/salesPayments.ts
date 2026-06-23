import { DetailSale } from './detailSale';

export interface  SalesPayments {
  pagoId: number;
  ventaId: number;
  numeroComprobante: string;
  tipoComprobante: string;
  clienteId: number;
  clienteNombre: string;
  empleadoId: number;
  empleadoNombre: string;
  estado: string;
  estadoPago: string;
  fechaVenta: string;
  totalVenta: number;
  detalles: DetailSale[];
  metodoPagoId: number;
  nombre: string;
  monto: number;
  fecha_Pago: string;
}
