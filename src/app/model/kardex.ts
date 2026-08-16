export interface Kardex{
    movId:number;
    productoId:number;
    producto:string;
    fecha:string;
    tipoMov:string;
    origen:string;
    cantidad:number;
    stockAnterior:number;
    stockNuevo:number;
    observacion:string;
}