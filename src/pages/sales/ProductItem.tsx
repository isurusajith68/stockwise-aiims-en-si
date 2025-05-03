import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "../../lib/utils";
import { motion } from "framer-motion";
import { ProductType } from "../products/types";

interface ProductItemProps {
  product: ProductType;
  isSelected: boolean;
  quantity: number;
  discount: number;
  onQuantityChange: (quantity: number) => void;
  onDiscountChange: (discount: number) => void;
  onAddProduct: () => void;
  onRemoveProduct: () => void;
  onUpdateProduct: () => void;
  translations: Record<string, string>;
}

export function ProductItem({
  product,
  isSelected,
  quantity,
  discount,
  onQuantityChange,
  onDiscountChange,
  onAddProduct,
  onRemoveProduct,
  onUpdateProduct,
  translations,
}: ProductItemProps) {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= product.stock) {
      onQuantityChange(value);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      onDiscountChange(value);
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`overflow-hidden transition-all  ${
          isSelected ? "border-primary bg-primary/5" : ""
        }`}
      >
        <CardHeader className=" pb-0 ">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-sm font-medium">
                {product.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {product.sku && (
                  <span className="mr-2">SKU: {product.sku}</span>
                )}
                <span>
                  {translations.stock}: {product.stock}
                </span>
              </CardDescription>
            </div>
            <div className="text-sm font-medium">
              {formatCurrency(product.price)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {translations.quantity}
              </label>
              <Input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {translations.discount} %
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                value={discount}
                onChange={handleDiscountChange}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            {isSelected ? (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onRemoveProduct}
                  className="h-8 px-2"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {translations.remove}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onUpdateProduct}
                  className="h-8 px-2"
                >
                  <Check className="h-3 w-3 mr-1" />
                  {translations.update}
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="w-full h-8"
                onClick={onAddProduct}
              >
                <Plus className="h-3 w-3 mr-1" />
                {translations.add}
              </Button>
            )}
          </div>

          {discount > 0 ? (
            <div className="text-xs mt-2 text-right text-muted-foreground">
              {translations.totalWith} {discount}% {translations.discount}:{" "}
              {formatCurrency(product.price * quantity * (1 - discount / 100))}
            </div>
          ) : (
            <div className="text-xs mt-2 text-right text-muted-foreground">
              {translations.total}: {formatCurrency(product.price * quantity)}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
