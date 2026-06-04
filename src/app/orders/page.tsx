"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, CardFooter, Button, Spinner, EmptyState, OrderStatusBadge, Container } from "@arellan-hnos-core-ecosystem/ui"
import type { OrderStatus } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

interface OrderInfo {
  id: string; number: string; status: OrderStatus; description: string; vehiclePlate: string; totalCost?: string; createdAt: string
}

export default function ClientOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderInfo[]>([])
  const [loading, setLoading] = useState(true)

  const getToken = () => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("arellan-client-token")
  }

  useEffect(() => {
    const token = getToken()
    if (!token) { router.push("/login"); return }

    fetch(`${API_URL}/orders?limit=50`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Spinner size="lg" /></div>

  return (
    <Container size="full" className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Historial de Órdenes</h1>
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>← Dashboard</Button>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="Sin órdenes" description="No tiene órdenes de trabajo registradas." />
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <Card key={o.id} className="cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/orders/${o.id}`)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">OT #{o.number} — {o.vehiclePlate}</p>
                    <p className="text-sm text-gray-600 mt-1 truncate">{o.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{new Date(o.createdAt).toLocaleDateString("es-PE")}</span>
                      {o.totalCost && <span>S/ {Number(o.totalCost).toFixed(2)}</span>}
                    </div>
                  </div>
                  <div className="shrink-0 ml-3">
                    <OrderStatusBadge status={o.status} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  )
}
