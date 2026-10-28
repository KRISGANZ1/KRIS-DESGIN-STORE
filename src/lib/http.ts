import { NextResponse } from "next/server";

export function unauthorized() {
  return NextResponse.json({ error: "Authentication required." }, { status: 401 });
}

export function serverError(message = "Terjadi kesalahan. Silakan coba kembali.") {
  return NextResponse.json({ error: message }, { status: 500 });
}
