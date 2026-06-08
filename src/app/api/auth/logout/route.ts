import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("arellan-client-token");
  response.cookies.delete("arellan-client-display");
  return response;
}
