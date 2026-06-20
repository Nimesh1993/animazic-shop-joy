import * as React from "react";
import { Link } from "react-router-dom";
import { automationSupabase } from "@/integrations/supabase/automationClient";
import { useProductStore } from "@/stores/productStore";
import { toast } from "@/hooks/use-toast";
import { fetchSelectedSupplierSnapshots, SelectedSupplierSnapshot } from "@/data/supplierSnapshots";

const getPublishLabel = (product: { approvedForShopify?: boolean | null; shopifyPublishStatus?: string | null }) => {
  if (product.shopifyPublishStatus === "published") return "published";
  if (product.shopifyPublishStatus === "failed") return "publish failed";
  if (product.approvedForShopify) return "approved draft";
  return "needs approval";
};

const AdminDashboard = () => {
  const items = useProductStore((s) => s.items);
  const loadFromSupabase = useProductStore((s) => s.loadFromSupabase);
  const subscribeToSupabase = useProductStore((s) => s.subscribeToSupabase);
  const remove = useProductStore((s) => s.remove);
  const [suppliersBySku, setSuppliersBySku] = React.useState<Record<string, SelectedSupplierSnapshot>>({});

  const loadSuppliers = React.useCallback(async () => {
    const suppliers = await fetchSelectedSupplierSnapshots();
    setSuppliersBySku(suppliers);
  }, []);
  React.useEffect(() => {
    loadFromSupabase();
    loadSuppliers();

    const unsubscribeProducts = subscribeToSupabase();

    return () => {
      unsubscribeProducts();
    };
  }, [loadFromSupabase, loadSuppliers, subscribeToSupabase]);

  const approveProduct = async (sku: string, name: string) => {
    const { error } = await automationSupabase
      .from("products")
      .update({
        approved_for_shopify: true,
        shopify_publish_status: "draft",
        shopify_publish_error: null,
      })
      .eq("sku", sku);

    if (error) {
      toast({ title: "Approval failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Product approved", description: name });
    await loadFromSupabase();
  };

  const totalUnits = items.reduce((sum, product) => sum + product.stock, 0);
  const syncedCount = items.filter((product) => product.shopifyProductId).length;
  const approvedDraftCount = items.filter(
    (product) => product.approvedForShopify && product.shopifyPublishStatus !== "published",
  ).length;
  const publishedCount = items.filter((product) => product.shopifyPublishStatus === "published").length;
  const failedCount = items.filter((product) => product.shopifyPublishStatus === "failed").length;

  return React.createElement(
    "main",
    { className: "space-y-8 animate-fade-in" },

    React.createElement(
      "section",
      { className: "flex flex-wrap items-end justify-between gap-4" },
      React.createElement(
        "div",
        null,
        React.createElement("p", { className: "text-xs uppercase tracking-widest text-primary" }, "Inventory"),
        React.createElement(
          "h1",
          { className: "mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl" },
          "Hero products",
        ),
        React.createElement(
          "p",
          { className: "mt-1 text-sm text-muted-foreground" },
          "Manage products, stock, Shopify sync, approval, and publish status.",
        ),
      ),
      React.createElement(
        Link,
        {
          to: "/admin/products/new",
          className: "rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground",
        },
        "Add new product",
      ),
    ),

    React.createElement(
      "section",
      { className: "grid gap-4 sm:grid-cols-3" },
      React.createElement(
        "div",
        { className: "rounded-2xl border border-border/60 bg-card p-5" },
        `Products: ${items.length}`,
      ),
      React.createElement(
        "div",
        { className: "rounded-2xl border border-border/60 bg-card p-5" },
        `Total units: ${totalUnits}`,
      ),
      React.createElement(
        "div",
        { className: "rounded-2xl border border-border/60 bg-card p-5" },
        `Shopify: ${syncedCount} synced, ${approvedDraftCount} approved draft, ${publishedCount} published, ${failedCount} failed`,
      ),
    ),

    React.createElement(
      "section",
      { className: "overflow-hidden rounded-2xl border border-border/60 bg-card" },
      items.length === 0
        ? React.createElement(
            "div",
            { className: "px-5 py-10 text-center text-sm text-muted-foreground" },
            "No products found.",
          )
        : items.map((product) =>
            React.createElement(
              "div",
              {
                key: product.id,
                className:
                  "grid gap-4 border-b border-border/60 px-5 py-4 md:grid-cols-[1.5fr_0.7fr_0.8fr_1fr_auto] md:items-center",
              },
              React.createElement(
                "div",
                null,
                React.createElement("p", { className: "font-medium" }, product.name),
                React.createElement("p", { className: "text-xs text-muted-foreground" }, product.category),
              ),
              React.createElement("p", { className: "text-sm" }, `INR ${product.price.toLocaleString()}`),
              React.createElement("p", { className: "text-sm" }, `Stock: ${product.stock}`),
              React.createElement(
                "div",
                { className: "space-y-1 text-xs" },
                React.createElement("p", null, `Sync: ${product.shopifySyncStatus ?? "not synced"}`),
                React.createElement("p", null, `Approval: ${getPublishLabel(product)}`),
                product.shopifyPublishedAt
                  ? React.createElement(
                      "p",
                      null,
                      `Published: ${new Date(product.shopifyPublishedAt).toLocaleString()}`,
                    )
                  : null,
              ),
              React.createElement(
                "div",
                { className: "flex flex-wrap justify-end gap-2" },
                !product.approvedForShopify
                  ? React.createElement(
                      "button",
                      {
                        className: "rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground",
                        onClick: () => approveProduct(product.id, product.name),
                      },
                      "Approve",
                    )
                  : null,
                React.createElement(
                  Link,
                  {
                    to: `/admin/products/${product.id}/edit`,
                    className: "rounded-md border px-3 py-2 text-sm",
                  },
                  "Edit",
                ),
                React.createElement(
                  "button",
                  {
                    className: "rounded-md border px-3 py-2 text-sm text-destructive",
                    onClick: () => {
                      remove(product.id);
                      toast({ title: "Product deleted", description: product.name });
                    },
                  },
                  "Delete",
                ),
              ),
            ),
          ),
    ),
  );
};

export default AdminDashboard;
