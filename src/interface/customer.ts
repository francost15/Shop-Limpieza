export interface Customer {
  id_cliente: number;
  id_usuario: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  status: "activo" | "inactivo";
}
