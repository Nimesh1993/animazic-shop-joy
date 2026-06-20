import { automationSupabase } from "@/integrations/supabase/automationClient";

export interface SupplierSnapshot {
  id: string;
  supplierName: string;
  snapshotDate: string;
  totalProducts: number;
  newProducts: number;
  updatedProducts: number;
  removedProducts: number;
  fileUrl?: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  notes?: string | null;
  createdAt: string;
}

export interface SupplierSnapshotRow {
  id: string;
  supplier_name: string;
  snapshot_date: string;
  total_products: number;
  new_products: number;
  updated_products: number;
  removed_products: number;
  file_url: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  notes: string | null;
  created_at: string;
}

export const mapSupplierSnapshot = (row: SupplierSnapshotRow): SupplierSnapshot => ({
  id: row.id,
  supplierName: row.supplier_name,
  snapshotDate: row.snapshot_date,
  totalProducts: row.total_products,
  newProducts: row.new_products,
  updatedProducts: row.updated_products,
  removedProducts: row.removed_products,
  fileUrl: row.file_url,
  status: row.status,
  notes: row.notes,
  createdAt: row.created_at,
});

export async function fetchSupplierSnapshots(): Promise<SupplierSnapshot[]> {
  const { data, error } = await automationSupabase
    .from("supplier_snapshots")
    .select("*")
    .order("snapshot_date", { ascending: false });

  if (error) {
    console.error("Failed to fetch supplier snapshots", error);
    return [];
  }

  return (data ?? []).map((row) => mapSupplierSnapshot(row as SupplierSnapshotRow));
}

export async function fetchSupplierSnapshotById(id: string): Promise<SupplierSnapshot | null> {
  const { data, error } = await automationSupabase
    .from("supplier_snapshots")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch supplier snapshot", error);
    return null;
  }

  return data ? mapSupplierSnapshot(data as SupplierSnapshotRow) : null;
}
