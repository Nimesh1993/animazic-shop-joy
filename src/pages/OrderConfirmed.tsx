import { Link } from "react-router-dom";
import { Check, Mail, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

const OrderConfirmed = () => {
  const order = useCartStore((s) => s.lastOrder);

  return (
    <main className="min-h-screen bg-background pt-16 text-foreground">
      <div className="container max-w-2xl py-20 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary shadow-[0_0_40px_hsl(var(--primary)/0.4)] animate-scale-in">
            <Check className="h-8 w-8" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-widest text-primary">Order confirmed</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Thank you{order?.name ? `, ${order.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Your order is in. We've sent a receipt to{" "}
            <span className="text-foreground">{order?.email ?? "your email"}</span>.
          </p>
        </div>

        {order ? (
          <div className="mt-12 overflow-hidden rounded-2xl border border-border/60 bg-card">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" /> Order
                <span className="text-foreground">{order.id}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(order.placedAt).toLocaleString()}
              </span>
            </div>

            <ul className="divide-y divide-border/60 px-6">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <div className="h-16 w-16 overflow-hidden rounded-md bg-secondary">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity}{item.warranty ? " · 2-year warranty" : ""}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{fmt(item.unitPrice * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-border/60 px-6 py-5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span className="text-foreground">{fmt(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span><span className="text-foreground">{order.shipping === 0 ? "Free" : fmt(order.shipping)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3 text-base">
                <span className="font-medium">Total paid</span>
                <span className="font-display text-xl font-semibold">{fmt(order.total)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-12 text-center text-muted-foreground">
            We couldn't find a recent order in this browser.
          </p>
        )}

        <div className="mt-10 flex flex-col items-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/">Continue shopping</Link>
          </Button>
          <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" /> Tracking details will arrive within 24 hours.
          </p>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmed;