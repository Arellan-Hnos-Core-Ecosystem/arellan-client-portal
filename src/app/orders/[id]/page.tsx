"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, Button, Spinner, EmptyState, OrderStatusBadge, Container, Alert } from "@arellan-hnos-core-ecosystem/ui"
import TimelineProgress from "@/components/TimelineProgress"
import { getClientOrderDetail, approveOrderQuote, rejectOrderQuote } from "@/lib/api"
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

  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

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

  const handleApprove = async () => {
    if (!order) return
    setApproving(true)
    setActionError(null)
    try {
      const signature = `APPROVED-${order.clientId ?? "client"}-${Date.now()}`
      await approveOrderQuote(order.id, signature)
      setActionSuccess("¡Reparación aprobada! Los mecánicos han sido notificados y comenzarán el trabajo.")
      const refreshed = await getClientOrderDetail(params.id)
      setOrder(refreshed)
      setVehicle(refreshed.vehicle || {})
    } catch (err: any) {
      setActionError(err.message ?? "Error al aprobar la cotización")
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async () => {
    if (!order || !rejectReason.trim()) return
    setRejecting(true)
    setActionError(null)
    try {
      await rejectOrderQuote(order.id, rejectReason.trim())
      setActionSuccess("Cotización rechazada. El taller revisará los costos y le enviará una nueva propuesta.")
      setShowRejectConfirm(false)
      const refreshed = await getClientOrderDetail(params.id)
      setOrder(refreshed)
    } catch (err: any) {
      setActionError(err.message ?? "Error al rechazar la cotización")
    } finally {
      setRejecting(false)
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Spinner size="lg" /></div>
  if (!order) return <EmptyState title="No encontrada" description="La orden especificada no existe." action={<Button variant="ghost" onClick={() => router.push("/orders")}>← Mis órdenes</Button>} />

  const currentStatus = order.status as OrderStatus
  const quote = order.quote as any
  const sortedHistory = [...(order.statusHistory || [])].sort((a: any, b: any) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  const hasPendingQuote = quote?.status === "SENT"

  return (
    <Container size="full" className="px-4 py-6">
      <Button variant="ghost" onClick={() => router.push("/orders")} className="mb-4">← Mis órdenes</Button>

      {actionSuccess && (
        <Alert variant="success" className="mb-4">
          {actionSuccess}
        </Alert>
      )}

      {actionError && (
        <Alert variant="error" className="mb-4">
          {actionError}
        </Alert>
      )}

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

          {/* Quote approval section */}
          {hasPendingQuote && !actionSuccess && (
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-blue-900">Cotización lista para su revisión</h2>
                <p className="text-sm text-blue-700 mt-1">Revise el desglose de costos y apruebe la reparación para que los mecánicos comiencen el trabajo.</p>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de cotización</span>
                  <span className="font-mono font-medium">{quote.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mano de obra</span>
                  <span className="font-medium">S/ {(Number(quote.subtotal) - Number(order.partsCost ?? 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repuestos y materiales</span>
                  <span className="font-medium">S/ {Number(order.partsCost ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>IGV (18%)</span>
                  <span>S/ {Number(quote.tax).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total a pagar</span>
                  <span className="text-blue-900">S/ {Number(quote.total).toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Válido hasta {new Date(quote.validUntil).toLocaleDateString("es-PE")}
                </p>
              </div>

              {!showRejectConfirm ? (
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    className="flex-1 min-h-[52px] text-base font-semibold"
                    disabled={approving}
                    onClick={handleApprove}
                  >
                    {approving ? <span className="flex items-center gap-2"><Spinner size="sm" /> Aprobando...</span> : "✓ Aprobar Reparación"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 min-h-[52px]"
                    disabled={approving}
                    onClick={() => setShowRejectConfirm(true)}
                  >
                    Rechazar
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">¿Por qué desea rechazar la cotización?</p>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={3}
                    placeholder="Ej: El presupuesto supera mi límite, requiero más detalles..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="danger"
                      className="flex-1 min-h-[48px]"
                      disabled={rejecting || !rejectReason.trim()}
                      onClick={handleReject}
                    >
                      {rejecting ? <Spinner size="sm" /> : "Confirmar rechazo"}
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 min-h-[48px]"
                      onClick={() => { setShowRejectConfirm(false); setRejectReason("") }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

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
