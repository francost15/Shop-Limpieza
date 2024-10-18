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

export interface OrderHistory {
  id_historial: number;
  id_cliente: number;
  id_pedido: number;
  fecha_compra: string;
  total_compra: number;
  status: "activo" | "inactivo";
  empleado_mod: string;
}

export default function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<OrderHistory | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrderHistory()
  }, [])

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch('/api/historial_compras/')
      if (!response.ok) {
        throw new Error("Error al obtener el historial de pedidos")
      }
      const data = await response.json()
      console.log("Datos del historial de pedidos:", data)
      setOrderHistory(data)
    } catch (error) {
      console.error("Error fetching order history:", error)
      setError("Error al obtener el historial de pedidos")
    } finally {
      setLoading(false)
    }
  }

  const handleAddOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const newOrder: OrderHistory = {
      id_historial: 0,
      id_cliente: Number(formData.get('id_cliente')),
      id_pedido: Number(formData.get('id_pedido')),
      fecha_compra: new Date().toISOString(),
      total_compra: Number(formData.get('total_compra')),
      status: "activo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch('/api/historial_compras/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al crear el pedido')
      }

      const createdOrder = await response.json()
      setOrderHistory([...orderHistory, createdOrder])
      setIsAddDialogOpen(false)
      toast({
        title: "Pedido agregado",
        description: "El nuevo pedido se ha agregado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el pedido.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentOrder) return
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const updatedOrder = {
      id_historial: currentOrder.id_historial,
      id_cliente: Number(formData.get('id_cliente')),
      id_pedido: Number(formData.get('id_pedido')),
      fecha_compra: currentOrder.fecha_compra,
      total_compra: Number(formData.get('total_compra')),
      status: formData.get('status') as "activo" | "inactivo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch(`/api/historial_compras/${currentOrder.id_historial}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al actualizar el pedido')
      }

      const updatedOrderData = await response.json()
      setOrderHistory(orderHistory.map(o => o.id_historial === updatedOrderData.id_historial ? updatedOrderData : o))
      setIsEditDialogOpen(false)
      setCurrentOrder(null)
      toast({
        title: "Pedido actualizado",
        description: "Los datos del pedido se han actualizado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el pedido.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (order: OrderHistory) => {
    setCurrentOrder(order)
    setIsEditDialogOpen(true)
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
                  <h2 className="text-xl font-semibold text-gray-800">Historial de Pedidos</h2>
                  <Button className="bg-neutral-900 hover:bg-neutral-700 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Agregar Pedido
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Historial", "ID Cliente", "ID Pedido", "Fecha Compra", "Total Compra", "Status", "Empleado Mod", "Acciones"].map((header) => (
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
                    {orderHistory.map((order) => (
                      <TableRow key={order.id_historial} className="hover:bg-gray-50">
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.id_historial}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.id_cliente}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.id_pedido}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(order.fecha_compra).toLocaleDateString()}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${order.total_compra.toFixed(2)}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <Badge variant={order.status === "activo" ? "default" : "destructive"}>
                              {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.empleado_mod}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(order)}>
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
            <DialogTitle>Agregar Nuevo Pedido</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddOrder}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_cliente" className="text-right">
                  ID Cliente
                </Label>
                <Input id="id_cliente" name="id_cliente" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_pedido" className="text-right">
                  ID Pedido
                </Label>
                <Input id="id_pedido" name="id_pedido" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total_compra" className="text-right">
                  Total Compra
                </Label>
                <Input id="total_compra" name="total_compra" type="number" step="0.01" className="col-span-3" required />
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
                {isSubmitting ? "Guardando..." : "Guardar Pedido"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pedido</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditOrder}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_cliente" className="text-right">
                  ID Cliente
                </Label>
                <Input id="id_cliente" name="id_cliente" type="number" defaultValue={currentOrder?.id_cliente} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_pedido" className="text-right">
                  ID Pedido
                </Label>
                <Input id="id_pedido" name="id_pedido" type="number" defaultValue={currentOrder?.id_pedido} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total_compra" className="text-right">
                  Total Compra
                </Label>
                <Input id="total_compra" name="total_compra" type="number" step="0.01" defaultValue={currentOrder?.total_compra} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="empleado_mod" className="text-right">
                  Empleado Mod
                </Label>
                <Input id="empleado_mod" name="empleado_mod" defaultValue={currentOrder?.empleado_mod} className="col-span-3" required />
              </div>
              {/* status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={currentOrder?.status} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Actualizando..." : "Actualizar Pedido"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}