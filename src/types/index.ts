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
  status: OrderStatus;
  timestamp: string;
  comment?: string | null;
}

export interface VehicleInfo {
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string | null;
}

export interface OrderInfo {
  id: string;
  number: string;
  status: OrderStatus;
  description: string;
  receivedAt: string;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  statusHistory: StatusHistoryEntry[];
}

export interface LookupResponse {
  found: boolean;
  vehicle?: VehicleInfo;
  order?: OrderInfo | null;
  activeOrder?: null;
  message?: string;
}

export interface OrderDetailResponse {
  order: OrderInfo;
  vehicle: VehicleInfo;
}
