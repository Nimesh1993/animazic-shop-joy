import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, flagship } from "@/data/products";
import ProductCard from "@/components/store/ProductCard";

const Index = () => {
  const hero = flagship();
  const others = products.filter((p) => p.id !== hero.id);

  return (
    <main className="min-h-screen bg-background pt-16 text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container relative grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" /> New flagship · 2026
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              {hero.name}.
              <br />
              <span className="text-muted-foreground">{hero.tagline}</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to={`/product/${hero.slug}`}>
                  Buy from ${hero.price} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href="#products">Explore the lab</a>
              </Button>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute -inset-8 rounded-[3rem] bg-primary/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-elegant">
              <img
                src={hero.image}
                alt={hero.name}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collection grid */}
      <section id="products" className="container py-20 md:py-28">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">The collection</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              A short list of <em className="not-italic text-muted-foreground">very</em> good things.
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            Four products. Each one obsessed over for years before it shipped.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Story strip */}
      <section id="story" className="border-t border-border/60 bg-secondary/30">
        <div className="container grid gap-10 py-20 md:grid-cols-3">
          {[
            { t: "Engineered, not assembled", d: "Every component, every screw, every line of firmware — designed in-house." },
            { t: "Quietly excessive", d: "We over-spec materials and under-spec marketing. The product does the talking." },
            { t: "Built to outlast", d: "Two-year warranty standard. Repairable. Software supported for at least seven years." },
          ].map((b) => (
            <div key={b.t}>
              <h3 className="font-display text-xl font-semibold">{b.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 NOVA/LAB. A demo storefront.</p>
          <p>Designed in California. Made on Earth.</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;