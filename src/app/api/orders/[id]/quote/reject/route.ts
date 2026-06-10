import { proxyToBackend } from "@/lib/bff-proxy";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.text();
  return proxyToBackend(`/orders/${encodeURIComponent(id)}/quote/reject`, {
    method: "POST",
    body,
  });
}
