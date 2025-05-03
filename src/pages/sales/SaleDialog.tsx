import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import { Customer, SaleItem } from "../../types/sales";
import { ProductType } from "../../types/products";
import { CustomerInfo } from "./CustomerInfo";
import { ProductSearch } from "./ProductSearch";
import { SelectedProducts } from "./SelectedProducts";
import { SaleDetails } from "./SaleDetails";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCustomer: Customer | null;
  inventory: ProductType[];
  selectedProducts: SaleItem[];
  setSelectedProducts: (products: SaleItem[]) => void;
  handleSaleSubmit: () => void;
  translations: Record<string, string>;
  openCustomerDialog: (open: boolean) => void;
  openChangeCustomerDialog: (open: boolean) => void;
}

export function SaleDialog({
  currentCustomer,
  inventory,
  selectedProducts,
  setSelectedProducts,
  handleSaleSubmit,
  translations,
  openCustomerDialog,
}: SaleDialogProps) {
  const [productSearch, setProductSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "credit" | "online" | "cash_on_delivery"
  >("cash");
  const [saleDate, setSaleDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addProductToSale = (
    productId: number,
    quantity: number,
    discount: number
  ) => {
    const product = inventory.find((p) => p.id === productId);
    if (!product) return;

    if (quantity < 1 || quantity > product.stock) {
      alert("Invalid quantity");
      return;
    }

    const existingProductIndex = selectedProducts.findIndex(
      (item) => item.productId === productId
    );

    const subtotal = product.price * quantity;
    const total = subtotal * (1 - discount / 100);

    if (existingProductIndex >= 0) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProductIndex] = {
        productId,
        quantity,
        price: product.price,
        discount,
        total,
      };
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          productId,
          quantity,
          price: product.price,
          discount,
          total,
        },
      ]);
    }
  };

  const removeProductFromSale = (productId: number) => {
    setSelectedProducts(
      selectedProducts.filter((item) => item.productId !== productId)
    );
  };

  const subtotal = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountTotal = selectedProducts.reduce(
    (sum, item) => sum + (item.price * item.quantity * item.discount) / 100,
    0
  );

  const total = selectedProducts.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="border-none shadow-none mt-4">
      <CardContent className="p-4 sm:p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-bold flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
            {translations.recordSale || "Record Sale"}
            {currentCustomer && (
              <Badge variant="outline" className="ml-2 px-2 py-1 rounded-full">
                {currentCustomer.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        {currentCustomer ? (
          <>
            <CustomerInfo
              customer={currentCustomer}
              translations={translations}
              openCustomerDialog={openCustomerDialog}
            />

            <div className="flex flex-col gap-4 mt-4">
              <ProductSearch
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                inventory={inventory}
                selectedProducts={selectedProducts}
                addProductToSale={addProductToSale}
                removeProductFromSale={removeProductFromSale}
                translations={translations}
              />

              <div className="flex flex-col gap-4 ">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">
                      {translations.cart || "Cart"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedProducts.length}{" "}
                      {selectedProducts.length === 1
                        ? translations.item || "item"
                        : translations.items || "items"}
                    </p>
                  </div>

                  <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="default"
                        className="group transition-all duration-300 hover:bg-primary/90"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        {selectedProducts.length > 0 ? (
                          <>
                            {translations.reviewCart || "Cart"}
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-primary-foreground text-primary text-xs font-semibold px-2 py-0.5 rounded-full"
                            >
                              {selectedProducts.length}
                            </Badge>
                          </>
                        ) : (
                          translations.openCart || "Open Cart"
                        )}
                      </Button>
                    </SheetTrigger>

                    <SheetContent className="sm:max-w-lg p-6">
                      <SheetHeader className="border-b pb-4">
                        <SheetTitle className="text-xl font-semibold flex items-center">
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          {translations.saleDetails || "Sale Details"}
                        </SheetTitle>
                      </SheetHeader>

                      <div className="flex flex-col h-[calc(100vh-10rem)] overflow-auto">
                        <SelectedProducts
                          selectedProducts={selectedProducts}
                          inventory={inventory}
                          removeProductFromSale={removeProductFromSale}
                          translations={translations}
                          subtotal={subtotal}
                          discountTotal={discountTotal}
                          total={total}
                        />
                      </div>

                      <SheetFooter className="border-t pt-4 gap-3 mt-4">
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                          >
                            {translations.cancel || "Cancel"}
                          </Button>
                        </SheetClose>
                        <Button
                          className="w-full sm:w-auto"
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          {translations.continue || "Continue"}
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>

                {selectedProducts.length > 0 ? (
                  <div className="">
                    <div className="mb-6">
                      <SaleDetails
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        saleDate={saleDate}
                        setSaleDate={setSaleDate}
                        notes={notes}
                        setNotes={setNotes}
                        translations={translations}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="bg-primary text-white hover:bg-primary/90 transition active:scale-[0.98] "
                        onClick={() => {
                          handleSaleSubmit();
                          setIsDrawerOpen(false);
                        }}
                        disabled={selectedProducts.length === 0}
                        size="lg"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {translations.recordSale || "Record Sale"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed p-8 text-center bg-muted/10">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                      <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                      {translations.emptyCart || "Your cart is empty"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-[400px] mx-auto">
                      {translations.noItemsSelected ||
                        "No items have been added to this sale yet"}
                    </p>
                    <Button variant="outline">
                      {translations.browseInventory || "Browse Inventory"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-12 bg-muted/30 rounded-xl border border-dashed animate-in fade-in-50 duration-300">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">
              {translations.noCustomerSelected || "No Customer Selected"}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-[400px] mx-auto">
              {translations.selectCustomerToStart ||
                "Select a customer to start recording a sale"}
            </p>
            <Button
              onClick={() => openCustomerDialog(true)}
              className="group transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              {translations.selectCustomer || "Select Customer"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
