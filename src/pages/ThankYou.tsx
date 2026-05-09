import { Link } from "react-router-dom";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";

const ThankYou = () => {
  const lastOrder = useCartStore((s) => s.lastOrder);

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-16 w-16 text-primary" aria-hidden="true" />
            <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight">
              Thank you for your order
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your checkout was completed with Shopify. A confirmation email is on its way.
            </p>
          </div>

          {lastOrder && lastOrder.items.length > 0 ? (
            <section className="mt-8" aria-label="Order summary">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Order summary
              </h2>
              <ul className="mt-4 divide-y divide-border">
                {lastOrder.items.map((item) => {
                  const img = item.product.node.images?.edges?.[0]?.node;
                  const lineTotal = parseFloat(item.price.amount) * item.quantity;
                  return (
                    <li key={item.variantId} className="flex gap-4 py-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        {img ? (
                          <img
                            src={img.url}
                            alt={img.altText || item.product.node.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <ShoppingBag className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <p className="font-medium">{item.product.node.title}</p>
                        {item.selectedOptions?.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {item.selectedOptions.map((o) => o.value).join(" • ")}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                      </div>
                      <p className="font-semibold">
                        {item.price.currencyCode} {lineTotal.toFixed(2)}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="text-base font-semibold">Total</span>
                <span className="text-lg font-bold">
                  {lastOrder.currencyCode} {lastOrder.total.toFixed(2)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Placed {new Date(lastOrder.placedAt).toLocaleString()}
              </p>
            </section>
          ) : (
            <p className="mt-8 text-center text-muted-foreground">
              We couldn't find a recent order in this browser, but if your checkout completed
              you'll receive an email confirmation shortly.
            </p>
          )}

          <div className="mt-8 flex justify-center">
            <Button asChild size="lg">
              <Link to="/">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYou;