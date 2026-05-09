import { Link } from "react-router-dom";
import { ArrowLeft, GitCompare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/stores/compareStore";
import type { ProductSpecs } from "@/data/products";

const SPEC_ROWS: { key: keyof ProductSpecs; label: string }[] = [
  { key: "battery", label: "Battery Life" },
  { key: "weight", label: "Weight" },
  { key: "processor", label: "Processor" },
  { key: "display", label: "Display" },
  { key: "connectivity", label: "Connectivity" },
  { key: "warranty", label: "Warranty" },
];

const Compare = () => {
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  return (
    <main className="min-h-screen bg-background pt-16 text-foreground">
      <div className="container py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to collection
        </Link>
      </div>

      <div className="container pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
              <GitCompare className="h-3 w-3" /> Side-by-side
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Compare specifications
            </h1>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clear} className="rounded-full">
              Clear all
            </Button>
          )}
        </div>

        {items.length < 2 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border/60 bg-card p-12 text-center">
            <p className="text-muted-foreground">
              Pick at least two products from the collection to compare.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/">Browse the collection</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <div
              className="grid min-w-[640px] gap-px rounded-2xl border border-border/60 bg-border/60 overflow-hidden"
              style={{ gridTemplateColumns: `200px repeat(${items.length}, minmax(0,1fr))` }}
            >
              {/* Header row */}
              <div className="bg-card p-5" />
              {items.map((p) => (
                <div key={p.id} className="relative flex flex-col bg-card p-5">
                  <button
                    onClick={() => remove(p.id)}
                    aria-label={`Remove ${p.name}`}
                    className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-border/60 text-muted-foreground transition hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-widest text-primary">{p.category}</p>
                  <h2 className="mt-1 font-display text-xl font-semibold">{p.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                  <p className="mt-4 font-display text-2xl font-semibold">${p.price}</p>
                  <Button asChild size="sm" className="mt-4 rounded-full">
                    <Link to={`/product/${p.slug}`}>View product</Link>
                  </Button>
                </div>
              ))}

              {/* Spec rows */}
              {SPEC_ROWS.map((row) => (
                <div key={row.key} className="contents">
                  <div className="bg-card/60 p-5 text-xs uppercase tracking-widest text-muted-foreground">
                    {row.label}
                  </div>
                  {items.map((p) => (
                    <div key={p.id + row.key} className="bg-card p-5 text-sm text-foreground/90">
                      {p.specs[row.key] || "—"}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Compare;