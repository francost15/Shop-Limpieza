"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, Users, ShoppingCart, CreditCard, Package } from 'lucide-react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const salesData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Ventas',
      data: [4000, 3000, 5000, 4500, 6000, 5500],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
}

const customerData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Nuevos Clientes',
      data: [400, 300, 200, 278],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'Clientes Recurrentes',
      data: [240, 139, 980, 390],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    },
  ],
}

const orderStatusData = {
  labels: ['Pendiente', 'Procesando', 'Enviado', 'Entregado'],
  datasets: [
    {
      data: [400, 300, 300, 200],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    },
  ],
}

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [carts, setCarts] = useState([])
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, cartsRes, rolesRes, usersRes] = await Promise.all([
          fetch('/api/pedidos/'),
          fetch('/api/carritos/'),
          fetch('/api/roles/'),
          fetch('/api/clientes/')
        ])

        if (!ordersRes.ok || !cartsRes.ok || !rolesRes.ok || !usersRes.ok) {
          throw new Error("Error al obtener los datos")
        }

        const [ordersData, cartsData, rolesData, usersData] = await Promise.all([
          ordersRes.json(),
          cartsRes.json(),
          rolesRes.json(),
          usersRes.json()
        ])

        setOrders(ordersData)
        setCarts(cartsData)
        setRoles(rolesData)
        setUsers(usersData)
      } catch (error) {
        console.error("Error al obtener los datos:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 ml-12">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Panel de Control</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total de Clientes" value={users.length} icon={<Users size={24} />} change={12} />
            <StatCard title="Total de Carritos" value={carts.length} icon={<ShoppingCart size={24} />} change={-2.5} />
            <StatCard title="Pedidos Pendientes" value={orders.length} icon={<Package size={24} />} change={-8} />
            <StatCard title="Total de Roles" value={roles.length} icon={<CreditCard size={24} />} change={5.3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Resumen de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <Line 
                  data={salesData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: true,
                        text: 'Ventas Mensuales',
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Adquisición de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar 
                  data={customerData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: true,
                        text: 'Adquisición de Clientes por Trimestre',
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Estado de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <Pie 
                  data={orderStatusData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: true,
                        text: 'Distribución del Estado de Pedidos',
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    { action: "Nuevo pedido realizado", time: "Hace 2 minutos" },
                    { action: "Cliente John Doe registrado", time: "Hace 1 hora" },
                    { action: "Pago recibido para el pedido #1234", time: "Hace 3 horas" },
                    { action: "Producto 'iPhone 13' reabastecido", time: "Hace 5 horas" },
                  ].map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <span className="text-sm font-medium text-gray-900">{item.action}</span>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change: number;
}

function StatCard({ title, value, icon, change }: StatCardProps) {
  const isPositive = change >= 0
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-3xl font-bold">{value}</span>
          <span className="p-3 bg-gray-100 rounded-full">{icon}</span>
        </div>
        <span className="text-sm text-gray-600 mb-2">{title}</span>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
          <span className="ml-1 font-medium">{Math.abs(change)}%</span>
        </div>
      </CardContent>
    </Card>
  )
}