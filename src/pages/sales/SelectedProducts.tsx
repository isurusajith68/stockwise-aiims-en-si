import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Trash2, ShoppingCart } from "lucide-react";

import { formatCurrency } from "../../lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { SaleItem } from "./types";
import { ProductType } from "../products/types";

interface SelectedProductsProps {
  selectedProducts: SaleItem[];
  inventory: ProductType[];
  removeProductFromSale: (productId: number) => void;
  translations: Record<string, string>;
  subtotal: number;
  discountTotal: number;
  total: number;
}

export function SelectedProducts({
  selectedProducts,
  inventory,
  removeProductFromSale,
  translations,
  subtotal,
  discountTotal,
  total,
}: SelectedProductsProps) {
  const getProductName = (productId: number) => {
    const product = inventory.find((p) => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {translations.selectedProducts}
          </CardTitle>
          <Badge variant="outline">
            {selectedProducts.length} {translations.items || "items"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {selectedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="bg-muted/30 p-3 rounded-full mb-3">
              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {translations.noProductsSelected || "No products selected yet"}
            </p>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translations.product}</TableHead>
                  <TableHead className="text-right">
                    {translations.quantity}
                  </TableHead>
                  <TableHead className="text-right">
                    {translations.price}
                  </TableHead>
                  <TableHead className="text-right">
                    {translations.total}
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {selectedProducts.map((item) => (
                    <motion.tr
                      key={item.productId}
                      className="group"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell className="font-medium">
                        {getProductName(item.productId)}
                        {item.discount > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {item.discount}% {translations.discount}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                      <TableCell className="w-10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeProductFromSale(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {selectedProducts.length > 0 && (
        <CardFooter className="flex-col pt-4 pb-3 px-4 border-t">
          <div className="w-full space-y-1">
            <div className="flex justify-between text-sm py-1">
              <span className="text-muted-foreground">
                {translations.subtotal}
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span className="text-muted-foreground">
                {translations.discount}
              </span>
              <span>-{formatCurrency(discountTotal)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>{translations.total}</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
