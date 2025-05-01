import { useState, useContext } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ProductType } from "../products/types";
import { LanguageContext } from "@/lib/language-context";
import { Calendar, ChevronUp, ChevronDown } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { RecentSalesTable } from "../reports/components/RecentSalesTable";

const products: ProductType[] = [
  {
    id: 1,
    name: "Rice (5kg)",
    sku: "GRO-RICE-5KG",
    category: "Groceries",
    price: 2450,
    stock: 85,
    threshold: 20,
    status: "in_stock",
  },
  {
    id: 2,
    name: "Flour (1kg)",
    sku: "GRO-FLOUR-1KG",
    category: "Baking",
    price: 650,
    stock: 42,
    threshold: 15,
    status: "in_stock",
  },
  {
    id: 3,
    name: "Sugar (1kg)",
    sku: "GRO-SUGAR-1KG",
    category: "Groceries",
    price: 580,
    stock: 18,
    threshold: 20,
    status: "low_stock",
  },
  {
    id: 4,
    name: "Milk Powder (400g)",
    sku: "DAI-MILK-400G",
    category: "Dairy",
    price: 890,
    stock: 5,
    threshold: 25,
    status: "critical",
  },
  {
    id: 5,
    name: "Vegetable Oil (2L)",
    sku: "GRO-VOIL-2L",
    category: "Groceries",
    price: 1250,
    stock: 36,
    threshold: 30,
    status: "in_stock",
  },
  {
    id: 6,
    name: "Soap Bar (75g)",
    sku: "HYG-SOAP-75G",
    category: "Hygiene",
    price: 180,
    stock: 112,
    threshold: 50,
    status: "in_stock",
  },
  {
    id: 7,
    name: "Toothpaste (120g)",
    sku: "HYG-TOOTH-120G",
    category: "Hygiene",
    price: 350,
    stock: 68,
    threshold: 35,
    status: "in_stock",
  },
  {
    id: 8,
    name: "Cooking Oil (1L)",
    sku: "GRO-COIL-1L",
    category: "Groceries",
    price: 750,
    stock: 12,
    threshold: 30,
    status: "low_stock",
  },
];

type Sale = {
  id: number;
  productId: number;
  quantity: number;
  date: string;
  customerType?: "regular" | "wholesale" | "new";
  paymentMethod?: "cash" | "credit" | "online";
  discount?: number;
};

const saleSchema = z.object({
  productId: z.number().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  date: z.string().min(1, "Date is required"),
  customerType: z.enum(["regular", "wholesale", "new"]),
  paymentMethod: z.enum(["cash", "credit", "online"]),
  discount: z.number().min(0).max(100),
});

type SaleFormValues = z.infer<typeof saleSchema>;

export default function SalesPage() {
  const { translations } = useContext(LanguageContext);
  const [sales, setSales] = useLocalStorage<Sale[]>("sales", []);
  const [inventory, setInventory] = useLocalStorage<ProductType[]>(
    "inventory",
    products
  );
  const [showSaleForm, setShowSaleForm] = useState<boolean>(true);

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      productId: products[0]?.id || 1,
      quantity: 1,
      date: new Date().toISOString().slice(0, 10),
      customerType: "regular",
      paymentMethod: "cash",
      discount: 0,
    },
  });

  const onSubmit = (data: SaleFormValues) => {
    const product = inventory.find((p) => p.id === data.productId);
    if (!product || data.quantity < 1 || data.quantity > product.stock) return;
    const newSale: Sale = {
      id: Date.now(),
      ...data,
    };
    setSales([...sales, newSale]);
    setInventory(
      inventory.map((p) =>
        p.id === data.productId ? { ...p, stock: p.stock - data.quantity } : p
      )
    );
    form.reset();
  };

  return (
    <div className="">
      <div className="bg-card text-card-foreground rounded shadow">
        <div
          className="font-medium flex justify-between items-center cursor-pointer text-card-foreground"
          onClick={() => setShowSaleForm(!showSaleForm)}
        >
          <h1 className="text-3xl font-bold tracking-tight">
            {translations.recordSale}
          </h1>
          {showSaleForm ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {showSaleForm && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-4 space-y-4 border-t border-border mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.product}</FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={String(field.value)}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {inventory.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={String(product.id)}
                            >
                              {product.name} ({translations.stock}:{" "}
                              {product.stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.quantity}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={
                            inventory.find(
                              (p) => p.id === form.watch("productId")
                            )?.stock || 1
                          }
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.orderDate || "Date"}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="date" {...field} />
                          <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-card-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.customerType}</FormLabel>
                      <Select
                        value={field.value ?? "regular"}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="regular">
                            {translations.regular}
                          </SelectItem>
                          <SelectItem value="wholesale">
                            {translations.wholesale}
                          </SelectItem>
                          <SelectItem value="new">
                            {translations.new}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.paymentMethod}</FormLabel>
                      <Select
                        value={field.value ?? "cash"}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">
                            {translations.cash}
                          </SelectItem>
                          <SelectItem value="credit">
                            {translations.credit}
                          </SelectItem>
                          <SelectItem value="online">
                            {translations.online}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.discount}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">{translations.recordSale}</Button>
              </div>
            </form>
          </Form>
        )}
      </div>
      <RecentSalesTable
        sales={sales}
        products={inventory}
        translations={translations}
      />
    </div>
  );
}
