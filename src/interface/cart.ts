export interface Cart {
  id_carrito: number;
  id_cliente: number;
  fecha_creacion: string;
  total: number;
  estado: string;
  status: "activo" | "inactivo";
  empleado_mod: string;
}
