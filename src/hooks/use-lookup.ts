"use client";

import { useQuery } from "@tanstack/react-query";
import { lookupByPlate, lookupByOT, getOrderStatus } from "@/lib/api";
import type { LookupResponse, OrderDetailResponse } from "@/types";

export function useLookupByPlate(plate: string) {
  return useQuery({
    queryKey: ["lookup", "plate", plate],
    queryFn: () => lookupByPlate(plate),
    select: (data: any): LookupResponse => ({
      found: data?.found ?? false,
      vehicle: data?.vehicle ?? undefined,
      order: data?.order ?? data?.activeOrder ?? undefined,
      message: data?.message,
    }),
    enabled: plate.length >= 4,
    staleTime: 30000,
    retry: 1,
  });
}

export function useLookupByOT(otCode: string) {
  return useQuery({
    queryKey: ["lookup", "ot", otCode],
    queryFn: () => lookupByOT(otCode),
    select: (data: any): LookupResponse => ({
      found: data?.found ?? false,
      vehicle: data?.vehicle ?? undefined,
      order: data?.order ?? undefined,
      message: data?.message,
    }),
    enabled: otCode.length >= 3,
    staleTime: 30000,
    retry: 1,
  });
}

export function useOrderStatus(orderId: string) {
  return useQuery<OrderDetailResponse>({
    queryKey: ["order", orderId],
    queryFn: () => getOrderStatus(orderId),
    enabled: !!orderId,
    staleTime: 15000,
    refetchInterval: 30000,
  });
}
