import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
