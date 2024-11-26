"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/Loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface PromocionProducto {
  fecha_creac: string;
  fecha_mod: string | null;
  producto_id: number;
  promocion_id: number;
  promocion_producto_id: number;
  status: "A" | "I";
  usuario_mod: string | null;
}

export default function PromocionProductoManagement() {
  const [promocionProductos, setPromocionProductos] = useState<PromocionProducto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPromocionProducto, setCurrentPromocionProducto] = useState<PromocionProducto | null>(null)

  useEffect(() => {
    const fetchPromocionProductos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_NATALIA}/promocion_producto`)
        if (!response.ok) {
          throw new Error("Error al obtener los productos en promoción")
        }
        const data = await response.json()
        setPromocionProductos(data)
      } catch (error) {
        console.error("Error fetching promocion productos:", error)
        setError("Error al obtener los productos en promoción")
      } finally {
        setLoading(false)
      }
    }

    fetchPromocionProductos()
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
                  <h2 className="text-xl font-semibold text-gray-800">Gestión de Productos en Promoción</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Nuevo Producto en Promoción
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Promoción Producto", "ID Producto", "ID Promoción", "Fecha Creación", "Fecha Modificación", "Status", "Usuario Mod", "Acciones"].map((header) => (
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
                    {promocionProductos.map((promocionProducto) => (
                      <TableRow key={promocionProducto.promocion_producto_id} className="hover:bg-gray-50">
                        <TableCell>{promocionProducto.promocion_producto_id}</TableCell>
                        <TableCell>{promocionProducto.producto_id}</TableCell>
                        <TableCell>{promocionProducto.promocion_id}</TableCell>
                        <TableCell>{new Date(promocionProducto.fecha_creac).toLocaleDateString()}</TableCell>
                        <TableCell>{promocionProducto.fecha_mod ? new Date(promocionProducto.fecha_mod).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={promocionProducto.status === "A" ? "default" : "destructive"}>
                            {promocionProducto.status === "A" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{promocionProducto.usuario_mod || "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setCurrentPromocionProducto(promocionProducto)}>
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
            <DialogTitle>Agregar Nuevo Producto en Promoción</DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="producto_id" className="text-right">
                  ID Producto
                </Label>
                <Input id="producto_id" name="producto_id" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="promocion_id" className="text-right">
                  ID Promoción
                </Label>
                <Input id="promocion_id" name="promocion_id" type="number" className="col-span-3" required />
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
            <DialogTitle>Editar Producto en Promoción</DialogTitle>
          </DialogHeader>
          {currentPromocionProducto && (
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="producto_id" className="text-right">
                    ID Producto
                  </Label>
                  <Input id="producto_id" name="producto_id" type="number" defaultValue={currentPromocionProducto.producto_id} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="promocion_id" className="text-right">
                    ID Promoción
                  </Label>
                  <Input id="promocion_id" name="promocion_id" type="number" defaultValue={currentPromocionProducto.promocion_id} className="col-span-3" required />
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
                  <Input id="usuario_mod" name="usuario_mod" defaultValue={currentPromocionProducto.usuario_mod || ""} className="col-span-3" />
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