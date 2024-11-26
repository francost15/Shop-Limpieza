"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function HomeNatalia() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Panel de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/pages/natalia/facturacion">
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Gestión de Facturación
          </Button>
        </Link>
        <Link href="/pages/natalia/categoria">
          <Button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Gestión de Categorías
          </Button>
        </Link>
        <Link href="/pages/natalia/compra_producto">
          <Button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Gestión de Compras de Productos
          </Button>
        </Link>
        <Link href="/pages/natalia/factura_detalle">
          <Button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
            Gestión de Detalles de Facturas
          </Button>
        </Link>
        <Link href="/pages/natalia/inventario">
          <Button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Gestión de Inventarios
          </Button>
        </Link>
        <Link href="/pages/natalia/producto">
          <Button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Gestión de Productos
          </Button>
        </Link>
        <Link href="/pages/natalia/promocion">
          <Button className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded">
            Gestión de Promociones
          </Button>
        </Link>
        <Link href="/pages/natalia/promocion_producto">
          <Button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
            Gestión de Productos en Promoción
          </Button>
        </Link>
        <Link href="/pages/natalia/proveedor">
          <Button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            Gestión de Proveedores
          </Button>
        </Link>
        <Link href="/pages/natalia/superficie">
          <Button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            Superficie
          </Button>
        </Link>
      </div>
    </div>
  )
}