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
import { CartDetail } from "@/interface/cartdetail"

export default function CartDetails() {
  const [cartDetails, setCartDetails] = useState<CartDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentDetail, setCurrentDetail] = useState<CartDetail | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cantidad, setCantidad] = useState(0)
  const [precioUnitario, setPrecioUnitario] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    fetchCartDetails()
  }, [])

  const fetchCartDetails = async () => {
    try {
      const response = await fetch('/api/detalles_carrito/')
      if (!response.ok) {
        throw new Error("Error al obtener los detalles del carrito")
      }
      const data = await response.json()
      console.log("Datos de detalles del carrito:", data)
      setCartDetails(data)
    } catch (error) {
      console.error("Error fetching cart details:", error)
      setError("Error al obtener los detalles del carrito")
    } finally {
      setLoading(false)
    }
  }


  const handleAddDetail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const newDetail: CartDetail = {
      id_detalle_carrito: 0,
      id_carrito: Number(formData.get('id_carrito')),
      id_producto: Number(formData.get('id_producto')),
      cantidad: Number(formData.get('cantidad')),
      precio_unitario: Number(formData.get('precio_unitario')),
      total: Number(formData.get('cantidad')) * Number(formData.get('precio_unitario')),
      status: "activo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch('/api/detalles_carrito/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDetail),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al crear el detalle del carrito')
      }

      const createdDetail = await response.json()
      setCartDetails([...cartDetails, createdDetail])
      setIsAddDialogOpen(false)
      toast({
        title: "Detalle agregado",
        description: "El nuevo detalle del carrito se ha agregado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error creating cart detail:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el detalle del carrito.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditDetail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentDetail) return
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const updatedDetail = {
      id_detalle_carrito: currentDetail.id_detalle_carrito,
      id_carrito: Number(formData.get('id_carrito')),
      id_producto: Number(formData.get('id_producto')),
      cantidad: Number(formData.get('cantidad')),
      precio_unitario: Number(formData.get('precio_unitario')),
      total: Number(formData.get('cantidad')) * Number(formData.get('precio_unitario')),
      status: formData.get('status') as "activo" | "inactivo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch(`/api/detalles_carrito/${currentDetail.id_detalle_carrito}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDetail),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al actualizar el detalle del carrito')
      }

      const updatedDetailData = await response.json()
      setCartDetails(cartDetails.map(d => d.id_detalle_carrito === updatedDetailData.id_detalle_carrito ? updatedDetailData : d))
      setIsEditDialogOpen(false)
      setCurrentDetail(null)
      toast({
        title: "Detalle actualizado",
        description: "Los datos del detalle del carrito se han actualizado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating cart detail:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el detalle del carrito.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (detail: CartDetail) => {
    setCurrentDetail(detail)
    setIsEditDialogOpen(true)
  }

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(Number(e.target.value))
  }

  const handlePrecioUnitarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrecioUnitario(Number(e.target.value))
  }

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
                  <h2 className="text-xl font-semibold text-gray-800">Detalles del Carrito</h2>
                  <Button className="bg-neutral-900 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Agregar Detalle
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Detalle", "ID Carrito", "ID Producto", "Cantidad", "Precio Unitario", "Total", "Status", "Empleado Mod", "Acciones"].map((header) => (
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
                    {cartDetails.map((detail) => (
                      <TableRow key={detail.id_detalle_carrito} className="hover:bg-gray-50">
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{detail.id_detalle_carrito}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{detail.id_carrito}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{detail.id_producto}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{detail.cantidad}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${detail.precio_unitario.toFixed(2)}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${detail.total.toFixed(2)}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <Badge variant={detail.status === "activo" ? "default" : "destructive"}>
                              {detail.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{detail.empleado_mod}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(detail)}>
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
            <DialogTitle>Agregar Nuevo Detalle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDetail}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_carrito" className="text-right">
                  ID Carrito
                </Label>
                <Input id="id_carrito" name="id_carrito" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_producto" className="text-right">
                  ID Producto
                </Label>
                <Input id="id_producto" name="id_producto" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cantidad" className="text-right">
                  Cantidad
                </Label>
                <Input id="cantidad" name="cantidad" type="number" className="col-span-3" value={cantidad} onChange={handleCantidadChange} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precio_unitario" className="text-right">
                  Precio Unitario
                </Label>
                <Input id="precio_unitario" name="precio_unitario" type="number" step="0.01" className="col-span-3" value={precioUnitario} onChange={handlePrecioUnitarioChange} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total" className="text-right">
                  Total
                </Label>
                <Input id="total" name="total" type="number" step="0.01" className="col-span-3" value={cantidad * precioUnitario} readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="empleado_mod" className="text-right">
                  Empleado Mod
                </Label>
                <Input id="empleado_mod" name="empleado_mod" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Detalle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Detalle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditDetail}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_carrito" className="text-right">
                  ID Carrito
                </Label>
                <Input id="id_carrito" name="id_carrito" type="number" defaultValue={currentDetail?.id_carrito} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_producto" className="text-right">
                  ID Producto
                </Label>
                <Input id="id_producto" name="id_producto" type="number" defaultValue={currentDetail?.id_producto} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cantidad" className="text-right">
                  Cantidad
                </Label>
                <Input id="cantidad" name="cantidad" type="number" defaultValue={currentDetail?.cantidad} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precio_unitario" className="text-right">
                  Precio Unitario
                </Label>
                <Input id="precio_unitario" name="precio_unitario" type="number" step="0.01" defaultValue={currentDetail?.precio_unitario} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={currentDetail?.status} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="empleado_mod" className="text-right">
                  Empleado Mod
                </Label>
                <Input id="empleado_mod" name="empleado_mod" defaultValue={currentDetail?.empleado_mod} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Actualizando..." : "Actualizar Detalle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}