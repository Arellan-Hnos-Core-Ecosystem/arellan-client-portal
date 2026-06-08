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
interface DisplayUser {
  name: string; id: string
}

function readDisplayCookie(): DisplayUser | null {
  if (typeof document === "undefined") return null
  const raw = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("arellan-client-display="))
  if (!raw) return null
  try {
    return JSON.parse(decodeURIComponent(raw.split("=").slice(1).join("="))) as DisplayUser
  } catch {
    return null
  }
}

export default function ClientDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<DisplayUser | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [orders, setOrders] = useState<OrderInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    router.push("/login")
  }

  useEffect(() => {
    setUser(readDisplayCookie())

    Promise.all([getClientVehicles(), getClientOrders(10)])
      .then(([vehData, ordData]) => {
        setVehicles(Array.isArray(vehData) ? vehData : (vehData as { data: Vehicle[] }).data ?? [])
        setOrders(Array.isArray(ordData) ? ordData : (ordData as { data: OrderInfo[] }).data ?? [])
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

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

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

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
