import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/capacity";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date")?.trim() || "";
  if (!date) {
    return NextResponse.json({ error: "Parameter date=YYYY-MM-DD erforderlich." }, { status: 400 });
  }
  const result = await getAvailableSlots(date);
  return NextResponse.json(result);
}
