"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/Loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface Proveedor {
  correo: string;
  direccion: string;
  fecha_creac: string | null;
  fecha_mod: string | null;
  nombre_contacto: string;
  nombre_proveedor: string;
  proveedor_id: number;
  status: "A" | "I";
  telefono: string;
  usuario_mod: string | null;
}

export default function ProveedorManagement() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProveedor, setCurrentProveedor] = useState<Proveedor | null>(null)
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_NATALIA}/proveedor`)
        if (!response.ok) {
          throw new Error("Error al obtener los proveedores")
        }
        const data = await response.json()
        setProveedores(data)
      } catch (error) {
        console.error("Error fetching proveedores:", error)
        setError("Error al obtener los proveedores")
      } finally {
        setLoading(false)
      }
    }

    fetchProveedores()
  }, [])

  if (loading) return <Loading />
  if (error) return <p>{error}</p>

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-100 p-4 ml-12">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Gestión de Proveedores</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Nuevo Proveedor
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Proveedor", "Nombre Proveedor", "Nombre Contacto", "Correo", "Teléfono", "Dirección", "Fecha Creación", "Fecha Modificación", "Status", "Usuario Mod", "Acciones"].map((header) => (
                        <TableHead
                          key={header}
                          className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proveedores.map((proveedor) => (
                      <TableRow key={proveedor.proveedor_id} className="hover:bg-gray-50">
                        <TableCell>{proveedor.proveedor_id}</TableCell>
                        <TableCell>{proveedor.nombre_proveedor}</TableCell>
                        <TableCell>{proveedor.nombre_contacto}</TableCell>
                        <TableCell>{proveedor.correo}</TableCell>
                        <TableCell>{proveedor.telefono}</TableCell>
                        <TableCell>{proveedor.direccion}</TableCell>
                        <TableCell>{proveedor.fecha_creac ? new Date(proveedor.fecha_creac).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>{proveedor.fecha_mod ? new Date(proveedor.fecha_mod).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={proveedor.status === "A" ? "default" : "destructive"}>
                            {proveedor.status === "A" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{proveedor.usuario_mod || "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setCurrentProveedor(proveedor)}>
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre_proveedor" className="text-right">
                  Nombre Proveedor
                </Label>
                <Input id="nombre_proveedor" name="nombre_proveedor" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre_contacto" className="text-right">
                  Nombre Contacto
                </Label>
                <Input id="nombre_contacto" name="nombre_contacto" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="correo" className="text-right">
                  Correo
                </Label>
                <Input id="correo" name="correo" type="email" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefono" className="text-right">
                  Teléfono
                </Label>
                <Input id="telefono" name="telefono" type="tel" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direccion" className="text-right">
                  Dirección
                </Label>
                <Input id="direccion" name="direccion" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
             
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usuario_mod" className="text-right">
                  Usuario Mod
                </Label>
                <Input id="usuario_mod" name="usuario_mod" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
            
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
          </DialogHeader>
          {currentProveedor && (
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre_proveedor" className="text-right">
                    Nombre Proveedor
                  </Label>
                  <Input id="nombre_proveedor" name="nombre_proveedor" defaultValue={currentProveedor.nombre_proveedor} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre_contacto" className="text-right">
                    Nombre Contacto
                  </Label>
                  <Input id="nombre_contacto" name="nombre_contacto" defaultValue={currentProveedor.nombre_contacto} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="correo" className="text-right">
                    Correo
                  </Label>
                  <Input id="correo" name="correo" type="email" defaultValue={currentProveedor.correo} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="telefono" className="text-right">
                    Teléfono
                  </Label>
                  <Input id="telefono" name="telefono" type="tel" defaultValue={currentProveedor.telefono} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="direccion" className="text-right">
                    Dirección
                  </Label>
                  <Input id="direccion" name="direccion" defaultValue={currentProveedor.direccion} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="usuario_mod" className="text-right">
                    Usuario Mod
                  </Label>
                  <Input id="usuario_mod" name="usuario_mod" defaultValue={currentProveedor.usuario_mod || ""} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
             
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}