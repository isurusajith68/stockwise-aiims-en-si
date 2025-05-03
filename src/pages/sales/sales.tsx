import { useContext, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { LanguageContext } from "@/lib/language-context";
import { Phone, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Sale } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2, Eye } from "lucide-react";
import { ProductType } from "../products/types";

export default function SalesPage() {
  const { translations } = useContext(LanguageContext);
  const [sales, setSales] = useLocalStorage<Sale[]>("sales", []);
  const [inventory] = useLocalStorage<ProductType[]>("inventory", []);
  const [filter, setFilter] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  // Filter logic
  const filteredSales = sales.filter((sale) => {
    const customerMatch = sale.customerName
      .toLowerCase()
      .includes(filter.toLowerCase());
    const phoneMatch = sale.customerContactInfo?.primaryPhone?.includes(filter);
    const productMatch = sale.items.some((item) => {
      const product = inventory.find((p) => p.id === item.productId);
      return (
        product && product.name.toLowerCase().includes(filter.toLowerCase())
      );
    });
    return !filter || customerMatch || phoneMatch || productMatch;
  });

  // Delete sale
  const handleDelete = (id: number) => {
    setSales(sales.filter((sale) => sale.id !== id));
    setShowDialog(false);
    setSelectedSale(null);
  };

  // Get product name
  const getProductName = (productId: number) => {
    const product = inventory.find((p) => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {translations.salesManagement || "Sales Management"}
        </h1>
        <Button asChild>
          <Link to="/sales/add">
            <Plus className="h-4 w-4 mr-2" />
            {translations.newSale || "New Sale"}
          </Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-2">
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={
            translations.searchCustomer ||
            "Filter by customer, phone, or product..."
          }
          className="max-w-xs"
        />
      </div>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle>{translations.salesList || "Sales List"}</CardTitle>
          <CardDescription>
            {translations.allSalesDescription ||
              "View and manage all recorded sales"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{translations.date || "Date"}</TableHead>
                <TableHead>{translations.customer || "Customer"}</TableHead>
                <TableHead>{translations.contact || "Contact"}</TableHead>
                <TableHead>{translations.items || "Items"}</TableHead>
                <TableHead>{translations.payment || "Payment"}</TableHead>
                <TableHead className="text-right">
                  {translations.total || "Total"}
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                      <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                      <p>
                        {translations.noSalesYet || "No sales recorded yet"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {new Date(sale.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sale.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {sale.customerType}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        <span className="text-sm">
                          {sale.customerContactInfo?.primaryPhone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{sale.items?.length} items</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sale.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(sale.totalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        className="mr-2"
                        onClick={() => {
                          setSelectedSale(sale);
                          setShowDialog(true);
                        }}
                        title={translations.viewDetails || "View Details"}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {translations.saleDetails || "Sale Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedSale && (
                <>
                  <div className="mb-2">
                    <span className="font-semibold">
                      {translations.date || "Date"}:
                    </span>{" "}
                    {new Date(selectedSale.date).toLocaleString()}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">
                      {translations.customer || "Customer"}:
                    </span>{" "}
                    {selectedSale.customerName} ({selectedSale.customerType})
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">
                      {translations.contact || "Contact"}:
                    </span>{" "}
                    {selectedSale.customerContactInfo?.primaryPhone}{" "}
                    {selectedSale.customerContactInfo?.email &&
                      `| ${selectedSale.customerContactInfo.email}`}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">
                      {translations.paymentMethod || "Payment Method"}:
                    </span>{" "}
                    {selectedSale.paymentMethod}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">
                      {translations.total || "Total"}:
                    </span>{" "}
                    {formatCurrency(selectedSale.totalAmount)}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">
                      {translations.items || "Items"}:
                    </span>
                    <Table className="mt-2">
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {translations.product || "Product"}
                          </TableHead>
                          <TableHead className="text-right">
                            {translations.quantity}
                          </TableHead>
                          <TableHead className="text-right">
                            {translations.price}
                          </TableHead>
                          <TableHead className="text-right">
                            {translations.discount}
                          </TableHead>
                          <TableHead className="text-right">
                            {translations.total}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSale.items.map((item) => (
                          <TableRow key={item.productId}>
                            <TableCell>
                              {getProductName(item.productId)}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.discount}%
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.total)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                {translations.cancel || "Cancel"}
              </Button>
            </DialogClose>
            {selectedSale && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(selectedSale.id)}
                className="ml-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {translations.delete || "Delete"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
