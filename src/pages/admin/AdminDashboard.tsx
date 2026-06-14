import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/stores/productStore";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const items = useProductStore((s) => s.items);
  const loadFromSupabase = useProductStore((s) => s.loadFromSupabase);
  const subscribeToSupabase = useProductStore((s) => s.subscribeToSupabase);
  const remove = useProductStore((s) => s.remove);

  useEffect(() => {
    loadFromSupabase();
    return subscribeToSupabase();
  }, [loadFromSupabase, subscribeToSupabase]);

  const totalUnits = items.reduce((sum, product) => sum + product.stock, 0);
  const syncedCount = items.filter((product) => product.shopifyProductId).length;
  const approvedCount = items.filter((product) => product.approvedForShopify).length;

  return (
    <main className="space-y-8 animate-fade-in">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Inventory</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Hero products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage products, stock, Shopify sync, and approval status.
          </p>
        </div>

        <Button asChild className="rounded-full">
          <Link to="/admin/products/new">
            <PlusCircle className="h-4 w-4" />
            Add new product
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Products</p>
          <p className="mt-2 font-display text-2xl font-semibold">{items.length}</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Total units</p>
          <p className="mt-2 font-display text-2xl font-semibold">{totalUnits}</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Shopify ready</p>
          <p className="mt-2 font-display text-2xl font-semibold">
            {approvedCount}/{items.length} approved, {syncedCount} synced
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        {items.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">No products found.</div>
        ) : (
          items.map((product) => (
            <div
              key={product.id}
              className="grid gap-4 border-b border-border/60 px-5 py-4 md:grid-cols-[1.5fr_0.7fr_0.8fr_1fr_auto] md:items-center"
            >
              <div className="flex items-center gap-3">
                <img src={product.image} alt={product.name} className="h-12 w-12 rounded-md object-cover" />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
              </div>

              <p className="text-sm">INR {product.price.toLocaleString()}</p>
              <p className="text-sm">Stock: {product.stock}</p>

              <div className="space-y-1 text-xs">
                <p>Sync: {product.shopifySyncStatus ?? "not synced"}</p>
                <p>Approval: {product.approvedForShopify ? "approved" : "needs approval"}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/admin/products/${product.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    remove(product.id);
                    toast({ title: "Product deleted", description: product.name });
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default AdminDashboard;
