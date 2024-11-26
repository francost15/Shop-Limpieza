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

export interface CategoriaSuperficieProducto {
  categoria_superficie_producto_id: number;
  fecha_creac: string;
  fecha_mod: string | null;
  status: "A" | "I";
  superficie_descripcion: string;
  superficie_nombre: string;
  usuario_mod: string | null;
}

export default function CategoriaSuperficieProductoManagement() {
  const [categoriasSuperficie, setCategoriasSuperficie] = useState<CategoriaSuperficieProducto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCategoriaSuperficie, setCurrentCategoriaSuperficie] = useState<CategoriaSuperficieProducto | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategoriasSuperficie = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_NATALIA}/categoria_superficie_producto`)
        if (!response.ok) {
          throw new Error("Error al obtener las categorías de superficies de productos")
        }
        const data = await response.json()
        setCategoriasSuperficie(data)
      } catch (error) {
        console.error("Error fetching categorias superficie:", error)
        setError("Error al obtener las categorías de superficies de productos")
      } finally {
        setLoading(false)
      }
    }

    fetchCategoriasSuperficie()
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
                  <h2 className="text-xl font-semibold text-gray-800">Gestión de Categorías de Superficies de Productos</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Nueva Categoría de Superficie
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Categoría Superficie", "Nombre Superficie", "Descripción", "Fecha Creación", "Fecha Modificación", "Status", "Usuario Mod", "Acciones"].map((header) => (
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
                    {categoriasSuperficie.map((categoriaSuperficie) => (
                      <TableRow key={categoriaSuperficie.categoria_superficie_producto_id} className="hover:bg-gray-50">
                        <TableCell>{categoriaSuperficie.categoria_superficie_producto_id}</TableCell>
                        <TableCell>{categoriaSuperficie.superficie_nombre}</TableCell>
                        <TableCell>{categoriaSuperficie.superficie_descripcion}</TableCell>
                        <TableCell>{new Date(categoriaSuperficie.fecha_creac).toLocaleDateString()}</TableCell>
                        <TableCell>{categoriaSuperficie.fecha_mod ? new Date(categoriaSuperficie.fecha_mod).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={categoriaSuperficie.status === "A" ? "default" : "destructive"}>
                            {categoriaSuperficie.status === "A" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{categoriaSuperficie.usuario_mod || "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setCurrentCategoriaSuperficie(categoriaSuperficie)}>
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
            <DialogTitle>Agregar Nueva Categoría de Superficie</DialogTitle>
          </DialogHeader>
          <form>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="superficie_nombre" className="text-right">
                  Nombre Superficie
                </Label>
                <Input id="superficie_nombre" name="superficie_nombre" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="superficie_descripcion" className="text-right">
                  Descripción
                </Label>
                <Input id="superficie_descripcion" name="superficie_descripcion" className="col-span-3" required />
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
                {isSubmitting ? "Guardando..." : "Guardar Categoría de Superficie"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría de Superficie</DialogTitle>
          </DialogHeader>
          {currentCategoriaSuperficie && (
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="superficie_nombre" className="text-right">
                    Nombre Superficie
                  </Label>
                  <Input id="superficie_nombre" name="superficie_nombre" defaultValue={currentCategoriaSuperficie.superficie_nombre} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="superficie_descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Input id="superficie_descripcion" name="superficie_descripcion" defaultValue={currentCategoriaSuperficie.superficie_descripcion} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select id="status" name="status" defaultValue={currentCategoriaSuperficie.status} className="col-span-3" required>
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
                  <Input id="usuario_mod" name="usuario_mod" defaultValue={currentCategoriaSuperficie.usuario_mod || ""} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Actualizando..." : "Actualizar Categoría de Superficie"}
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