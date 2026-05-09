import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore, cartTotals } from "@/stores/cartStore";

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

const Checkout = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const placeOrder = useCartStore((s) => s.placeOrder);
  const { subtotal, count } = cartTotals(items);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 19;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setTimeout(() => {
      const order = placeOrder({ name, email });
      if (order) navigate("/order-confirmed");
      setSubmitting(false);
    }, 700);
  };

  return (
    <main className="min-h-screen bg-background pt-16 text-foreground">
      <div className="container py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
      </div>

      <div className="container grid gap-12 pb-24 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={onSubmit} className="animate-fade-in space-y-8">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Checkout
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Demo only — no payment will be processed.
            </p>
          </div>

          <section className="space-y-4 rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Contact
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Parker" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@hello.com" />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border/60 bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Payment
              </h2>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" /> Demo mode
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card">Card number</Label>
              <Input id="card" required inputMode="numeric" value={card} onChange={(e) => setCard(e.target.value)} placeholder="4242 4242 4242 4242" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="exp">Expiry</Label>
                <Input id="exp" required value={exp} onChange={(e) => setExp(e.target.value)} placeholder="MM / YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" required value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" />
              </div>
            </div>
          </section>

          <Button
            type="submit"
            size="lg"
            disabled={submitting || items.length === 0}
            className="w-full rounded-full text-base shadow-[0_0_30px_hsl(var(--primary)/0.35)]"
          >
            {submitting ? "Processing…" : `Pay ${fmt(total)}`}
          </Button>
        </form>

        <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <p className="text-xs text-muted-foreground">{count} item{count !== 1 ? "s" : ""}</p>

          {items.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">Your bag is empty.</p>
          ) : (
            <ul className="mt-5 divide-y divide-border/60">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-3">
                  <div className="h-14 w-14 overflow-hidden rounded-md bg-secondary">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col text-sm">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-xs text-muted-foreground">Qty {item.quantity}{item.warranty ? " · 2-yr warranty" : ""}</span>
                  </div>
                  <span className="text-sm font-medium">{fmt(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 space-y-2 border-t border-border/60 pt-5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span className="text-foreground">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span><span className="text-foreground">{shipping === 0 ? "Free" : fmt(shipping)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-base">
              <span className="font-medium">Total</span>
              <span className="font-display text-xl font-semibold">{fmt(total)}</span>
            </div>
          </div>

          <p className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" /> Encrypted demo checkout
          </p>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;