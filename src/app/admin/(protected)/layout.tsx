import { ReactNode } from "react";
import { AdminShell } from "@/components/admin-shell";
import { requireAdminPage } from "@/lib/auth";
import { getStoreSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdminPage();
  const settings = await getStoreSettings();
  return <AdminShell username={admin.username} storeName={settings.store_name} developerCredit={settings.developer_credit}>{children}</AdminShell>;
}
