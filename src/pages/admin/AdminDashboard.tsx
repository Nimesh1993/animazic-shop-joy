import { Link } from "react-router-dom";
import { useEffect } from "react";
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

const publishBadge = (approved?: boolean | null, status?: string | null) => {
  if (status === "published") return { label: "Published", cls: "bg-emerald-500/15 text-emerald-500" };
  if (status === "failed") return { label: "Publish failed", cls: "bg-destructive/15 text-destructive" };
  if (approved) return { label: "Approved", cls: "bg-sky-500/15 text-sky-500" };
  return { label: "Needs approval", cls: "bg-amber-500/15 text-amber-400" };
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
  const approvedCount = items.filter((p) => p.approvedForShopify).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Inventory</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Hero products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the curated catalog, Shopify sync state, and approval status.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/admin/products/new">
            <PlusCircle className="h-4 w-4" /> Add new product
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={items.length.toString()} />
        <Stat label="Total units" value={items.reduce((s, p) => s + p.stock, 0).toString()} />
        <Stat label="Inventory value" value={`INR ${totalValue.toLocaleString()}`} />
        <Stat label="Shopify ready" value={`${approvedCount}/${items.length} approved, ${syncedCount} synced`} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="hidden grid-cols-[1.5fr_0.7fr_0.8fr_1.2fr_auto] gap-4 border-b border-border/60 px-5 py-3 text-xs uppercase tracking-widest text-muted-foreground md:grid">
          <span>Product</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Shopify</span>