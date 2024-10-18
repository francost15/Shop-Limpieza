export interface CartDetail {
  id_detalle_carrito: number;
  id_carrito: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  total: number;
  status: "activo" | "inactivo";
  empleado_mod: string;
}
