export interface Producto {
    codigo: string;
    nombre: string;
    fo_categoria: number;
    valor_compra: number;
    valor_venta: number;
    stock: number;
    venta_al_publico: number | null; // Permitir null
    fo_proveedor: number;
}