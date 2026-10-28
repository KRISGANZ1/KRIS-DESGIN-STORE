"use client";

import { FormEvent, useEffect, useState } from "react";
import { defaultSettings, StoreSettings } from "@/lib/settings-shared";

const fields: Array<{ key: keyof StoreSettings; label: string; type?: string; help?: string }> = [
  { key: "store_name", label: "Nama website" },
  { key: "logo_url", label: "URL logo toko", help: "Gunakan URL gambar https." },
  { key: "instagram_username", label: "Username Instagram" },
  { key: "instagram_url", label: "URL Instagram", type: "url" },
  { key: "whatsapp_number", label: "WhatsApp admin", help: "Format internasional tanpa tanda plus, misalnya 62812..." },
  { key: "developer_credit", label: "Credit developer" },
  { key: "footer_info", label: "Informasi footer", type: "textarea" },
  { key: "site_title", label: "Judul website / metadata" },
  { key: "site_description", label: "Deskripsi metadata", type: "textarea" },
];

export function AdminSettingsForm() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings").then(async (response) => {
      if (!response.ok) throw new Error("Pengaturan toko tidak dapat dimuat.");
      setSettings(await response.json());
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Pengaturan toko tidak dapat dimuat."))
      .finally(() => setLoading(false));
  }, []);

  function change(key: keyof StoreSettings, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Pengaturan tidak dapat disimpan.");
      return;
    }
    setSettings(data);
    setNotice("Pengaturan tersimpan dan akan digunakan di halaman website.");
  }

  if (loading) return <p className="muted">Memuat pengaturan…</p>;
  return <form className="settings-form" onSubmit={submit}>
    <div className="settings-grid">{fields.map(({ key, label, type, help }) => <label key={key} className={type === "textarea" ? "wide-field" : ""}>{label}
      {type === "textarea" ? <textarea value={settings[key]} onChange={(event) => change(key, event.target.value)} rows={3} /> : <input type={type || "text"} value={settings[key]} onChange={(event) => change(key, event.target.value)} />}
      {help && <small>{help}</small>}</label>)}</div>
    {error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success">{notice}</p>}
    <button className="button">Simpan pengaturan <span>↗</span></button>
  </form>;
}
