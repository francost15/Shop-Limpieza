export interface OrderDetail {
  id_detalle_pedido: number;
  id_pedido: number;
  id_producto: number;
  id_pago: number;
  cantidad: number;
  precio_unitario: number;
  status: "activo" | "inactivo";
  empleado_mod: string;
}
