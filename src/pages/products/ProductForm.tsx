import { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageContext } from "@/lib/language-context";

export type ProductType = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
  status: string;
  description?: string;
};

interface ProductFormProps {
  product?: ProductType | null;
  onClose: () => void;
  onSave?: (updatedProduct: ProductType) => void;
}

export function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const { translations } = useContext(LanguageContext);
  const [formState, setFormState] = useState<ProductType>(
    product || {
      id: Date.now(),
      name: "",
      sku: "",
      category: "",
      price: 0,
      stock: 0,
      threshold: 0,
      status: "in_stock",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formState);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product ? translations.editProduct : translations.addProduct}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder={translations.productName}
            required
          />
          <Input
            name="sku"
            value={formState.sku}
            onChange={handleChange}
            placeholder={translations.sku}
            required
          />
          <Input
            name="category"
            value={formState.category}
            onChange={handleChange}
            placeholder={translations.category}
            required
          />
          <Input
            name="price"
            type="number"
            value={formState.price}
            onChange={handleChange}
            placeholder={translations.price}
            required
          />
          <Input
            name="stock"
            type="number"
            value={formState.stock}
            onChange={handleChange}
            placeholder={translations.stock}
            required
          />
          <Input
            name="threshold"
            type="number"
            value={formState.threshold}
            onChange={handleChange}
            placeholder={translations.stockThreshold}
            required
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {translations.cancel}
              </Button>
            </DialogClose>
            <Button type="submit">{translations.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
