import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { unauthorized } from "@/lib/http";

export async function GET() {
  const admin = await requireAdmin(true);
  if (!admin) return unauthorized();
  return NextResponse.json({
    username: admin.username,
    mustChangePassword: admin.must_change_password,
  });
}
