export interface Product {
  productoId: number;
  nombre: string;
  descripcion: string;
  precio: DoubleRange;
  categoria: string;
  stock: BigInteger;
  fechaCreacion: Date;
}
