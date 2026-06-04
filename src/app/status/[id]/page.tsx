"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderStatus } from "@/lib/api";
import { Card, CardHeader, CardContent, OrderStatusBadge } from "@arellan-hnos-core-ecosystem/ui";
import TimelineProgress from "@/components/TimelineProgress";
import type { OrderDetailResponse, OrderStatus, StatusHistoryEntry } from "@/types";
import Link from "next/link";

const STATUS_LABEL: Record<OrderStatus, string> = {
  RECEIVED: "Recibido",
  IN_DIAGNOSIS: "En Diagnóstico",
  BUDGETED: "Cotizado",
  IN_PROGRESS: "En Reparación",
  IN_REVIEW: "Control de Calidad",
  READY: "Listo para Recoger",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export default function StatusPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    getOrderStatus(params.id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-xl font-bold text-gray-900">Orden no encontrada</h1>
        <p className="mt-2 text-gray-500">
          La orden de trabajo que buscas no existe o no está disponible para consulta pública.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-blue-600 hover:text-blue-800">
          &larr; Volver al inicio
        </Link>
      </div>
    );
  }

  const { vehicle, order } = data;
  const currentStatus = order.status as OrderStatus;
  const sortedHistory = [...order.statusHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="mb-6 inline-block text-sm text-blue-600 hover:text-blue-800">
        &larr; Nueva consulta
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Orden de Trabajo #{order.orderNumber}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Vehículo: {vehicle.brand} {vehicle.model} {vehicle.year} &middot; Placa {vehicle.plate}
              </p>
            </div>
            <OrderStatusBadge status={currentStatus} />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Progreso de la orden
            </h2>
            <div className="overflow-x-auto py-2">
              <TimelineProgress currentStatus={currentStatus} />
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Descripción del trabajo
            </h2>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm leading-relaxed text-gray-700">{order.description}</p>
              {order.estimatedDelivery && currentStatus !== "DELIVERED" && (
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <p className="text-xs text-gray-500">
                    Fecha estimada de entrega:{" "}
                    <span className="font-medium text-gray-700">
                      {new Date(order.estimatedDelivery).toLocaleDateString("es-PE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              )}
              {(order.statusHistory?.length ?? 0) > 0 && (
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <p className="text-xs text-green-600 font-medium">
                    Vehículo entregado el{" "}
                    {new Date(
                      order.statusHistory.find((e) => e.status === "DELIVERED")?.timestamp ??
                        order.statusHistory[0]!.timestamp
                    ).toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Historial de estados
            </h2>
            <div className="relative">
              <div className="absolute left-3 top-0 h-full w-px bg-gray-200" />
              <ul className="space-y-3">
                {sortedHistory.map((entry: StatusHistoryEntry) => (
                  <li key={entry.id} className="relative flex gap-4 pl-8">
                    <span
                      className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 ${
                        entry.status === "CANCELLED"
                          ? "border-red-400 bg-red-50"
                          : "border-blue-400 bg-blue-50"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {STATUS_LABEL[entry.status]}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(entry.timestamp).toLocaleDateString("es-PE", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {entry.comment && (
                        <p className="mt-0.5 text-sm text-gray-500">{entry.comment}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
