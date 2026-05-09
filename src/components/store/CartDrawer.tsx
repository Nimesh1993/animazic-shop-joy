import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore, cartTotals } from "@/stores/cartStore";

const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

const CartDrawer = () => {
  const { isOpen, close, items, updateQuantity, removeItem } = useCartStore();
  const { subtotal, count } = cartTotals(items);
  const navigate = useNavigate();

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : close())}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-border/60 bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border/60 px-6 py-5 text-left">
          <SheetTitle className="font-display text-lg">
            Your bag <span className="text-muted-foreground">({count})</span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Button variant="outline" onClick={close}>Keep browsing</Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border/60 overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <Link
                    to={`/product/${item.product.slug}`}
                    onClick={close}
                    className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-secondary"
                  >
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.product.category}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground transition hover:text-foreground"
                        aria-label="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {item.warranty && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                        <ShieldCheck className="h-3 w-3" /> 2-year warranty
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border/60">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center text-muted-foreground transition hover:text-foreground"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="grid h-8 w-8 place-items-center text-muted-foreground transition hover:text-foreground"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-medium">{fmt(item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/60 px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">{fmt(subtotal)}</span>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  close();
                  navigate("/checkout");
                }}
              >
                Checkout — {fmt(subtotal)}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Free express shipping on orders over $500
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;