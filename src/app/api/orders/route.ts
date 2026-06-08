import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get("limit") ?? "50";
  const validated = Math.min(Math.max(1, parseInt(limit, 10) || 50), 200);
  return proxyToBackend(`/orders?limit=${validated}`);
}
