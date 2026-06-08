"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, Button, Spinner, EmptyState, OrderStatusBadge, Container } from "@arellan-hnos-core-ecosystem/ui"
import TimelineProgress from "@/components/TimelineProgress"
import { getClientOrderDetail } from "@/lib/api"
import type { OrderStatus, StatusHistoryEntry } from "@/types"

const STATUS_LABEL: Record<string, string> = {
  RECEIVED: "Recibido", IN_DIAGNOSIS: "En Diagnóstico", BUDGETED: "Cotizado",
  IN_PROGRESS: "En Reparación", IN_REVIEW: "Control de Calidad", READY: "Listo para Recoger",
  DELIVERED: "Entregado", CANCELLED: "Cancelado",
}

export default function ClientOrderDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.id) return

    getClientOrderDetail(params.id)
      .then(data => {
        setOrder(data)
        setVehicle(data.vehicle || {})
      })
      .catch((err) => { console.error("[client-portal] Error:", err.message) })
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Spinner size="lg" /></div>
  if (!order) return <EmptyState title="No encontrada" description="La orden especificada no existe." action={<Button variant="ghost" onClick={() => router.push("/orders")}>← Mis órdenes</Button>} />

  const currentStatus = order.status as OrderStatus
  const sortedHistory = [...(order.statusHistory || [])].sort((a: any, b: any) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <Container size="full" className="px-4 py-6">
      <Button variant="ghost" onClick={() => router.push("/orders")} className="mb-4">← Mis órdenes</Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">OT #{order.number}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {vehicle?.brand} {vehicle?.model} {vehicle?.year} · Placa {vehicle?.plate}
              </p>
            </div>
            <OrderStatusBadge status={currentStatus} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <TimelineProgress currentStatus={currentStatus} />

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">{order.description}</p>
            {order.totalCost && <p className="mt-2 font-semibold">Total: S/ {Number(order.totalCost).toFixed(2)}</p>}
            {order.estimatedDelivery && <p className="mt-1 text-xs text-gray-500">Entrega estimada: {new Date(order.estimatedDelivery).toLocaleDateString("es-PE")}</p>}
          </div>

          {sortedHistory.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Historial de estados</h2>
              <div className="relative">
                <div className="absolute left-3 top-0 h-full w-px bg-gray-200" />
                <ul className="space-y-3">
                  {sortedHistory.map((entry: any, idx: number) => (
                    <li key={idx} className="relative flex gap-4 pl-8">
                      <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-blue-400 bg-blue-50" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{STATUS_LABEL[entry.status] || entry.status}</span>
                        <span className="ml-2 text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString("es-PE")}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}
