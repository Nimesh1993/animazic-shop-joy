import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductStore } from "@/stores/productStore";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const items = useProductStore((s) => s.items);
  const loading = useProductStore((s) => s.loading);
  const remove = useProductStore((s) => s.remove);
  const loadFromSupabase = useProductStore((s) => s.loadFromSupabase);
  const subscribeToSupabase = useProductStore((s) => s.subscribeToSupabase);

  useEffect(() => {
    loadFromSupabase();
    const unsub = subscribeToSupabase();
    return unsub;
  }, [loadFromSupabase, subscribeToSupabase]);

  const handleDelete = (id: string, name: string) => {
    remove(id);
    toast({ title: "Product removed", description: name });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `${items.length} products`}
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new">
            <PlusCircle className="h-4 w-4" /> Add product
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="w-[120px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell className="text-right">${p.price}</TableCell>
                <TableCell className="text-right">{p.stock}</TableCell>
                <TableCell className="flex justify-end gap-1">
                  <Button asChild size="icon" variant="ghost">
                    <Link to={`/admin/products/${p.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(p.id, p.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;
