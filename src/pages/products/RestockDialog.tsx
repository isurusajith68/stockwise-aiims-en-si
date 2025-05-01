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
import { ProductType } from "./types";
import { LanguageContext } from "@/lib/language-context";

interface RestockDialogProps {
  product: ProductType;
  onClose: () => void;
  onRestock: (product: ProductType, quantity: number) => void;
}

export function RestockDialog({
  product,
  onClose,
  onRestock,
}: RestockDialogProps) {
  const { translations } = useContext(LanguageContext);
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0) {
      onRestock(product, quantity);
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {translations.restock} - {product.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder={translations.stock}
            required
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {translations.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={quantity <= 0}>
              {translations.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
