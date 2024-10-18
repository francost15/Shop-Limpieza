"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, StarHalf } from "lucide-react"
import { Loading } from "@/components/ui/Loading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductReview {
  id_resena: number
  id_cliente: number
  id_producto: number
  calificacion: number
  comentario: string
  fecha_resena: string
  status: "activo" | "inactivo"
  empleado_mod: string
}

export default function ProductReviews() {
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentReview, setCurrentReview] = useState<ProductReview | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/resenas/')
        if (!response.ok) {
          throw new Error("Error al obtener las reseñas")
        }
        const data = await response.json()
        console.log("Datos de reseñas:", data) // Mostrar datos en la consola
        setReviews(data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
        setError("Error al obtener las reseñas")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handleAddReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const newReview: ProductReview = {
      id_resena: 0,
      id_cliente: Number(formData.get('id_cliente')),
      id_producto: Number(formData.get('id_producto')),
      calificacion: Number(formData.get('calificacion')),
      comentario: formData.get('comentario') as string,
      fecha_resena: new Date().toISOString(),
      status: "activo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch('/api/resenas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al crear la reseña')
      }

      const createdReview = await response.json()
      setReviews([...reviews, createdReview])
      setIsAddDialogOpen(false)
      toast({
        title: "Reseña agregada",
        description: "La nueva reseña se ha agregado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error creating review:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la reseña.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentReview) return
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const updatedReview = {
      id_resena: currentReview.id_resena,
      id_cliente: Number(formData.get('id_cliente')),
      id_producto: Number(formData.get('id_producto')),
      calificacion: Number(formData.get('calificacion')),
      comentario: formData.get('comentario') as string,
      fecha_resena: currentReview.fecha_resena,
      status: formData.get('status') as "activo" | "inactivo",
      empleado_mod: formData.get('empleado_mod') as string
    }

    try {
      const response = await fetch(`/api/resenas/${currentReview.id_resena}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReview),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response data:', errorData)
        throw new Error(errorData.message || 'Error al actualizar la reseña')
      }

      const updatedReviewData = await response.json()
      setReviews(reviews.map(r => r.id_resena === updatedReviewData.id_resena ? updatedReviewData : r))
      setIsEditDialogOpen(false)
      setCurrentReview(null)
      toast({
        title: "Reseña actualizada",
        description: "Los datos de la reseña se han actualizado correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating review:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar la reseña.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (review: ProductReview) => {
    setCurrentReview(review)
    setIsEditDialogOpen(true)
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  if (loading) 
    return (
      /* From Uiverse.io by Javierrocadev */ 
     <Loading />
    )
  
  if (error) return <p>{error}</p>

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-100 p-4 ml-12">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Reseñas de Productos</h2>
                  <Button className="bg-neutral-800 hover:bg-neutral-600 text-white" onClick={() => setIsAddDialogOpen(true)}>
                    Nueva Reseña
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Reseña</TableHead>
                      <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Cliente</TableHead>
                      <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Producto</TableHead>
                      <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Calificación</TableHead>
                      <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Comentario</TableHead>
                      <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Reseña</TableHead>
                      <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Empleado Mod</TableHead>
                      <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id_resena} className="hover:bg-gray-50">
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.id_resena}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.id_cliente}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.id_producto}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {renderStars(review.calificacion)}
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap truncate max-w-xs">{review.comentario}</p>
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(review.fecha_resena).toLocaleDateString()}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <Badge variant={review.status === "activo" ? "default" : "destructive"}>
                              {review.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.empleado_mod}</TableCell>
                        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(review)}>
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
            <DialogTitle>Agregar Nueva Reseña</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddReview}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_cliente" className="text-right">
                  ID Cliente
                </Label>
                <Input id="id_cliente" name="id_cliente" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_producto" className="text-right">
                  ID Producto
                </Label>
                <Input id="id_producto" name="id_producto" type="number" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="calificacion" className="text-right">
                  Calificación
                </Label>
                <Input id="calificacion" name="calificacion" type="number" step="0.1" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comentario" className="text-right">
                  Comentario
                </Label>
                <Input id="comentario" name="comentario" className="col-span-3" required />
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
                {isSubmitting ? "Guardando..." : "Guardar Reseña"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Reseña</DialogTitle>
          </DialogHeader>
          {currentReview && (
            <form onSubmit={handleEditReview}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id_cliente" className="text-right">
                    ID Cliente
                  </Label>
                  <Input id="id_cliente" name="id_cliente" type="number" defaultValue={currentReview.id_cliente} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id_producto" className="text-right">
                    ID Producto
                  </Label>
                  <Input id="id_producto" name="id_producto" type="number" defaultValue={currentReview.id_producto} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="calificacion" className="text-right">
                    Calificación
                  </Label>
                  <Input id="calificacion" name="calificacion" type="number" step="0.1" defaultValue={currentReview.calificacion} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comentario" className="text-right">
                    Comentario
                  </Label>
                  <Input id="comentario" name="comentario" defaultValue={currentReview.comentario} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={currentReview?.status} required>
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
                  <Input id="empleado_mod" name="empleado_mod" defaultValue={currentReview.empleado_mod} className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Actualizando..." : "Actualizar Reseña"}
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