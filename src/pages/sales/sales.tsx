import { useContext } from "react";
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

export default function SalesPage() {
  const { translations } = useContext(LanguageContext);
  const [sales] = useLocalStorage<Sale[]>("sales", []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                      <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                      <p>
                        {translations.noSalesYet || "No sales recorded yet"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
