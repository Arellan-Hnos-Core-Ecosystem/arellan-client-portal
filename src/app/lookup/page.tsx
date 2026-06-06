"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLookupByPlate, useLookupByOT } from "@/hooks/use-lookup";
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

export default function LookupPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Spinner size="lg" /></div>}>
      <LookupContent />
    </Suspense>
  );
}

function LookupContent() {
  const searchParams = useSearchParams();
  const plate = searchParams.get("plate") ?? "";
  const ot = searchParams.get("ot") ?? "";
  const searchTerm = plate || ot;

  const plateQuery = useLookupByPlate(plate);
  const otQuery = useLookupByOT(ot);
  const query = plate ? plateQuery : otQuery;

  if (!searchTerm) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          title="Sin busqueda"
          description="Ingresa una placa o codigo OT para consultar el estado de tu vehiculo."
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
          title="Error de busqueda"
          description="Ocurrio un error al consultar. Verifica tu conexion e intenta nuevamente."
          action={<Link href="/" className="text-sm font-medium text-brand-primary hover:underline">Volver al inicio</Link>}
        />
      </div>
    );
  }

  const data = query.data;

  if (!data?.found) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          title="No encontrado"
          description={data?.message ?? `No se encontraron resultados para "${searchTerm}". Verifica el dato e intenta nuevamente.`}
          action={<Link href="/" className="text-sm font-medium text-brand-primary hover:underline">Nueva busqueda</Link>}
        />
      </div>
    );
  }

  const vehicle = data.vehicle;
  const order = data.order ?? null;

  if (!vehicle || (!order && !data.activeOrder)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          title="Sin ordenes activas"
          description={vehicle
            ? `El vehiculo ${vehicle.brand} ${vehicle.model} (${vehicle.plate}) no tiene ordenes de trabajo activas en este momento.`
            : "No se encontraron ordenes de trabajo activas."}
          action={<Link href="/" className="text-sm font-medium text-brand-primary hover:underline">Nueva busqueda</Link>}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          title="Sin ordenes activas"
          description={`El vehiculo ${vehicle.brand} ${vehicle.model} (${vehicle.plate}) no tiene ordenes de trabajo activas en este momento.`}
          action={<Link href="/" className="text-sm font-medium text-brand-primary hover:underline">Nueva busqueda</Link>}
        />
      </div>
    );
  }

  const currentStatus = order.status as OrderStatus;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/" className="mb-6 inline-block text-sm text-blue-600 hover:text-blue-800">
        &larr; Nueva busqueda
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{vehicle.plate}</h1>
              <p className="text-sm text-gray-500">
                {vehicle.brand} {vehicle.model} {vehicle.year}
                {vehicle.color && <> &middot; {vehicle.color}</>}
              </p>
            </div>
            <OrderStatusBadge status={currentStatus} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">OT #{order.number}</p>
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

          <div className="overflow-x-auto py-2">
            <TimelineProgress currentStatus={currentStatus} />
          </div>

          <Link
            href={`/status/${order.id}`}
            className="block w-full rounded-md bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Ver detalle completo
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
