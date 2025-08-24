import { DetailSale } from './detailSale';


export interface Sales {
  ventaId: number;
  clienteId: number;
  clienteNombre: string;
  empleadoId: number;
  empleadoNombre: string;
  fechaVenta: string;
  totalVenta: number;
  detalles: DetailSale[];
}