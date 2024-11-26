"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/Loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface Producto {
  categoria_id: number;
  categoria_superficie_producto_id: number;
  descripcion: string;
  fecha_creac: string;
  fecha_mod: string | null;
  nombre: string;
  precio: string;
  producto_id: number;
  status: "A" | "I";
  usuario_mod: string | null;
}

export default function ProductoManagement() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProducto, setCurrentProducto] = useState<Producto | null>(null)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_NATALIA}/producto`)
        if (!response.ok) {
          throw new Error("Error al obtener los productos")
        }
        const data = await response.json()
        setProductos(data)
      } catch (error) {
        console.error("Error fetching productos:", error)
        setError("Error al obtener los productos")
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()
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
                  <h2 className="text-xl font-semibold text-gray-800">Gestión de Productos</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Nuevo Producto
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Producto", "Nombre", "Descripción", "Precio", "ID Categoría", "ID Superficie", "Fecha Creación", "Fecha Modificación", "Status", "Usuario Mod", "Acciones"].map((header) => (
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
                    {productos.map((producto) => (
                      <TableRow key={producto.producto_id} className="hover:bg-gray-50">
                        <TableCell>{producto.producto_id}</TableCell>
                        <TableCell>{producto.nombre}</TableCell>
                        <TableCell>{producto.descripcion}</TableCell>
                        <TableCell>{producto.precio}</TableCell>
                        <TableCell>{producto.categoria_id}</TableCell>
                        <TableCell>{producto.categoria_superficie_producto_id}</TableCell>
                        <TableCell>{new Date(producto.fecha_creac).toLocaleDateString()}</TableCell>
                        <TableCell>{producto.fecha_mod ? new Date(producto.fecha_mod).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={producto.status === "A" ? "default" : "destructive"}>
                            {producto.status === "A" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{producto.usuario_mod || "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setCurrentProducto(producto)}>
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
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre" name="nombre" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descripcion" className="text-right">
                  Descripción
                </Label>
                <Input id="descripcion" name="descripcion" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precio" className="text-right">
                  Precio
                </Label>
                <Input id="precio" name="precio" type="number" step="0.01" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoria_id" className="text-right">
                  ID Categoría
                </Label>
                <Input id="categoria_id" name="categoria_id" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoria_superficie_producto_id" className="text-right">
                  ID Superficie
                </Label>
                <Input id="categoria_superficie_producto_id" name="categoria_superficie_producto_id" type="number" className="col-span-3" required />
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
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {currentProducto && (
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input id="nombre" name="nombre" defaultValue={currentProducto.nombre} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Input id="descripcion" name="descripcion" defaultValue={currentProducto.descripcion} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="precio" className="text-right">
                    Precio
                  </Label>
                  <Input id="precio" name="precio" type="number" step="0.01" defaultValue={currentProducto.precio} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoria_id" className="text-right">
                    ID Categoría
                  </Label>
                  <Input id="categoria_id" name="categoria_id" type="number" defaultValue={currentProducto.categoria_id} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoria_superficie_producto_id" className="text-right">
                    ID Superficie
                  </Label>
                  <Input id="categoria_superficie_producto_id" name="categoria_superficie_producto_id" type="number" defaultValue={currentProducto.categoria_superficie_producto_id} className="col-span-3" required />
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
                  <Input id="usuario_mod" name="usuario_mod" defaultValue={currentProducto.usuario_mod || ""} className="col-span-3" />
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