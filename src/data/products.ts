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
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "aurora-x1",
    name: "Aurora X1",
    tagline: "The flagship phone, redefined.",
    category: "Smartphone",
    price: 1299,
    description:
      "A titanium unibody, a 6.7\" LTPO display tuned to 2000 nits, and the new A-series neural engine. Aurora X1 is engineered for people who expect more from a phone — and demand it looks the part.",
    highlights: [
      "Grade-5 titanium frame",
      "6.7\" 120Hz LTPO ProMotion",
      "Triple 48MP periscope system",
      "All-day battery, 30-min fast charge",
    ],
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1600&q=80",
    flagship: true,
    hero: true,
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
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
    hero: true,
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
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1600&q=80",
    hero: true,
  },
  {
    id: "p4",
    slug: "lumen-go",
    name: "Lumen Go",
    tagline: "Cinema, anywhere.",
    category: "Projector",
    price: 899,
    description:
      "A pocket-sized 4K laser projector with auto keystone, auto focus and a 120-inch picture from just under three meters. Built-in Dolby Atmos speakers and a 3-hour internal battery.",
    highlights: [
      "True 4K triple-laser engine",
      "Up to 120\" image",
      "Dolby Atmos, dual 8W drivers",
      "3-hour internal battery",
    ],
    image:
      "https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&w=1600&q=80",
    hero: true,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const flagship = () => products.find((p) => p.flagship) ?? products[0];

export const WARRANTY_PRICE = 49;