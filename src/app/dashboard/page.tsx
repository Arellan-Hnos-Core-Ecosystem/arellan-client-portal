"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, Button, Spinner, EmptyState, OrderStatusBadge, Container } from "@arellan-hnos-core-ecosystem/ui"
import { getClientVehicles, getClientOrders } from "@/lib/api"
import type { OrderStatus } from "@/types"

interface Vehicle {
  id: string; plate: string; brand: string; model: string; year: number; color: string
}
interface OrderInfo {
  id: string; number: string; status: OrderStatus; description: string; vehiclePlate: string; createdAt: string
}

export default function ClientDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [orders, setOrders] = useState<OrderInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("arellan-client-user")
    const token = localStorage.getItem("arellan-client-token")
    if (!stored || !token) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(stored))

    Promise.all([getClientVehicles(), getClientOrders(10)])
      .then(([vehData, ordData]) => {
        setVehicles(Array.isArray(vehData) ? vehData : vehData.data || [])
        setOrders(Array.isArray(ordData) ? ordData : ordData.data || [])
      })
      .catch((err) => { console.error("[client-portal] Error:", err.message); setError(err.message) })
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("arellan-client-token")
    localStorage.removeItem("arellan-client-user")
    router.push("/login")
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Spinner size="lg" /></div>

  return (
    <Container size="full" className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bienvenido{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
          <p className="text-sm text-gray-500">Panel de control de sus vehículos</p>
        </div>
        <Button variant="ghost" onClick={handleLogout}>Salir</Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><h2 className="text-lg font-semibold">Mis Vehículos ({vehicles.length})</h2></CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <p className="text-sm text-gray-500">No hay vehículos registrados.</p>
            ) : (
              <div className="space-y-2">
                {vehicles.map(v => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{v.plate}</p>
                      <p className="text-sm text-gray-500">{v.brand} {v.model} {v.year} · {v.color}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Órdenes Recientes</h2>
              <Button variant="ghost" size="sm" onClick={() => router.push("/orders")}>Ver todas</Button>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <EmptyState title="Sin órdenes" description="No hay órdenes de trabajo registradas para sus vehículos." />
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                       onClick={() => router.push(`/orders/${o.id}`)}>
                    <div>
                      <p className="font-semibold text-sm">OT #{o.number} — {o.vehiclePlate}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{o.description}</p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
