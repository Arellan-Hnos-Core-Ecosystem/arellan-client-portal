import type { OrderStatus } from "@/types";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "RECEIVED", label: "Recibido" },
  { status: "IN_DIAGNOSIS", label: "En Diagnóstico" },
  { status: "BUDGETED", label: "Cotizado" },
  { status: "IN_PROGRESS", label: "En Reparación" },
  { status: "IN_REVIEW", label: "Control de Calidad" },
  { status: "READY", label: "Listo para Recoger" },
  { status: "DELIVERED", label: "Entregado" },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  RECEIVED: 0,
  IN_DIAGNOSIS: 1,
  BUDGETED: 2,
  IN_PROGRESS: 3,
  IN_REVIEW: 4,
  READY: 5,
  DELIVERED: 6,
  CANCELLED: -1,
};

interface TimelineProgressProps {
  currentStatus: OrderStatus;
}

export default function TimelineProgress({ currentStatus }: TimelineProgressProps) {
  const currentIndex = STATUS_ORDER[currentStatus] ?? -1;

  if (currentStatus === "CANCELLED") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
        Esta orden ha sido cancelada.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.status} className="flex flex-1 flex-col items-center">
              <div className="relative flex items-center justify-center">
                {index > 0 && (
                  <div
                    className={`absolute right-full top-1/2 h-0.5 w-full -translate-y-1/2 ${
                      index <= currentIndex ? "bg-blue-500" : "bg-gray-200"
                    }`}
                    style={{ width: "calc(100% - 2rem)", right: "50%" }}
                  />
                )}
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isCompleted
                      ? "bg-blue-500 text-white"
                      : isCurrent
                        ? "border-2 border-blue-500 bg-white text-blue-600"
                        : "border-2 border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
              </div>
              <span
                className={`mt-2 text-center text-xs ${
                  isCurrent ? "font-semibold text-blue-600" : isCompleted ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
