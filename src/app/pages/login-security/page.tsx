"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { Loading } from "@/components/ui/Loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LoginSecurity {
  id_login: number
  id_cliente: number
  ultimo_login: string
  intentos_fallidos: number
  verificado: boolean
  status: "activo" | "inactivo"
  empleado_mod: string
}

export default function LoginSecurity() {
  const [loginSecurityData, setLoginSecurityData] = useState<LoginSecurity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentLogin, setCurrentLogin] = useState<LoginSecurity | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchLoginSecurityData()
  }, [])

  const fetchLoginSecurityData = async () => {
    try {
      const response = await fetch('/api/login/')
      if (!response.ok) {
        throw new Error("Error al obtener los datos de seguridad de login")
      }
      const data = await response.json()
      console.log("Datos de seguridad de login:", data)
      setLoginSecurityData(data)
    } catch (error) {
      console.error("Error fetching login security data:", error)
      setError("Error al obtener los datos de seguridad de login")
    } finally {
      setLoading(false)
    }
  }

  const handleAddLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const newLogin: LoginSecurity = {
      id_login: 0,
      id_cliente: Number(formData.get('id_cliente')),
      ultimo_login: new Date().toISOString(),
      intentos_fallidos: Number(formData.get('intentos_fallidos')),
      verificado: formData.get('verificado') === "on",
      status: "activo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLogin),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al crear el registro de login')
      }

      const createdLogin = await response.json()
      setLoginSecurityData([...loginSecurityData, createdLogin])
      setIsAddDialogOpen(false)
      toast({
        title: "Registro agregado",
        description: "El nuevo registro de login se ha agregado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error creating login record:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el registro de login.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentLogin) return
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const updatedLogin = {
      id_login: currentLogin.id_login,
      id_cliente: Number(formData.get('id_cliente')),
      ultimo_login: currentLogin.ultimo_login,
      intentos_fallidos: Number(formData.get('intentos_fallidos')),
      verificado: formData.get('verificado') === "on",
      status: formData.get('status') as "activo" | "inactivo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch(`/api/login/${currentLogin.id_login}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLogin),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al actualizar el registro de login')
      }

      const updatedLoginData = await response.json()
      setLoginSecurityData(loginSecurityData.map(l => l.id_login === updatedLoginData.id_login ? updatedLoginData : l))
      setIsEditDialogOpen(false)
      setCurrentLogin(null)
      toast({
        title: "Registro actualizado",
        description: "Los datos del registro de login se han actualizado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating login record:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el registro de login.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (login: LoginSecurity) => {
    setCurrentLogin(login)
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
                  <h2 className="text-xl font-semibold text-gray-800">Bitácora de Seguridad</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-700 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Agregar Registro
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Login", "ID Cliente", "Último Login", "Intentos Fallidos", "Verificado", "Status", "Empleado Mod", "Acciones"].map((header) => (
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
                    {loginSecurityData.map((login) => (
                      <TableRow key={login.id_login} className="hover:bg-gray-50">
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{login.id_login}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{login.id_cliente}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(login.ultimo_login).toLocaleDateString()}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Badge variant={login.intentos_fallidos > 3 ? "destructive" : "default"}>
                            {login.intentos_fallidos}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {login.verificado ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <Badge variant={login.status === "activo" ? "default" : "destructive"}>
                              {login.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{login.empleado_mod}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(login)}>
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
            <DialogTitle>Agregar Nuevo Registro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddLogin}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_cliente" className="text-right">
                  ID Cliente
                </Label>
                <Input id="id_cliente" name="id_cliente" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="intentos_fallidos" className="text-right">
                  Intentos Fallidos
                </Label>
                <Input id="intentos_fallidos" name="intentos_fallidos" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="verificado" className="text-right">
                  Verificado
                </Label>
                <Input id="verificado" name="verificado" type="checkbox" className="col-span-3" />
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
                {isSubmitting ? "Guardando..." : "Guardar Registro"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditLogin}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_cliente" className="text-right">
                  ID Cliente
                </Label>
                <Input id="id_cliente" name="id_cliente" type="number" defaultValue={currentLogin?.id_cliente} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="intentos_fallidos" className="text-right">
                  Intentos Fallidos
                </Label>
                <Input id="intentos_fallidos" name="intentos_fallidos" type="number" defaultValue={currentLogin?.intentos_fallidos} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="verificado" className="text-right">
                  Verificado
                </Label>
                <Input id="verificado" name="verificado" type="checkbox" defaultChecked={currentLogin?.verificado} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={currentLogin?.status} required>
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
                <Input id="empleado_mod" name="empleado_mod" defaultValue={currentLogin?.empleado_mod} className="col-span-3" required />
              </div>

            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Actualizando..." : "Actualizar Registro"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}