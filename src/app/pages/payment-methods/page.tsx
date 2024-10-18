"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { Loading } from "@/components/ui/Loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentMethod {
  id_pago: number
  id_cliente: number
  tipo_pago: string
  nombre_titular: string
  numero_tarjeta: string
  fecha_vencimiento: string
  cvv: string
  status: "activo" | "inactivo"
  empleado_mod: string
}

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSensitiveInfo, setShowSensitiveInfo] = useState<{ [key: number]: boolean }>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/metodos_pago/')
      if (!response.ok) {
        throw new Error("Error al obtener los métodos de pago")
      }
      const data = await response.json()
      console.log("Datos de métodos de pago:", data)
      setPaymentMethods(data)
    } catch (error) {
      console.error("Error fetching payment methods:", error)
      setError("Error al obtener los métodos de pago")
    } finally {
      setLoading(false)
    }
  }

  const toggleSensitiveInfo = (id: number) => {
    setShowSensitiveInfo(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const maskCardNumber = (cardNumber: string) => {
    return "*".repeat(cardNumber.length - 4) + cardNumber.slice(-4)
  }

  const handleAddMethod = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const newMethod: PaymentMethod = {
      id_pago: 0,
      id_cliente: Number(formData.get('id_cliente')),
      tipo_pago: formData.get('tipo_pago') as string,
      nombre_titular: formData.get('nombre_titular') as string,
      numero_tarjeta: formData.get('numero_tarjeta') as string,
      fecha_vencimiento: formData.get('fecha_vencimiento') as string,
      cvv: formData.get('cvv') as string,
      status: "activo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch('/api/metodos_pago/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMethod),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al crear el método de pago')
      }

      const createdMethod = await response.json()
      setPaymentMethods([...paymentMethods, createdMethod])
      setIsAddDialogOpen(false)
      toast({
        title: "Método de pago agregado",
        description: "El nuevo método de pago se ha agregado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error creating payment method:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el método de pago.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditMethod = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentMethod) return
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const updatedMethod = {
      id_pago: currentMethod.id_pago,
      id_cliente: Number(formData.get('id_cliente')),
      tipo_pago: formData.get('tipo_pago') as string,
      nombre_titular: formData.get('nombre_titular') as string,
      numero_tarjeta: formData.get('numero_tarjeta') as string,
      fecha_vencimiento: formData.get('fecha_vencimiento') as string,
      cvv: formData.get('cvv') as string,
      status: formData.get('status') as "activo" | "inactivo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch(`/api/metodos_pago/${currentMethod.id_pago}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMethod),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al actualizar el método de pago')
      }

      const updatedMethodData = await response.json()
      setPaymentMethods(paymentMethods.map(m => m.id_pago === updatedMethodData.id_pago ? updatedMethodData : m))
      setIsEditDialogOpen(false)
      setCurrentMethod(null)
      toast({
        title: "Método de pago actualizado",
        description: "Los datos del método de pago se han actualizado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating payment method:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el método de pago.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (method: PaymentMethod) => {
    setCurrentMethod(method)
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
                  <h2 className="text-xl font-semibold text-gray-800">Métodos de Pago</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Agregar Método de Pago
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Pago", "ID Cliente", "Tipo Pago", "Nombre Titular", "Número Tarjeta", "Fecha Vencimiento", "CVV", "Status", "Empleado Mod", "Acciones"].map((header) => (
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
                    {paymentMethods.map((method) => (
                      <TableRow key={method.id_pago} className="hover:bg-gray-50">
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{method.id_pago}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{method.id_cliente}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Badge 
                            variant="outline"
                            className={`${
                              method.tipo_pago === 'Crédito' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''
                            } ${
                              method.tipo_pago === 'Débito' ? 'bg-green-100 text-green-800 border-green-300' : ''
                            } ${
                              method.tipo_pago === 'paypal' ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : ''
                            }`}
                          >
                            {method.tipo_pago}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{method.nombre_titular}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            {showSensitiveInfo[method.id_pago] ? method.numero_tarjeta : maskCardNumber(method.numero_tarjeta)}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSensitiveInfo(method.id_pago)}
                              className="ml-2"
                            >
                              {showSensitiveInfo[method.id_pago] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {new Date(method.fecha_vencimiento).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {showSensitiveInfo[method.id_pago] ? method.cvv : "***"}
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <Badge variant={method.status === "activo" ? "default" : "destructive"}>
                              {method.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{method.empleado_mod}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(method)}>
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
            <DialogTitle>Agregar Nuevo Método de Pago</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMethod}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_cliente" className="text-right">
                  ID Cliente
                </Label>
                <Input id="id_cliente" name="id_cliente" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Tipo Pago
                </Label>
                <Select name="tipo_pago" defaultValue={currentMethod?.tipo_pago} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tarjeta_credito">Tarjeta de Credito</SelectItem>
                    <SelectItem value="tarjeta_debito">Tarjeta de Debito</SelectItem>
                    <SelectItem value="paypal">Paypal</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre_titular" className="text-right">
                  Nombre Titular
                </Label>
                <Input id="nombre_titular" name="nombre_titular" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="numero_tarjeta" className="text-right">
                  Número Tarjeta
                </Label>
                <Input id="numero_tarjeta" name="numero_tarjeta" minLength={13} maxLength={18} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha_vencimiento" className="text-right">
                  Fecha Vencimiento
                </Label>
                <Input id="fecha_vencimiento" name="fecha_vencimiento" type="date" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cvv" className="text-right">
                  CVV
                </Label>
                <Input id="cvv" name="cvv" type="password" maxLength={3} className="col-span-3" required />
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
                {isSubmitting ? "Guardando..." : "Guardar Método de Pago"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Método de Pago</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditMethod}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_cliente" className="text-right">
                  ID Cliente
                </Label>
                <Input id="id_cliente" name="id_cliente" type="number" defaultValue={currentMethod?.id_cliente} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Tipo Pago
                </Label>
                <Select name="tipo_pago" defaultValue={currentMethod?.tipo_pago} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tarjeta_credito">Tarjeta de Credito</SelectItem>
                    <SelectItem value="tarjeta_debito">Tarjeta de Debito</SelectItem>
                    <SelectItem value="paypal">Paypal</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre_titular" className="text-right">
                  Nombre Titular
                </Label>
                <Input id="nombre_titular" name="nombre_titular" defaultValue={currentMethod?.nombre_titular} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="numero_tarjeta" className="text-right">
                  Número Tarjeta
                </Label>
                <Input id="numero_tarjeta" name="numero_tarjeta" defaultValue={currentMethod?.numero_tarjeta} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha_vencimiento" className="text-right">
                  Fecha Vencimiento
                </Label>
                <Input id="fecha_vencimiento" name="fecha_vencimiento" type="date" defaultValue={currentMethod?.fecha_vencimiento} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cvv" className="text-right">
                  CVV
                </Label>
                <Input id="cvv" name="cvv" type="password" maxLength={3} defaultValue={currentMethod?.cvv} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={currentMethod?.status} required>
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
                <Input id="empleado_mod" name="empleado_mod" defaultValue={currentMethod?.empleado_mod} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Actualizando..." : "Actualizar Método de Pago"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}