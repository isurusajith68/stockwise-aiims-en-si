import { useState, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ProductType } from "../products/types";
import { LanguageContext } from "@/lib/language-context";
import { useNavigate } from "react-router-dom";
import { Customer, Sale, SaleItem } from "./types";
import { SaleDialog } from "./SaleDialog";
import { CustomerDialog } from "./CustomerDialog";
import { Button } from "@/components/ui/button";

const products: ProductType[] = [
  {
    id: 1,
    name: "Rice (5kg)",
    sku: "RICE-5KG",
    price: 2450,
    stock: 85,
    category: "Groceries",
    threshold: 20,
    status: "in_stock",
  },
];

export default function AddSalePage() {
  const router = useNavigate();
  const { translations } = useContext(LanguageContext);
  const [sales, setSales] = useLocalStorage<Sale[]>("sales", []);
  const [inventory, setInventory] = useLocalStorage<ProductType[]>(
    "inventory",
    products
  );
  const [customers, setCustomers] = useLocalStorage<Customer[]>(
    "customers",
    []
  );

  const [showCustomerDialog, setShowCustomerDialog] = useState(true);
  const [showSaleDialog, setShowSaleDialog] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.contactInfo?.primaryPhone?.includes(searchTerm) ||
          customer.contactInfo?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [searchTerm, customers]);

  const handleSaleSubmit = () => {
    if (!currentCustomer) return;
    if (selectedProducts.length === 0) {
      alert("Please add at least one product to the sale");
      return;
    }

    const totalAmount = selectedProducts.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const newSale: Sale = {
      id: Date.now(),
      items: selectedProducts,
      date: new Date().toISOString(),
      customerType: currentCustomer.type,
      paymentMethod: "cash",
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      totalAmount,
      customerContactInfo: currentCustomer.contactInfo,
      customerLocationInfo: currentCustomer.locationInfo,
      customer: undefined,
      products: undefined,
      total: 0
    };

    setSales([...sales, newSale]);

    // Update inventory
    const updatedInventory = [...inventory];
    selectedProducts.forEach((item) => {
      const productIndex = updatedInventory.findIndex(
        (p) => p.id === item.productId
      );
      if (productIndex >= 0) {
        updatedInventory[productIndex] = {
          ...updatedInventory[productIndex],
          stock: updatedInventory[productIndex].stock - item.quantity,
        };
      }
    });
    setInventory(updatedInventory);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {translations.newSale || "New Sale"}
        </h1>
        <Button
          className="btn btn-primary"
          onClick={() => {
            handleSaleSubmit();
            router("/sales");
          }}
          variant="outline"
          size="sm"
          type="button"
        >
          {translations.back || "Back"}
        </Button>
      </div>

      <CustomerDialog
        open={showCustomerDialog}
        onOpenChange={setShowCustomerDialog}
        customers={customers}
        setCustomers={setCustomers}
        currentCustomer={currentCustomer}
        setCurrentCustomer={setCurrentCustomer}
        setShowSaleDialog={setShowSaleDialog}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredCustomers={filteredCustomers}
        translations={translations}
        from="sale"
      />

      <SaleDialog
        open={showSaleDialog}
        onOpenChange={setShowSaleDialog}
        openCustomerDialog={setShowCustomerDialog}
        openChangeCustomerDialog={setShowCustomerDialog}
        currentCustomer={currentCustomer}
        inventory={inventory}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        handleSaleSubmit={handleSaleSubmit}
        translations={translations}
      />
    </div>
  );
}
