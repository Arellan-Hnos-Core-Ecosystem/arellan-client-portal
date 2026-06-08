import axios from "axios";

// Public-only API client — for anonymous lookups (no auth required)
const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      "Error de conexion con el servidor";
    return Promise.reject(new Error(message));
  },
);

// ── Public endpoints (no authentication) ──────────────────────────────────────

export async function lookupByPlate(plate: string) {
  const { data } = await publicApi.get(`/public/orders/lookup`, { params: { plate } });
  return data;
}

export async function lookupByOT(otCode: string) {
  const { data } = await publicApi.get(`/public/orders/lookup`, { params: { ot: otCode } });
  return data;
}

export async function getOrderStatus(orderId: string) {
  const { data } = await publicApi.get(`/public/orders/${orderId}`);
  return data;
}

// ── Authenticated endpoints — routed through Next.js BFF (cookie handled server-side) ──

async function bffFetch<T = any>(path: string): Promise<T> {
  const res = await fetch(path, { credentials: "include", cache: "no-store" });
  if (res.status === 401) {
    if (typeof window !== "undefined") window.location.replace("/login");
    throw new Error("Sesion expirada");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? "Error del servidor");
  }
  return res.json() as Promise<T>;
}

export async function getClientVehicles() {
  return bffFetch("/api/vehicles");
}

export async function getClientOrders(limit = 50) {
  return bffFetch(`/api/orders?limit=${limit}`);
}

export async function getClientOrderDetail(orderId: string) {
  return bffFetch(`/api/orders/${encodeURIComponent(orderId)}`);
}

export default publicApi;
