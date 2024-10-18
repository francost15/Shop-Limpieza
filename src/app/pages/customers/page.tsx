"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/Loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Customer } from "@/interface/customer"


export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Estado para manejar la carga
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/clientes/')
      if (!response.ok) {
        throw new Error("Error al obtener la lista de clientes")
      }
      const data = await response.json()
      console.log("Datos de clientes:", data)
      setCustomers(data)
    } catch (error) {
      console.error("Error fetching customers:", error)
      setError("Error al obtener la lista de clientes")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true) // Iniciar la animación de carga
    const formData = new FormData(event.currentTarget)
    const newCustomer: Customer = {
      id_cliente: 0,
      id_usuario: Number(formData.get('id_usuario')),
      nombre: formData.get('nombre') as string,
      apellidos: formData.get('apellidos') as string,
      telefono: formData.get('telefono') as string,
      direccion: formData.get('direccion') as string,
      status: "activo"
    }

    try {
      const response = await fetch('/api/clientes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al crear el cliente')
      }

      const createdCustomer = await response.json()
      setCustomers([...customers, createdCustomer])
      setIsAddDialogOpen(false)
      toast({
        title: "Cliente agregado",
        description: "El nuevo cliente se ha agregado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error creating customer:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el cliente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false) // Detener la animación de carga
    }
  }

  const handleEditCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentCustomer) return
    setIsSubmitting(true) // Iniciar la animación de carga

    const formData = new FormData(event.currentTarget)
    const updatedCustomer = {
      id_cliente: currentCustomer.id_cliente,
      id_usuario: Number(formData.get('id_usuario')),
      nombre: formData.get('nombre') as string,
      apellidos: formData.get('apellidos') as string,
      telefono: formData.get('telefono') as string,
      direccion: formData.get('direccion') as string,
      status: formData.get('status') as "activo" | "inactivo"
    }

    try {
      const response = await fetch(`/api/clientes/${currentCustomer.id_cliente}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al actualizar el cliente')
      }

      const updatedCustomerData = await response.json()
      setCustomers(customers.map(c => c.id_cliente === updatedCustomerData.id_cliente ? updatedCustomerData : c))
      setIsEditDialogOpen(false)
      setCurrentCustomer(null)
      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente se han actualizado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating customer:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el cliente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false) // Detener la animación de carga
    }
  }

  const openEditDialog = (customer: Customer) => {
    setCurrentCustomer(customer)
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
                  <h2 className="text-xl font-semibold text-gray-800">Lista de Clientes</h2>
                  <Button className="bg-neutral-900 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Agregar Cliente
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Cliente", "ID Usuario", "Nombre", "Apellidos", "Teléfono", "Dirección", "Status", "Acciones"].map((header) => (
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
                    {customers.map((customer) => (
                      <TableRow key={customer.id_cliente} className="hover:bg-gray-50">
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{customer.id_cliente}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{customer.id_usuario}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{customer.nombre}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{customer.apellidos}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{customer.telefono}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{customer.direccion}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <Badge variant={customer.status === "activo" ? "default" : "destructive"}>
                              {customer.status === "activo" ? "Activo" : "Inactivo"}
                            </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(customer)}>
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
            <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCustomer}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_usuario" className="text-right">
                  ID Usuario
                </Label>
                <Input id="id_usuario" name="id_usuario" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre" name="nombre" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apellidos" className="text-right">
                  Apellidos
                </Label>
                <Input id="apellidos" name="apellidos" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefono" className="text-right">
                  Teléfono
                </Label>
                <Input id="telefono" name="telefono" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direccion" className="text-right">
                  Dirección
                </Label>
                <Input id="direccion" name="direccion" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Cliente"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCustomer}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre" name="nombre" defaultValue={currentCustomer?.nombre} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_usuario" className="text-right">
                  ID Usuario
                </Label>
                <Input id="id_usuario" name="id_usuario" type="number" defaultValue={currentCustomer?.id_usuario} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apellidos" className="text-right">
                  Apellidos
                </Label>
                <Input id="apellidos" name="apellidos" defaultValue={currentCustomer?.apellidos} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefono" className="text-right">
                  Teléfono
                </Label>
                <Input id="telefono" name="telefono" defaultValue={currentCustomer?.telefono} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direccion" className="text-right">
                  Dirección
                </Label>
                <Input id="direccion" name="direccion" defaultValue={currentCustomer?.direccion} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={currentCustomer?.status}  required>
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
                {isSubmitting ? "Actualizando..." : "Actualizar Cliente"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente y eliminará sus datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster/>
    </div>
  )
}