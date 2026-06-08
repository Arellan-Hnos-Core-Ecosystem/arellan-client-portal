import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/v1";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ message: "No se puede conectar con el servidor" }, { status: 503 });
  }

  const data = await res.json() as Record<string, unknown>;

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const user = data.user as Record<string, unknown> | undefined;
  const accessToken = data.accessToken as string | undefined;

  if (user?.role !== "CLIENT") {
    return NextResponse.json(
      { message: "Este portal es exclusivo para clientes." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ user });

  // Token stored HttpOnly — JS on client cannot read it
  response.cookies.set("arellan-client-token", accessToken ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 86400,
    path: "/",
  });

  // Non-sensitive display cookie for UI (name only)
  response.cookies.set(
    "arellan-client-display",
    JSON.stringify({ name: user.name, id: user.id }),
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
      path: "/",
    },
  );

  return response;
}
