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
}

export interface ProductSpecs {
  battery: string;
  weight: string;
  processor: string;
  display: string;
  connectivity: string;
  warranty: string;
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
      'A titanium unibody, a 6.7" LTPO display tuned to 2000 nits, and the new A-series neural engine. Aurora X1 is engineered for people who expect more from a phone — and demand it looks the part.',
    highlights: [
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
      weight: "4 g",
      processor: "Halo H1",
      display: "—",
      connectivity: "Bluetooth 5.3",
      warranty: "1 year included",
    },
  },
];