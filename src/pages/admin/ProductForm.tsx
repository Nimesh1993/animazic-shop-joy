import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useProductStore } from "@/stores/productStore";
import { ProductSpecs } from "@/data/products";
import { toast } from "@/hooks/use-toast";

const emptySpecs: ProductSpecs = {
  battery: "",
  weight: "",
  processor: "",
  display: "",
  connectivity: "",
  warranty: "",
};

const SPEC_FIELDS: { key: keyof ProductSpecs; label: string; placeholder: string }[] = [
  { key: "battery", label: "Battery Life", placeholder: "Up to 28 hrs" },
  { key: "weight", label: "Weight", placeholder: "187 g" },
  { key: "processor", label: "Processor", placeholder: "Nova A18 Bionic" },
  { key: "display", label: "Display", placeholder: '6.7" OLED 120Hz' },
  { key: "connectivity", label: "Connectivity", placeholder: "Wi-Fi 7 · USB-C" },
  { key: "warranty", label: "Warranty", placeholder: "2 years included" },
];

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=800&q=80";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = !!id;

  const existing = useProductStore((s) => (id ? s.getById(id) : undefined));
  const create = useProductStore((s) => s.create);
  const update = useProductStore((s) => s.update);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [highlights, setHighlights] = useState("");
  const [flagship, setFlagship] = useState(false);
  const [specs, setSpecs] = useState<ProductSpecs>(emptySpecs);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setTagline(existing.tagline);
      setCategory(existing.category);
      setPrice(existing.price);
      setStock(existing.stock);
      setImage(existing.image);
      setDescription(existing.description);
      setHighlights(existing.highlights.join("\n"));
      setFlagship(!!existing.flagship);
      setSpecs({ ...emptySpecs, ...existing.specs });
    }
  }, [existing]);

  if (editing && !existing) {
    return (
      <div className="text-muted-foreground">
        Product not found.{" "}
        <Link to="/admin" className="text-primary underline">Back to dashboard</Link>
      </div>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      tagline: tagline.trim(),
      category: category.trim() || "Gadget",
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      image: image.trim() || PLACEHOLDER_IMAGE,
      description: description.trim(),
      highlights: highlights
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean),
      flagship,
      hero: true,
      specs,
      slug: existing?.slug ?? name,
    };

    if (editing && existing) {
      update(existing.id, payload);
      toast({ title: "Product updated", description: payload.name });
    } else {
      create(payload);
      toast({ title: "Product created", description: payload.name });
    }
    navigate("/admin");
  };

  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-8">
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to inventory
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {editing ? "Edit product" : "New product"}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <section className="space-y-5 rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Basics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" required>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Category">
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Smartphone" />
            </Field>
            <Field label="Tagline" className="md:col-span-2">
              <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="The flagship phone, redefined." />
            </Field>
            <Field label="Price (USD)" required>
              <Input
                type="number"
                min={0}
                step="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </Field>
            <Field label="Stock">
              <Input
                type="number"
                min={0}
                step="1"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </Field>
            <Field label="Image URL" className="md:col-span-2">
              <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://images.unsplash.com/..." />
            </Field>
            {image && (
              <div className="md:col-span-2">
                <div className="h-40 w-full overflow-hidden rounded-lg border border-border/60 bg-secondary">
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            )}
            <Field label="Description" className="md:col-span-2">
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A titanium unibody, 6.7\" LTPO display..."
              />
            </Field>
            <Field label="Highlights (one per line)" className="md:col-span-2">
              <Textarea
                rows={4}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder={"Grade-5 titanium frame\n6.7\" 120Hz LTPO ProMotion"}
              />
            </Field>
            <div className="flex items-center gap-3 md:col-span-2">
              <Switch id="flagship" checked={flagship} onCheckedChange={setFlagship} />
              <Label htmlFor="flagship" className="cursor-pointer">Flagship (featured in hero)</Label>
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
            Comparison specs
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SPEC_FIELDS.map((f) => (
              <Field key={f.key} label={f.label}>
                <Input
                  value={specs[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => setSpecs({ ...specs, [f.key]: e.target.value })}
                />
              </Field>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/admin">Cancel</Link>
          </Button>
          <Button type="submit" size="lg" className="rounded-full">
            <Save className="h-4 w-4" /> {editing ? "Save changes" : "Create product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Field = ({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`space-y-2 ${className ?? ""}`}>
    <Label>
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    {children}
  </div>
);

export default ProductForm;