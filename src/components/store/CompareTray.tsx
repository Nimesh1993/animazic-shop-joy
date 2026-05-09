import { Link, useLocation } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPARE_LIMIT, useCompareStore } from "@/stores/compareStore";

const CompareTray = () => {
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const location = useLocation();

  if (items.length === 0 || location.pathname === "/compare") return null;

  const slots = Array.from({ length: COMPARE_LIMIT });

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4 sm:pb-6">
      <div className="pointer-events-auto w-full max-w-3xl animate-fade-in rounded-2xl border border-border/60 bg-card/90 p-3 shadow-elegant backdrop-blur-xl sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            {slots.map((_, i) => {
              const item = items[i];
              if (!item) {
                return (
                  <div
                    key={`empty-${i}`}
                    className="hidden h-14 w-14 flex-shrink-0 rounded-md border border-dashed border-border/60 sm:block"
                    aria-hidden
                  />
                );
              }
              return (
                <div key={item.id} className="relative flex-shrink-0">
                  <div className="h-14 w-14 overflow-hidden rounded-md border border-border/60 bg-secondary">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            <div className="ml-2 hidden text-xs text-muted-foreground sm:block">
              {items.length}/{COMPARE_LIMIT} selected
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button
              onClick={clear}
              className="text-xs text-muted-foreground transition hover:text-foreground"
            >
              Clear
            </button>
            <Button asChild size="sm" disabled={items.length < 2} className="rounded-full">
              <Link to="/compare">
                {items.length < 2 ? "Add 1 more to compare" : "View comparison"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareTray;