"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/Loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface Promocion {
  descripcion: string;
  fecha_creac: string;
  fecha_fin: string;
  fecha_inicio: string;
  fecha_mod: string | null;
  nombre_promocion: string;
  porcentaje_descuento: string;
  promocion_id: number;
  status: "A" | "I";
  usuario_mod: string | null;
}

export default function PromocionManagement() {
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPromocion, setCurrentPromocion] = useState<Promocion | null>(null)

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_NATALIA}/promocion`)
        if (!response.ok) {
          throw new Error("Error al obtener las promociones")
        }
        const data = await response.json()
        setPromociones(data)
      } catch (error) {
        console.error("Error fetching promociones:", error)
        setError("Error al obtener las promociones")
      } finally {
        setLoading(false)
      }
    }

    fetchPromociones()
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
                  <h2 className="text-xl font-semibold text-gray-800">Gestión de Promociones</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Nueva Promoción
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Promoción", "Nombre", "Descripción", "Porcentaje Descuento", "Fecha Inicio", "Fecha Fin", "Fecha Creación", "Fecha Modificación", "Status", "Usuario Mod", "Acciones"].map((header) => (
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
                    {promociones.map((promocion) => (
                      <TableRow key={promocion.promocion_id} className="hover:bg-gray-50">
                        <TableCell>{promocion.promocion_id}</TableCell>
                        <TableCell>{promocion.nombre_promocion}</TableCell>
                        <TableCell>{promocion.descripcion}</TableCell>
                        <TableCell>{promocion.porcentaje_descuento}</TableCell>
                        <TableCell>{new Date(promocion.fecha_inicio).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(promocion.fecha_fin).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(promocion.fecha_creac).toLocaleDateString()}</TableCell>
                        <TableCell>{promocion.fecha_mod ? new Date(promocion.fecha_mod).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={promocion.status === "A" ? "default" : "destructive"}>
                            {promocion.status === "A" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{promocion.usuario_mod || "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setCurrentPromocion(promocion)}>
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
            <DialogTitle>Agregar Nueva Promoción</DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre_promocion" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre_promocion" name="nombre_promocion" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descripcion" className="text-right">
                  Descripción
                </Label>
                <Input id="descripcion" name="descripcion" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="porcentaje_descuento" className="text-right">
                  Porcentaje Descuento
                </Label>
                <Input id="porcentaje_descuento" name="porcentaje_descuento" type="number" step="0.01" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha_inicio" className="text-right">
                  Fecha Inicio
                </Label>
                <Input id="fecha_inicio" name="fecha_inicio" type="date" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha_fin" className="text-right">
                  Fecha Fin
                </Label>
                <Input id="fecha_fin" name="fecha_fin" type="date" className="col-span-3" required />
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
            <DialogTitle>Editar Promoción</DialogTitle>
          </DialogHeader>
          {currentPromocion && (
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre_promocion" className="text-right">
                    Nombre
                  </Label>
                  <Input id="nombre_promocion" name="nombre_promocion" defaultValue={currentPromocion.nombre_promocion} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Input id="descripcion" name="descripcion" defaultValue={currentPromocion.descripcion} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="porcentaje_descuento" className="text-right">
                    Porcentaje Descuento
                  </Label>
                  <Input id="porcentaje_descuento" name="porcentaje_descuento" type="number" step="0.01" defaultValue={currentPromocion.porcentaje_descuento} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fecha_inicio" className="text-right">
                    Fecha Inicio
                  </Label>
                  <Input id="fecha_inicio" name="fecha_inicio" type="date" defaultValue={new Date(currentPromocion.fecha_inicio).toISOString().split('T')[0]} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fecha_fin" className="text-right">
                    Fecha Fin
                  </Label>
                  <Input id="fecha_fin" name="fecha_fin" type="date" defaultValue={new Date(currentPromocion.fecha_fin).toISOString().split('T')[0]} className="col-span-3" required />
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
                  <Input id="usuario_mod" name="usuario_mod" defaultValue={currentPromocion.usuario_mod || ""} className="col-span-3" />
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