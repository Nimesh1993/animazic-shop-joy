import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, Pencil, PlusCircle, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProductStore } from "@/stores/productStore";
import { toast } from "@/hooks/use-toast";

const stockBadge = (stock: number) => {
  if (stock <= 0) return { label: "Out of stock", cls: "bg-destructive/15 text-destructive" };
  if (stock < 10) return { label: `Low - ${stock}`, cls: "bg-amber-500/15 text-amber-400" };
  return { label: `In stock - ${stock}`, cls: "bg-primary/15 text-primary" };
};

const syncBadge = (status?: string | null) => {
  if (status === "created" || status === "updated") {
    return {
      label: status === "created" ? "Created" : "Updated",
      cls: "bg-emerald-500/15 text-emerald-500",
      icon: CheckCircle2,
    };
  }

  if (status === "failed") {
    return {
      label: "Failed",
      cls: "bg-destructive/15 text-destructive",
      icon: XCircle,
    };
  }

  return {
    label: "Not synced",
    cls: "bg-muted text-muted-foreground",
    icon: Clock3,
  };
};

const AdminDashboard = () => {
  const items = useProductStore((s) => s.items);
  const loadFromSupabase = useProductStore((s) => s.loadFromSupabase);
  const subscribeToSupabase = useProductStore((s) => s.subscribeToSupabase);
  const remove = useProductStore((s) => s.remove);

  useEffect(() => {
    loadFromSupabase();
    return subscribeToSupabase();
  }, [loadFromSupabase, subscribeToSupabase]);

  const totalValue = items.reduce((s, p) => s + p.price * p.stock, 0);
  const syncedCount = items.filter((p) => p.shopifyProductId).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Inventory</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Hero products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the curated catalog and Shopify sync status.</p>
        </div>

        <Button asChild className="rounded-full">
          <Link to="/admin/products/new">
            <PlusCircle className="h-4 w-4" /> Add new product
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Products" value={items.length.toString()} />
        <Stat label="Total units" value={items.reduce((s, p) => s + p.stock, 0).toString()} />
        <Stat label="Inventory value" value={`₹${totalValue.toLocaleString()}`} />
        <Stat label="Shopify synced" value={`${syncedCount}/${items.length}`} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="hidden grid-cols-[1.5fr_0.7fr_0.8fr_1.2fr_auto] gap-4 border-b border-border/60 px-5 py-3 text-xs uppercase tracking-widest text-muted-foreground md:grid">
          <span>Product</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Shopify</span>
          <span className="text-right">Actions</span>
        </div>

        <ul className="divide-y divide-border/60">
          {items.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              No products yet. Click Add new product.
            </li>
          )}

          {items.map((p) => {
            const badge = stockBadge(p.stock);
            const shopifyBadge = syncBadge(p.shopifySyncStatus);
            const ShopifyIcon = shopifyBadge.icon;

            return (
              <li
                key={p.id}
                className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1.5fr_0.7fr_0.8fr_1.2fr_auto] md:items-center md:gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.category}</p>
                  </div>
                </div>

                <div className="text-sm">₹{p.price.toLocaleString()}</div>

                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs ${badge.cls}`}>{badge.label}</span>
                </div>

                <div className="space-y-1">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${shopifyBadge.cls}`}
                  >
                    <ShopifyIcon className="h-3 w-3" />
                    {shopifyBadge.label}
                  </span>

                  {p.shopifyLastSyncedAt && (
                    <p className="text-xs text-muted-foreground">{new Date(p.shopifyLastSyncedAt).toLocaleString()}</p>
                  )}

                  {p.shopifyProductId && (
                    <p className="max-w-[180px] truncate text-xs text-muted-foreground" title={p.shopifyProductId}>
                      {p.shopifyProductId}
                    </p>
                  )}

                  {p.shopifyError && (
                    <p className="max-w-[180px] truncate text-xs text-destructive" title={p.shopifyError}>
                      {p.shopifyError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/admin/products/${p.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {p.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This removes the product from your catalog. You can add it back later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            remove(p.id);
                            toast({ title: "Product deleted", description: p.name });
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-border/60 bg-card p-5">
    <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
  </div>
);

export default AdminDashboard;
