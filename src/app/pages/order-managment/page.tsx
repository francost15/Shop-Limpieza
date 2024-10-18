"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loading } from "@/components/ui/Loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Order {
  id_pedido: number
  id_cliente: number
  fecha_pedido: string
  total_pedido: number
  estado_pedido: "procesando" | "enviado" | "entregado"
  status: "activo" | "inactivo"
  empleado_mod: string
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/pedidos/')
      if (!response.ok) {
        throw new Error("Error al obtener los pedidos")
      }
      const data = await response.json()
      console.log("Datos de pedidos:", data)
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Error al obtener los pedidos")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (id: number, newStatus: Order['estado_pedido']) => {
    const updatedOrders = orders.map(order =>
      order.id_pedido === id
        ? { ...order, estado_pedido: newStatus }
        : order
    )

    setOrders(updatedOrders)

    try {
      const response = await fetch(`/api/pedidos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado_pedido: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el estado del pedido")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      setError("Error al actualizar el estado del pedido")
    }
  }

  const getStatusColor = (status: Order['estado_pedido']) => {
    switch (status) {
      case "procesando": return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "enviado": return "bg-purple-100 text-purple-800 border-purple-300"
      case "entregado": return "bg-green-100 text-green-800 border-green-300"
      default: return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const handleAddOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const newOrder: Order = {
      id_pedido: 0,
      id_cliente: Number(formData.get('id_cliente')),
      fecha_pedido: new Date().toISOString(),
      total_pedido: Number(formData.get('total_pedido')),
      estado_pedido: formData.get('estado_pedido') as Order['estado_pedido'],
      status: "activo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch('/api/pedidos/', {
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
      setOrders([...orders, createdOrder])
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
      id_pedido: currentOrder.id_pedido,
      id_cliente: Number(formData.get('id_cliente')),
      fecha_pedido: currentOrder.fecha_pedido,
      total_pedido: Number(formData.get('total_pedido')),
      estado_pedido: formData.get('estado_pedido') as Order['estado_pedido'],
      status: formData.get('status') as Order['status'],
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch(`/api/pedidos/${currentOrder.id_pedido}`, {
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
      setOrders(orders.map(o => o.id_pedido === updatedOrderData.id_pedido ? updatedOrderData : o))
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

  const openEditDialog = (order: Order) => {
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
                  <h2 className="text-xl font-semibold text-gray-800">Gestión de Pedidos</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Nuevo Pedido
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Pedido", "ID Cliente", "Fecha Pedido", "Total Pedido", "Estado Pedido", "Status", "Empleado Mod", "Acciones"].map((header) => (
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
                    {orders.map((order) => (
                      <TableRow key={order.id_pedido} className="hover:bg-gray-50">
                        <TableCell>{order.id_pedido}</TableCell>
                        <TableCell>{order.id_cliente}</TableCell>
                        <TableCell>{new Date(order.fecha_pedido).toLocaleDateString()}</TableCell>
                        <TableCell>${order.total_pedido.toFixed(2)}</TableCell>
                        <TableCell>
                          <Select
                            onValueChange={(value) => updateOrderStatus(order.id_pedido, value as Order['estado_pedido'])}
                            defaultValue={order.estado_pedido}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue>
                                <Badge 
                                  variant="outline"
                                  className={getStatusColor(order.estado_pedido)}
                                >
                                  {order.estado_pedido}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="procesando">En Proceso</SelectItem>
                              <SelectItem value="enviado">Enviado</SelectItem>
                              <SelectItem value="entregado">Entregado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                            <Badge variant={order.status === "activo" ? "default" : "destructive"}>
                              {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{order.empleado_mod}</TableCell>
                        <TableCell>
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
                <Label htmlFor="total_pedido" className="text-right">
                  Total Pedido
                </Label>
                <Input id="total_pedido" name="total_pedido" type="number" step="0.01" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estado_pedido" className="text-right">
                  Estado Pedido
                </Label>
                <Select  name="estado_pedido" defaultValue={currentOrder?.estado_pedido} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="procesando">En Proceso</SelectItem>
                    <SelectItem value="enviado">Enviado</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
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
          {currentOrder && (
            <form onSubmit={handleEditOrder}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id_cliente" className="text-right">
                    ID Cliente
                  </Label>
                  <Input id="id_cliente" name="id_cliente" type="number" defaultValue={currentOrder.id_cliente} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="total_pedido" className="text-right">
                    Total Pedido
                  </Label>
                  <Input id="total_pedido" name="total_pedido" type="number" step="0.01" defaultValue={currentOrder.total_pedido} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estado_pedido" className="text-right">
                    Estado Pedido
                  </Label>
                  <Select name="estado_pedido" defaultValue={currentOrder.estado_pedido} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="procesando">En Proceso</SelectItem>
                      <SelectItem value="enviado">Enviado</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select name="status" defaultValue={currentOrder.status}  required>
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
                  <Input id="empleado_mod" name="empleado_mod" defaultValue={currentOrder.empleado_mod} className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Actualizando..." : "Actualizar Pedido"}
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