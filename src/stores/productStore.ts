import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchSupabaseProducts, products as seed, Product } from "@/data/products";

export interface AdminProduct extends Product {
  stock: number;
}

const seeded: AdminProduct[] = seed.map((p) => ({ ...p, stock: 25 }));

interface ProductStoreState {
  items: AdminProduct[];
  getBySlug: (slug: string) => AdminProduct | undefined;
  getById: (id: string) => AdminProduct | undefined;
  create: (input: Omit<AdminProduct, "id">) => AdminProduct;
  update: (id: string, patch: Partial<Omit<AdminProduct, "id">>) => void;
  remove: (id: string) => void;
  reset: () => void;
  loading: boolean;
  loadFromSupabase: () => Promise<void>;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || `product-${Date.now()}`;

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      items: seeded,
      loading: false,
      loadFromSupabase: async () => {
        set({ loading: true });
        const remoteProducts = await fetchSupabaseProducts();
        set({
          items: remoteProducts.map((p) => ({ ...p, stock: 25 })),
          loading: false,
        });
      },
      getBySlug: (slug) => get().items.find((p) => p.slug === slug),
      getById: (id) => get().items.find((p) => p.id === id),
      create: (input) => {
        const id = `p-${Date.now().toString(36)}`;
        const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.name);
        const product: AdminProduct = { ...input, id, slug };
        set({ items: [product, ...get().items] });
        return product;
      },
      update: (id, patch) => {
        set({
          items: get().items.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...patch,
                  slug: patch.slug ? slugify(patch.slug) : p.slug,
                  specs: { ...p.specs, ...(patch.specs ?? {}) },
                }
              : p,
          ),
        });
      },
      remove: (id) => set({ items: get().items.filter((p) => p.id !== id) }),
      reset: () => set({ items: seeded }),
    }),
    {
      name: "boutique-products",
      storage: createJSONStorage(() => localStorage),
      version: 2,
    },
  ),
);
