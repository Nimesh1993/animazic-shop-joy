      "Grade-5 titanium frame",
      '6.7" 120Hz LTPO ProMotion',
      "Triple 48MP periscope system",
      "All-day battery, 30-min fast charge",
    ],
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1600&q=80",
    flagship: true,
    hero: true,
    specs: {
      battery: "Up to 28 hrs video",
      weight: "187 g",
      processor: "Nova A18 Bionic, 3nm",
      display: '6.7" LTPO OLED · 120Hz · 2000 nits',
      connectivity: "5G · Wi-Fi 7 · USB-C 3.2",
      warranty: "2 years included",
    },
  },
  {
    id: "p2",
    slug: "echo-pro",
    name: "Echo Pro",
    tagline: "Silence, mastered.",
    category: "Headphones",
    price: 449,
    description:
      "Adaptive noise cancellation that reads the room before you do. 40-hour battery, lossless 24-bit audio, and a leather-wrapped headband milled from a single billet of aluminum.",
    highlights: [
      "Adaptive ANC with spatial audio",
      "40-hour playback",
      "24-bit lossless over USB-C",
      "Memory-foam protein leather pads",
    ],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
    hero: true,
    specs: {
      battery: "40 hrs (ANC on)",
      weight: "248 g",
      processor: "EchoSilence DSP",
      display: "—",
      connectivity: "Bluetooth 5.4 · USB-C lossless",
      warranty: "2 years included",
    },
  },
  {
    id: "p3",
    slug: "halo-ring",
    name: "Halo Ring",
    tagline: "Health, on a finger.",
    category: "Wearable",
    price: 329,
    description:
      "A 2.4mm titanium smart ring with continuous heart-rate, SpO2, sleep staging and skin temperature. Seven-day battery. Zero subscription. Quiet, in the way the best technology should be.",
    highlights: [
      "Aerospace titanium, 2.4mm thin",
      "7-day battery life",
      "Sleep, recovery & readiness scores",
      "No subscription, ever",
    ],
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1600&q=80",
    hero: true,
    specs: {
      battery: "7 days typical",
      weight: "3.6 g",
      processor: "Halo Bio-Sense SoC",
      display: "See product details",
      connectivity: "Bluetooth 5.3 NFC",
      warranty: "1 year included",
    },
  },
];

export interface SupabaseProductRow {
  sku: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  final_price: number;
  star_rating: number;
  media_urls: string[] | null;
  specs: Record<string, unknown>;
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