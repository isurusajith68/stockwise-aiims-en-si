import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductType } from "./ProductForm";
import { useContext } from "react";
import { LanguageContext } from "@/lib/language-context";

interface ProductHistoryDialogProps {
  product: ProductType;
  onClose: () => void;
  onEdit: () => void;
}

const mockHistory = [
  { date: "2024-04-01", action: "Restocked", quantity: 50 },
  { date: "2024-04-10", action: "Sold", quantity: -10 },
  { date: "2024-04-15", action: "Restocked", quantity: 20 },
];

export function ProductHistoryDialog({
  product,
  onClose,
  onEdit,
}: ProductHistoryDialogProps) {
  const { translations } = useContext(LanguageContext);
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {translations.viewHistory} - {product.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {mockHistory.map((entry, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{entry.date}</span>
              <span>{entry.action}</span>
              <span>
                {entry.quantity > 0 ? "+" : ""}
                {entry.quantity}
              </span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {translations.cancel}
            </Button>
          </DialogClose>
          <Button type="button" onClick={onEdit}>
            {translations.editProduct}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
