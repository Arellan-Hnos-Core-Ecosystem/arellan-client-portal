"use client";

import { useParams } from "next/navigation";
import { useLookupByOT } from "@/hooks/use-lookup";
import { Card, CardHeader, CardContent, Spinner, EmptyState, OrderStatusBadge } from "@arellan-hnos-core-ecosystem/ui";
import TimelineProgress from "@/components/TimelineProgress";
import type { OrderStatus } from "@/types";
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

export default function TrackOrderPage() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params.orderNumber ?? "";

  const query = useLookupByOT(orderNumber);

  if (!orderNumber) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          title="Orden no especificada"
          description="No se proporcionó un código de orden de trabajo."
          action={<Link href="/" className="text-sm font-medium text-brand-primary hover:underline">Volver al inicio</Link>}
        />
      </div>
    );
  }

  if (query.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          title="No encontrado"
          description={`No se encontraron resultados para "${orderNumber}". Verifica el código e intenta nuevamente.`}
          action={<Link href="/" className="text-sm font-medium text-brand-primary hover:underline">Nueva búsqueda</Link>}
        />
      </div>
    );
  }

  const { vehicle } = query.data;

  if (!vehicle.currentOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          title="Sin órdenes activas"
          description={`El vehículo ${vehicle.brand} ${vehicle.model} (${vehicle.plate}) no tiene órdenes de trabajo activas en este momento.`}
          action={<Link href="/" className="text-sm font-medium text-brand-primary hover:underline">Volver al inicio</Link>}
        />
      </div>
    );
  }

  const order = vehicle.currentOrder;
  const currentStatus = order.status as OrderStatus;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="mb-6 inline-block text-sm text-blue-600 hover:text-blue-800">
        &larr; Volver al inicio
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Seguimiento de Orden</h1>
              <p className="text-sm text-gray-500">
                Código: {orderNumber}
              </p>
            </div>
            <OrderStatusBadge status={currentStatus} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Información del Vehículo</h2>
            <p className="text-base font-medium text-gray-900">{vehicle.plate}</p>
            <p className="text-sm text-gray-500">
              {vehicle.brand} {vehicle.model} {vehicle.year} &middot; {vehicle.color}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Estado Actual</h2>
            <p className="text-base font-medium text-gray-900">
              {STATUS_LABEL[currentStatus]}
            </p>
            <p className="mt-1 text-sm text-gray-700">{order.description}</p>
            {order.estimatedDelivery && (
              <p className="mt-2 text-xs text-gray-500">
                Entrega estimada:{" "}
                <span className="font-medium text-gray-700">
                  {new Date(order.estimatedDelivery).toLocaleDateString("es-PE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Progreso
            </h2>
            <div className="overflow-x-auto py-2">
              <TimelineProgress currentStatus={currentStatus} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
