import { useContext, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Package,
  RefreshCw,
  ArrowUpDown,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LanguageContext } from "@/lib/language-context";
import { ProductForm } from "./product-form";
import { ProductHistoryDialog } from "./ProductHistoryDialog";
import { RestockDialog } from "./RestockDialog";
import { ProductType } from "./types";

const products = [
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

const formatStatus = (status: string) => {
  switch (status) {
    case "in_stock":
      return { label: "In Stock", variant: "outline" as const };
    case "low_stock":
      return { label: "Low Stock", variant: "secondary" as const };
    case "critical":
      return { label: "Critical", variant: "destructive" as const };
    default:
      return { label: status, variant: "outline" as const };
  }
};

export function Products() {
  const { translations } = useContext(LanguageContext);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editProduct, setEditProduct] = useState<ProductType | null>(null);
  const [restockProduct, setRestockProduct] = useState<ProductType | null>(
    null
  );
  const [viewHistoryProduct, setViewHistoryProduct] =
    useState<ProductType | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {translations.products}
        </h1>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsAddProductOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {translations.addProduct}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>{translations.productInventory}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center rounded-md border px-3 h-9 text-sm w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  className="border-0 p-0 shadow-none focus-visible:ring-0 h-8"
                  placeholder={translations.searchProducts}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-9 w-full sm:w-[150px]">
                  <SelectValue placeholder={translations.category} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {translations.allCategories}
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-full sm:w-[150px]">
                  <SelectValue placeholder={translations.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {translations.allStatuses}
                  </SelectItem>
                  <SelectItem value="in_stock">
                    {translations.inStock}
                  </SelectItem>
                  <SelectItem value="low_stock">
                    {translations.lowStock}
                  </SelectItem>
                  <SelectItem value="critical">
                    {translations.critical}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" className="h-9 w-9">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <div className="flex items-center">
                    {translations.product}
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>{translations.sku}</TableHead>
                <TableHead>{translations.category}</TableHead>
                <TableHead className="text-right">
                  {translations.price}
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    {translations.stock}
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  {translations.status}
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {translations.noProductsFound}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const stockPercentage =
                    (product.stock / product.threshold) * 100;
                  const stockStatus = product.status;
                  const { label, variant } = formatStatus(stockStatus);

                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.sku}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right font-medium">
                        LKR {product.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{product.stock}</span>
                            <span className="text-muted-foreground">
                              / {product.threshold}
                            </span>
                          </div>
                          <Progress
                            value={
                              stockPercentage > 100 ? 100 : stockPercentage
                            }
                            className={
                              "h-2 " +
                              (stockStatus === "critical"
                                ? "bg-destructive"
                                : stockStatus === "low_stock"
                                ? "bg-yellow-500"
                                : "bg-green-500")
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={variant}>
                          {stockStatus === "critical" && (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              {translations.actions}
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => setEditProduct(product)}
                            >
                              {translations.editProduct}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setViewHistoryProduct(product)}
                            >
                              {translations.viewHistory}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setRestockProduct(product)}
                            >
                              {translations.restock}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              {translations.delete}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isAddProductOpen && (
        <ProductForm onClose={() => setIsAddProductOpen(false)} />
      )}
      {editProduct && (
        <ProductForm
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={() => setEditProduct(null)}
        />
      )}
      {restockProduct && (
        <RestockDialog
          product={restockProduct}
          onClose={() => setRestockProduct(null)}
          onRestock={(product, quantity) => {
            // Update product stock here
            setRestockProduct(null);
          }}
        />
      )}
      {viewHistoryProduct && (
        <ProductHistoryDialog
          product={viewHistoryProduct}
          onClose={() => setViewHistoryProduct(null)}
          onEdit={() => {
            setEditProduct(viewHistoryProduct);
            setViewHistoryProduct(null);
          }}
        />
      )}
    </div>
  );
}
