"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {  Edit2, Eye, EyeOff } from "lucide-react"
import { Loading } from "@/components/ui/Loading"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface User {
  id_usuario: number
  nombre: string
  email: string
  contraseña: string
  id_rol: number
  activo: number
  fecha_registro: string
  status: "activo" | "inactivo"
  empleado_mod: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/usuarios/')
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios")
      }
      const data = await response.json()
      console.log("Datos de usuarios:", data)
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Error al obtener los usuarios")
    } finally {
      setLoading(false)
    }
  }
  const toggleShowPassword = (id: number) => {
    setShowPasswords(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }))
  }

  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const newUser: User = {
      id_usuario: 0,
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      contraseña: formData.get('contraseña') as string,
      id_rol: Number(formData.get('id_rol')),
      activo: Number(formData.get('activo')),
      fecha_registro: new Date().toISOString(),
      status: formData.get('status') as "activo" | "inactivo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch('/api/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al crear el usuario')
      }

      const createdUser = await response.json()
      setUsers([...users, createdUser])
      setIsAddDialogOpen(false)
      toast({
        title: "Usuario agregado",
        description: "El nuevo usuario se ha agregado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error creating user:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el usuario.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentUser) return
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const updatedUser = {
      id_usuario: currentUser.id_usuario,
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      contraseña: formData.get('contraseña') as string,
      id_rol: Number(formData.get('id_rol')),
      activo: Number(formData.get('activo')),
      fecha_registro: currentUser.fecha_registro,
      status: formData.get('status') as "activo" | "inactivo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch(`/api/usuarios/${currentUser.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al actualizar el usuario')
      }

      const updatedUserData = await response.json()
      setUsers(users.map(u => u.id_usuario === updatedUserData.id_usuario ? updatedUserData : u))
      setIsEditDialogOpen(false)
      setCurrentUser(null)
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario se han actualizado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el usuario.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (user: User) => {
    setCurrentUser(user)
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
                  <h2 className="text-xl font-semibold text-gray-800">Gestión de Usuarios</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Nuevo Usuario
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["ID Usuario", "Nombre", "Email", "Contraseña", "ID Rol", "Activo", "Fecha Registro", "Status", "Empleado Mod", "Acciones"].map((header) => (
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
                    {users.map((user) => (
                      <TableRow key={user.id_usuario} className="hover:bg-gray-50">
                        <TableCell>{user.id_usuario}</TableCell>
                        <TableCell>{user.nombre}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Input
                              type={showPasswords[user.id_usuario] ? "text" : "password"}
                              value={user.contraseña}
                              readOnly
                              className="mr-2"
                            />
                            <Button variant="outline" size="sm" onClick={() => toggleShowPassword(user.id_usuario)}>
                              {showPasswords[user.id_usuario] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{user.id_rol}</TableCell>
                        <TableCell>
                          {user.activo === 1 ? "Sí" : "No"}
                        </TableCell>

                        <TableCell>{new Date(user.fecha_registro).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge variant={user.status === "activo" ? "default" : "destructive"}>
                              {user.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{user.empleado_mod}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
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
            <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre" name="nombre" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" name="email" type="email" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contraseña" className="text-right">
                  Contraseña
                </Label>
                <Input id="contraseña" name="contraseña" type="password" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_rol" className="text-right">
                  ID Rol
                </Label>
                <Input id="id_rol" name="id_rol" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activo" className="text-right">
                  Activo
                </Label>
                <Input id="activo" name="activo" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={currentUser?.status} required>
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
                <Input id="empleado_mod" name="empleado_mod" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <form onSubmit={handleEditUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input id="nombre" name="nombre" defaultValue={currentUser.nombre} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" name="email" type="email" defaultValue={currentUser.email} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contraseña" className="text-right">
                    Contraseña
                  </Label>
                  <Input id="contraseña" name="contraseña" type="password" defaultValue={currentUser.contraseña} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id_rol" className="text-right">
                    ID Rol
                  </Label>
                  <Input id="id_rol" name="id_rol" type="number" defaultValue={currentUser.id_rol} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="activo" className="text-right">
                    Activo
                  </Label>
                  <Input id="activo" name="activo" type="number" defaultValue={currentUser.activo} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select name="status" defaultValue={currentUser.status} required>
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
                  <Input id="empleado_mod" name="empleado_mod" defaultValue={currentUser.empleado_mod} className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Actualizando..." : "Actualizar Usuario"}
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