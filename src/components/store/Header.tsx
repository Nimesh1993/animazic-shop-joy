import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCartStore, cartTotals } from "@/stores/cartStore";

const Header = () => {
  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.open);
  const { count } = cartTotals(items);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight">
          Anima<span className="text-primary">zic</span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/" className="transition hover:text-foreground">Shop</Link>
          <a href="#products" className="transition hover:text-foreground">Collection</a>
          <a href="#story" className="transition hover:text-foreground">Story</a>
        </nav>
        <button
          onClick={open}
          className="relative inline-flex h-10 items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 text-sm transition hover:border-primary/60 hover:text-primary"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Cart</span>
          {count > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;