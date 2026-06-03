export type OrderStatus =
  | "RECEIVED"
  | "IN_DIAGNOSIS"
  | "BUDGETED"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export interface StatusHistoryEntry {
  id: string;
  status: OrderStatus;
  comment: string | null;
  timestamp: string;
}

export interface VehicleLookupResult {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  currentOrder: OrderLookupResult | null;
}

export interface OrderLookupResult {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  description: string;
  estimatedDelivery: string | null;
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
}

export interface LookupResponse {
  vehicle: VehicleLookupResult;
}

export interface OrderDetailResponse {
  order: OrderLookupResult;
  vehicle: VehicleLookupResult;
}
