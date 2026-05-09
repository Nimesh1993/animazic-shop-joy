
# Animazic E-Commerce Storefront

Your Shopify store is connected (`u7kwes-d9.myshopify.com`). The current animazic.com site is a default Shopify "Opening soon" placeholder using a bold blue geometric brand identity. I'll build a custom Lovable storefront that pulls live products from Shopify and handles cart + checkout via the Storefront API.

## Design direction

Inspired by your existing brand:
- **Palette**: deep electric blue (`#1a4fbf`), pale ice blue (`#dceafd`), off-white background, charcoal text
- **Typography**: elegant serif display headings (Playfair-style) + clean sans body, matching the "Animazic" wordmark
- **Vibe**: bold geometric blocks, airy layout, premium electronics & gadgets feel

## Pages & structure

```text
/                  Hero + featured products grid
/shop              Full product catalog with filters
/product/:handle   Product detail (gallery, variants, add to cart)
/cart drawer      Slide-over cart (global)
```

Sections on home:
1. Sticky header — logo, nav (Shop, About), cart icon with badge
2. Hero — large brand statement + CTA "Shop now", geometric blue background
3. Featured products — 3–4 product cards
4. Category / value-prop strip (free shipping, secure checkout, etc.)
5. Full product grid
6. Footer — socials (Instagram, TikTok), links

## Shopify integration

- Storefront API v2025-07 via `storefrontApiRequest` helper
- Zustand cart store with `localStorage` persistence
- Real cart created on first add via `cartCreate` mutation
- Checkout opens Shopify-hosted checkout in a new tab with `channel=online_store`
- `useCartSync` hook clears cart after successful checkout
- No mock products — empty state shows "No products yet" if catalog is empty (I'll prompt you to add products)

## Technical pieces

- `src/lib/shopify.ts` — API client, GraphQL queries, cart mutations
- `src/stores/cartStore.ts` — Zustand store (items, cartId, checkoutUrl, add/update/remove/sync)
- `src/hooks/useCartSync.ts` — visibility-based cart sync
- `src/hooks/useProducts.ts` — React Query hook for product fetching
- `src/components/` — Header, Hero, ProductCard, ProductGrid, CartDrawer, Footer
- `src/pages/` — Index, Shop, ProductDetail, NotFound
- Design tokens in `index.css` + `tailwind.config.ts` (HSL semantic colors, gradients, shadows)
- Routes wired in `App.tsx` with `useCartSync()` mounted globally

## After build

I'll query your Shopify store; if it's empty I'll ask you to add products by simply telling me the name + price (I can create them directly in Shopify).
