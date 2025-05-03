import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2, Check } from "lucide-react";

import { ProductItem } from "./ProductItem";
import { motion } from "framer-motion";
import { ProductType } from "../products/types";
import { SaleItem } from "./types";

interface ProductSearchProps {
  productSearch: string;
  setProductSearch: (search: string) => void;
  inventory: ProductType[];
  selectedProducts: SaleItem[];
  addProductToSale: (
    productId: number,
    quantity: number,
    discount: number
  ) => void;
  removeProductFromSale: (productId: number) => void;
  translations: Record<string, string>;
}

export function ProductSearch({
  productSearch,
  setProductSearch,
  inventory,
  selectedProducts,
  addProductToSale,
  removeProductFromSale,
  translations,
}: ProductSearchProps) {
  const [productQuantities, setProductQuantities] = useState<
    Record<number, number>
  >({});
  const [productDiscounts, setProductDiscounts] = useState<
    Record<number, number>
  >({});

  // Initialize quantities and discounts for products
  const getProductQuantity = (productId: number) => {
    const selected = selectedProducts.find((p) => p.productId === productId);
    if (selected) return selected.quantity;
    return productQuantities[productId] || 1;
  };

  const getProductDiscount = (productId: number) => {
    const selected = selectedProducts.find((p) => p.productId === productId);
    if (selected) return selected.discount;
    return productDiscounts[productId] || 0;
  };

  const setProductQuantity = (productId: number, quantity: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const setProductDiscount = (productId: number, discount: number) => {
    setProductDiscounts((prev) => ({
      ...prev,
      [productId]: discount,
    }));
  };

  // Filter products
  const filteredProducts = inventory
    .filter(
      (p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(productSearch.toLowerCase())
    )
    .filter((p) => p.stock > 0);

  return (
    <div className="space-y-4 ">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          placeholder={translations.searchProducts || "Search products..."}
          className="pl-9 bg-background"
        />
      </div>

      <div className="pr-1 space-y-2 ">
        {filteredProducts.length === 0 ? (
          <div className="text-muted-foreground text-center py-10 bg-muted/30 rounded-lg">
            {translations.noProductsFound || "No products found"}
          </div>
        ) : (
          <motion.div
            className="space-y-2 "
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            <div className="grid grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.some(
                    (item) => item.productId === product.id
                  )}
                  quantity={getProductQuantity(product.id)}
                  discount={getProductDiscount(product.id)}
                  onQuantityChange={(q) => setProductQuantity(product.id, q)}
                  onDiscountChange={(d) => setProductDiscount(product.id, d)}
                  onAddProduct={() =>
                    addProductToSale(
                      product.id,
                      getProductQuantity(product.id),
                      getProductDiscount(product.id)
                    )
                  }
                  onRemoveProduct={() => removeProductFromSale(product.id)}
                  onUpdateProduct={() =>
                    addProductToSale(
                      product.id,
                      getProductQuantity(product.id),
                      getProductDiscount(product.id)
                    )
                  }
                  translations={translations}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
