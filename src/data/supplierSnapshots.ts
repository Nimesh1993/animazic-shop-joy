import { automationSupabase } from "@/integrations/supabase/automationClient";

export interface SelectedSupplierSnapshot {
  sku: string;
  supplierId: string;
  supplierName: string;
  unitCost: number;
  shippingCost: number;
  landedCost: number;
  supplierRating: number;
  orderCount: number;
  shipsFrom: string;
  dropshipReady: boolean;
  returnPolicyDays: number;
  qualityScore: number;
  leadTimeDays: number;
  sourceUrl: string;
  capturedAt: string;
}

interface SupabaseSupplierSnapshotRow {
  sku: string;
  supplier_id: string;
  supplier_name: string;
  unit_cost: number;
  shipping_cost: number;
  supplier_rating: number | null;
  order_count: number | null;
  ships_from: string | null;
  dropship_ready: boolean | null;
  return_policy_days: number | null;
  quality_score: number | null;
  lead_time_days: number;
  source_url: string;
  captured_at: string;
}

const mapSupplierSnapshot = (row: SupabaseSupplierSnapshotRow): SelectedSupplierSnapshot => {
  const unitCost = Number(row.unit_cost);
  const shippingCost = Number(row.shipping_cost);

  return {
    sku: row.sku,
    supplierId: row.supplier_id,
    supplierName: row.supplier_name,
    unitCost,
    shippingCost,
    landedCost: unitCost + shippingCost,
    supplierRating: Number(row.supplier_rating ?? 0),
    orderCount: Number(row.order_count ?? 0),
    shipsFrom: row.ships_from ?? "Unknown",
    dropshipReady: Boolean(row.dropship_ready),
    returnPolicyDays: Number(row.return_policy_days ?? 0),
    qualityScore: Number(row.quality_score ?? 0),
    leadTimeDays: Number(row.lead_time_days),
    sourceUrl: row.source_url,
    capturedAt: row.captured_at,
  };
};

export async function fetchSelectedSupplierSnapshots(): Promise<Record<string, SelectedSupplierSnapshot>> {
  const { data, error } = await automationSupabase
    .from("supplier_snapshots")
    .select(
      "sku,supplier_id,supplier_name,unit_cost,shipping_cost,supplier_rating,order_count,ships_from,dropship_ready,return_policy_days,quality_score,lead_time_days,source_url,captured_at",
    )
    .eq("selected_for_listing", true)
    .order("captured_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch selected supplier snapshots", error);
    return {};
  }

  const bySku: Record<string, SelectedSupplierSnapshot> = {};

  for (const row of data ?? []) {
    const mapped = mapSupplierSnapshot(row as SupabaseSupplierSnapshotRow);
    if (!bySku[mapped.sku]) {
      bySku[mapped.sku] = mapped;
    }
  }

  return bySku;
}
