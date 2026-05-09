import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/data/products";
import CompareButton from "./CompareButton";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative block animate-fade-in overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:border-primary/40"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur">
          {product.category}
        </span>
        <CompareButton product={product} className="absolute right-4 top-4" />
      </div>
      <div className="flex items-end justify-between gap-4 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.tagline}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-medium">${product.price}</span>
          <ArrowUpRight className="mt-2 h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;