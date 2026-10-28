"use client";

import { useState } from "react";

export function AdminOrderStatus({ orderId, initialStatus }: { orderId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState("");
  async function update(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    setError("");
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Status tidak dapat diperbarui.");
      return;
    }
    setStatus(data.status);
  }
  return <div><select className="status-select" value={status} onChange={update}><option value="pending">Menunggu</option><option value="paid">Dibayar</option><option value="fulfilled">Selesai</option><option value="cancelled">Dibatalkan</option></select>{error && <small className="form-error">{error}</small>}</div>;
}
