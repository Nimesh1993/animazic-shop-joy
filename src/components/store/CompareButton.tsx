import { GitCompare, Check } from "lucide-react";
import { Product } from "@/data/products";
import { useCompareStore } from "@/stores/compareStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  variant?: "icon" | "pill";
  className?: string;
}

const CompareButton = ({ product, variant = "icon", className }: Props) => {
  const has = useCompareStore((s) => s.has(product.id));
  const toggle = useCompareStore((s) => s.toggle);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = toggle(product);
    if (res.full) {
      toast({ title: "Compare tray is full", description: "Remove one to add another (max 3)." });
    } else if (res.added) {
      toast({ title: "Added to compare", description: product.name });
    }
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-2 text-sm transition hover:border-primary/60 hover:text-primary",
          has && "border-primary/60 bg-primary/10 text-primary",
          className,
        )}
      >
        {has ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />}
        {has ? "Added to compare" : "Compare"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={has ? "Remove from compare" : "Add to compare"}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background/70 text-muted-foreground backdrop-blur transition hover:border-primary/60 hover:text-primary",
        has && "border-primary/60 bg-primary/15 text-primary",
        className,
      )}
    >
      {has ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />}
    </button>
  );
};

export default CompareButton;