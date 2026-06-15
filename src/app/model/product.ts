export interface Product {
  [x: string]: any;
  productoId: number;
  nombre: string;
  descripcion: string;
  categoriaId: number;
  precio_venta: number;
  costo_promedio: number;
  estado: string;
  stock: number;
  fecha_Creacion: Date;
}
