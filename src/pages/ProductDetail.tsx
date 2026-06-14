import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ShieldCheck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { WARRANTY_PRICE } from "@/data/products";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import CompareButton from "@/components/store/CompareButton";

const ProductDetail = () => {
  const { slug = "" } = useParams();
  const product = useProductStore((s) => s.getBySlug(slug));
  const loading = useProductStore((s) => s.loading);
  const loadFromSupabase = useProductStore((s) => s.loadFromSupabase);
  const [warranty, setWarranty] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    loadFromSupabase();
  }, [loadFromSupabase]);

  const total = useMemo(() => (product ? product.price + (warranty ? WARRANTY_PRICE : 0) : 0), [product, warranty]);

  if (loading) {
    return (
      <main className="container min-h-screen pt-32">
        <p className="text-muted-foreground">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container min-h-screen pt-32">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/" className="text-primary underline">
          Back home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-16 text-foreground animate-fade-in-slow">
      <div className="container py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to collection
        </Link>
      </div>

      <div className="container grid gap-12 pb-24 md:grid-cols-2 md:gap-16">
        {/* Sticky image */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card">
            <img src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest text-primary">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{product.tagline}</p>

          <div className="mt-6">
            <CompareButton product={product} variant="pill" />
          </div>

          <p className="mt-8 text-base leading-relaxed text-foreground/90">{product.description}</p>

          <ul className="mt-8 space-y-3">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-foreground/85">{h}</span>
              </li>
            ))}
          </ul>

          {/* Warranty toggle */}
          <div className="mt-10 rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <Label htmlFor="warranty" className="cursor-pointer text-base font-medium">
                    Extended 2-Year Warranty
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Accidental damage, battery service, and priority support.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-medium">+${WARRANTY_PRICE}</span>
                <Switch id="warranty" checked={warranty} onCheckedChange={setWarranty} />
              </div>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="mt-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Total</p>
              <p className="font-display text-4xl font-semibold tracking-tight">${total.toLocaleString()}</p>
            </div>
            <Button
              size="lg"
              className="rounded-full px-8 shadow-[0_0_30px_hsl(var(--primary)/0.35)]"
              onClick={() => addItem(product, { warranty })}
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">Free express shipping over $500 · 30-day returns</p>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
