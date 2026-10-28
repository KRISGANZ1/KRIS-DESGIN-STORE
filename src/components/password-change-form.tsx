"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function PasswordChangeForm({ mustChange }: { mustChange: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("newPassword") || "");
    if (newPassword !== form.get("confirmPassword")) {
      setError("Konfirmasi password baru tidak sama.");
      setBusy(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.get("currentPassword"), newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Password tidak dapat diperbarui.");
      setSuccess("Password berhasil diperbarui.");
      router.replace("/admin");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Password tidak dapat diperbarui.");
    } finally {
      setBusy(false);
    }
  }
  return <form className="admin-login-form" onSubmit={submit}>
    {mustChange && <p className="notice">Demi keamanan, ubah password awal sebelum menggunakan dashboard.</p>}
    <label>Password saat ini<input name="currentPassword" type="password" autoComplete="current-password" required /></label>
    <label>Password baru (minimal 12 karakter)<input name="newPassword" type="password" autoComplete="new-password" minLength={12} required /></label>
    <label>Ulangi password baru<input name="confirmPassword" type="password" autoComplete="new-password" minLength={12} required /></label>
    {error && <p className="form-error" role="alert">{error}</p>}{success && <p className="form-success">{success}</p>}
    <button className="button" disabled={busy}>{busy ? "Menyimpan..." : "Perbarui password"} <span>↗</span></button>
  </form>;
}
