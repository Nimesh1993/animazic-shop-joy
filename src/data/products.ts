import { automationSupabase } from "@/integrations/supabase/automationClient";

export const WARRANTY_PRICE = 49;

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  description: string;
  highlights: string[];
  image: string;
  gallery?: string[];
  hero?: boolean;
  flagship?: boolean;
  specs: ProductSpecs;
  shopifyProductId?: string | null;
  shopifyVariantId?: string | null;
  shopifyInventoryItemId?: string | null;
  shopifySyncStatus?: "created" | "updated" | "failed" | null;
  shopifyLastSyncedAt?: string | null;
  shopifyError?: string | null;
  approvedForShopify?: boolean | null;
  shopifyPublishStatus?: "draft" | "published" | "failed" | null;
  shopifyPublishedAt?: string | null;
  shopifyPublishError?: string | null;
}

export interface ProductSpecs {
  battery: string;
  weight: string;
  processor: string;
  display: string;
  connectivity: string;
  warranty: string;
}

export const products: Product[] = [];

export interface SupabaseProductRow {
  sku: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  final_price: number;
  star_rating: number;
  media_urls: string[] | null;
  specs: Record<string, unknown> | null;
  warranty_months: number;
  return_window_days: number;
  flagged_for_admin: boolean;
  shopify_product_id: string | null;
  shopify_variant_id: string | null;
  shopify_inventory_item_id: string | null;
  shopify_sync_status: "created" | "updated" | "failed" | null;
  shopify_last_synced_at: string | null;
  shopify_error: string | null;
  approved_for_shopify: boolean | null;
  shopify_publish_status: "draft" | "published" | "failed" | null;
  shopify_published_at: string | null;
  shopify_publish_error: string | null;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const mapSupabaseProduct = (row: SupabaseProductRow): Product => {
  const specs = row.specs ?? {};

  return {
    id: row.sku,
    slug: slugify(row.name),
    name: row.name,
    tagline: `${row.brand} ${row.category}`,
    category: row.category,
    price: Number(row.final_price),
    description: row.description,
    highlights: [
      `${Number(row.star_rating).toFixed(1)} star rating`,
      `${row.warranty_months}-month warranty`,
      `${row.return_window_days}-day returns`,
      ...Object.entries(specs)
        .slice(0, 2)
        .map(([key, value]) => `${key}: ${String(value)}`),
    ],
    image: row.media_urls?.[0] ?? "/placeholder.svg",
    gallery: row.media_urls ?? [],
    specs: {
      battery: String(specs.Battery ?? specs.battery ?? "See product details"),
      weight: String(specs.Weight ?? specs.weight ?? "See product details"),
      processor: String(specs.CPU ?? specs.processor ?? "See product details"),
      display: String(specs.Display ?? specs.display ?? "See product details"),
      connectivity: String(specs.Bluetooth ?? specs.connectivity ?? "See product details"),
      warranty: `${row.warranty_months} months included`,
    },
    shopifyProductId: row.shopify_product_id,
    shopifyVariantId: row.shopify_variant_id,
    shopifyInventoryItemId: row.shopify_inventory_item_id,
    shopifySyncStatus: row.shopify_sync_status,
    shopifyLastSyncedAt: row.shopify_last_synced_at,
    shopifyError: row.shopify_error,
    approvedForShopify: row.approved_for_shopify,
    shopifyPublishStatus: row.shopify_publish_status,
    shopifyPublishedAt: row.shopify_published_at,
    shopifyPublishError: row.shopify_publish_error,
  };
};

export async function fetchSupabaseProducts(): Promise<Product[]> {
  const { data, error } = await automationSupabase
    .from("products")
    .select(
      "sku,name,category,brand,description,final_price,star_rating,media_urls,specs,warranty_months,return_window_days,flagged_for_admin,shopify_product_id,shopify_variant_id,shopify_inventory_item_id,shopify_sync_status,shopify_last_synced_at,shopify_error,approved_for_shopify,shopify_publish_status,shopify_published_at,shopify_publish_error",
    )
    .eq("flagged_for_admin", false)
    .order("star_rating", { ascending: false });

  if (error) {
    console.error("Failed to fetch Supabase products", error);
    return products;
  }

  return (data ?? []).map((row) => mapSupabaseProduct(row as SupabaseProductRow));
}
