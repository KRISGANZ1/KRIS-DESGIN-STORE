import { db } from "@/lib/db";
import { defaultSettings, StoreSettings } from "@/lib/settings-shared";

export { defaultSettings } from "@/lib/settings-shared";
export type { StoreSettings } from "@/lib/settings-shared";

export async function getStoreSettings(): Promise<StoreSettings> {
  const { rows } = await db.query<{ key: keyof StoreSettings; value: string }>(
    "SELECT key, value FROM store_settings WHERE key = ANY($1)",
    [Object.keys(defaultSettings)],
  );
  return { ...defaultSettings, ...Object.fromEntries(rows.map(({ key, value }) => [key, value])) };
}
