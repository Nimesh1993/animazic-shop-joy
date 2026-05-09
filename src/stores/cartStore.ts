import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, WARRANTY_PRICE } from "@/data/products";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  warranty: boolean;
  unitPrice: number;
}

export interface PlacedOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  email: string;
  name: string;
  placedAt: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastOrder: PlacedOrder | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (product: Product, opts?: { warranty?: boolean; quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  placeOrder: (info: { name: string; email: string }) => PlacedOrder | null;
}

const lineId = (productId: string, warranty: boolean) => `${productId}${warranty ? ":w" : ""}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastOrder: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      addItem: (product, opts) => {
        const warranty = !!opts?.warranty;
        const quantity = opts?.quantity ?? 1;
        const id = lineId(product.id, warranty);
        const unitPrice = product.price + (warranty ? WARRANTY_PRICE : 0);
        const items = [...get().items];
        const idx = items.findIndex((i) => i.id === id);
        if (idx >= 0) items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
        else items.push({ id, product, quantity, warranty, unitPrice });
        set({ items, isOpen: true });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) return get().removeItem(id);
        set({ items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)) });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clearCart: () => set({ items: [] }),
      placeOrder: ({ name, email }) => {
        const items = get().items;
        if (items.length === 0) return null;
        const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
        const shipping = subtotal > 500 ? 0 : 19;
        const order: PlacedOrder = {
          id: `ORD-${Date.now().toString(36).toUpperCase()}`,
          items: items.map((i) => ({ ...i })),
          subtotal,
          shipping,
          total: subtotal + shipping,
          name,
          email,
          placedAt: new Date().toISOString(),
        };
        set({ lastOrder: order, items: [], isOpen: false });
        return order;
      },
    }),
    {
      name: "boutique-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, lastOrder: s.lastOrder }),
    },
  ),
);

export const cartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  return { subtotal, count };
};