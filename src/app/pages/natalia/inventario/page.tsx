"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/Loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Inventario {
  cantidad: number;
  fecha_creac: string;
  fecha_mod: string | null;
  inventario_id: number;
  producto_id: number;
  status: "A" | "I";
  usuario_mod: string | null;
}

export default function InventarioManagement() {
  const [inventarios, setInventarios] = useState<Inventario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentInventario, setCurrentInventario] = useState<Inventario | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInventarios = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_NATALIA}/inventario`)
        if (!response.ok) {
          throw new Error("Error al obtener los inventarios")
        }
        const data = await response.json()
        setInventarios(data)
      } catch (error) {
        console.error("Error fetching inventarios:", error)
        setError("Error al obtener los inventarios")
      } finally {
        setLoading(false)
      }
    }

    fetchInventarios()
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
                  <h2 className="text-xl font-semibold text-gray-800">Gestión de Inventarios</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Nuevo Inventario
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Inventario", "ID Producto", "Cantidad", "Fecha Creación", "Fecha Modificación", "Status", "Usuario Mod", "Acciones"].map((header) => (
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
                    {inventarios.map((inventario) => (
                      <TableRow key={inventario.inventario_id} className="hover:bg-gray-50">
                        <TableCell>{inventario.inventario_id}</TableCell>
                        <TableCell>{inventario.producto_id}</TableCell>
                        <TableCell>{inventario.cantidad}</TableCell>
                        <TableCell>{new Date(inventario.fecha_creac).toLocaleDateString()}</TableCell>
                        <TableCell>{inventario.fecha_mod ? new Date(inventario.fecha_mod).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={inventario.status === "A" ? "default" : "destructive"}>
                            {inventario.status === "A" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{inventario.usuario_mod || "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setCurrentInventario(inventario)}>
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
            <DialogTitle>Agregar Nuevo Inventario</DialogTitle>
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
                <Label htmlFor="cantidad" className="text-right">
                  Cantidad
                </Label>
                <Input id="cantidad" name="cantidad" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select id="status" name="status" className="col-span-3" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Activo</SelectItem>
                    <SelectItem value="I">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usuario_mod" className="text-right">
                  Usuario Mod
                </Label>
                <Input id="usuario_mod" name="usuario_mod" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Inventario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Inventario</DialogTitle>
          </DialogHeader>
          {currentInventario && (
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="producto_id" className="text-right">
                    ID Producto
                  </Label>
                  <Input id="producto_id" name="producto_id" type="number" defaultValue={currentInventario.producto_id} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cantidad" className="text-right">
                    Cantidad
                  </Label>
                  <Input id="cantidad" name="cantidad" type="number" defaultValue={currentInventario.cantidad} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select id="status" name="status" defaultValue={currentInventario.status} className="col-span-3" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Activo</SelectItem>
                      <SelectItem value="I">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="usuario_mod" className="text-right">
                    Usuario Mod
                  </Label>
                  <Input id="usuario_mod" name="usuario_mod" defaultValue={currentInventario.usuario_mod || ""} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Actualizando..." : "Actualizar Inventario"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}