import { proxyToBackend } from "@/lib/bff-proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  return proxyToBackend("/vehicles");
}
