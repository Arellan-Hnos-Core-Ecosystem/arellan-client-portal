import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      "Error de conexion con el servidor";
    return Promise.reject(new Error(message));
  }
);

export async function lookupByPlate(plate: string) {
  const { data } = await api.get(`/public/orders/lookup`, {
    params: { plate },
  });
  return data;
}

export async function lookupByOT(otCode: string) {
  const { data } = await api.get(`/public/orders/lookup`, {
    params: { ot: otCode },
  });
  return data;
}

export async function getOrderStatus(orderId: string) {
  const { data } = await api.get(`/public/orders/${orderId}`);
  return data;
}

export default api;
