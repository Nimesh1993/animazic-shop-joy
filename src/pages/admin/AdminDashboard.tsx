import * as React from "react";
import { Link } from "react-router-dom";
import { automationSupabase } from "@/integrations/supabase/automationClient";
import { fetchSelectedSupplierSnapshots, SelectedSupplierSnapshot } from "@/data/supplierSnapshots";
import { useProductStore } from "@/stores/productStore";
import { toast } from "@/hooks/use-toast";

const getPublishLabel = (product: {
  approvedForShopify?: boolean | null;
  shopifyPublishStatus?: string | null;
}) => {
  if (product.shopifyPublishStatus === "published") return "published";
  if (product.shopifyPublishStatus === "failed") return "publish failed";
  if (product.approvedForShopify) return "approved draft";
  return "needs approval";
};

const getSupplierLabel = (supplier?: SelectedSupplierSnapshot) => {
  if (!supplier) return "Supplier: not loaded";
  return `Supplier: ${supplier.supplierName}`;
};

const getSupplierQualityLabel = (supplier?: SelectedSupplierSnapshot) => {
  if (!supplier) return "Quality: n/a";
  return `Quality: ${supplier.qualityScore.toFixed(2)} | Rating: ${supplier.supplierRating.toFixed(1)} | ${supplier.shipsFrom}`;
};

const getSupplierCostLabel = (supplier?: SelectedSupplierSnapshot) => {
  if (!supplier) return "Cost: n/a";
  return `Landed cost: INR ${supplier.landedCost.toLocaleString()} | Lead: ${supplier.leadTimeDays} days`;
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
    const channel = automationSupabase
      .channel("supplier-snapshots-admin")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "supplier_snapshots",
        },
        () => {
          loadSuppliers();
        },
      )
      .subscribe();

    return () => {
      unsubscribeProducts();
      automationSupabase.removeChannel(channel);
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