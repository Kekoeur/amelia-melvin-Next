import { getInvites } from "@/utils/getter";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const invites = await getInvites();
  return NextResponse.json(invites);
}