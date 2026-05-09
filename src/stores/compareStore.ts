import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/data/products";

export const COMPARE_LIMIT = 3;

interface CompareState {
  items: Product[];
  toggle: (product: Product) => { added: boolean; full: boolean };
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (id) => get().items.some((p) => p.id === id),
      toggle: (product) => {
        const items = get().items;
        const exists = items.some((p) => p.id === product.id);
        if (exists) {
          set({ items: items.filter((p) => p.id !== product.id) });
          return { added: false, full: false };
        }
        if (items.length >= COMPARE_LIMIT) return { added: false, full: true };
        set({ items: [...items, product] });
        return { added: true, full: false };
      },
      remove: (id) => set({ items: get().items.filter((p) => p.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: "boutique-compare", storage: createJSONStorage(() => localStorage) },
  ),
);