import { useContext, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  ArrowUpDown,
  MoreHorizontal,
  Calendar,
  Truck,
  FileText,
  CheckCircle2,
  XCircle,
  PackageCheck,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageContext } from "@/lib/language-context";
import { OrderForm } from "./order-form";

const orders = [
  {
    id: "PO-2024-001",
    date: "2024-03-15",
    supplier: "Ceylon Grain Suppliers",
    total: 125000,
    status: "pending",
    items: 8,
  },
  {
    id: "PO-2024-002",
    date: "2024-03-14",
    supplier: "Dairy Fresh Ltd",
    total: 45600,
    status: "confirmed",
    items: 5,
  },
  {
    id: "PO-2024-003",
    date: "2024-03-12",
    supplier: "Colombo Grocery Distributors",
    total: 89000,
    status: "shipped",
    items: 12,
  },
  {
    id: "PO-2024-004",
    date: "2024-03-10",
    supplier: "Island Spice Exporters",
    total: 34500,
    status: "delivered",
    items: 6,
  },
  {
    id: "PO-2024-005",
    date: "2024-03-08",
    supplier: "Kandy Wholesale Traders",
    total: 67800,
    status: "cancelled",
    items: 9,
  },
];

const formatStatus = (status: string) => {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        variant: "secondary" as const,
        icon: FileText,
      };
    case "confirmed":
      return {
        label: "Confirmed",
        variant: "outline" as const,
        icon: CheckCircle2,
      };
    case "shipped":
      return { label: "Shipped", variant: "default" as const, icon: Truck };
    case "delivered":
      return {
        label: "Delivered",
        variant: "success" as const,
        icon: PackageCheck,
      };
    case "cancelled":
      return {
        label: "Cancelled",
        variant: "destructive" as const,
        icon: XCircle,
      };
    default:
      return { label: status, variant: "outline" as const, icon: FileText };
  }
};

export function Orders() {
  const { translations } = useContext(LanguageContext);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {translations.orders}
        </h1>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsAddOrderOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {translations.createOrder}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>{translations.orderHistory}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center rounded-md border px-3 h-9 text-sm w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  className="border-0 p-0 shadow-none focus-visible:ring-0 h-8"
                  placeholder={translations.searchOrders}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-full sm:w-[150px]">
                  <SelectValue placeholder={translations.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {translations.allStatuses}
                  </SelectItem>
                  <SelectItem value="pending">
                    {translations.pending}
                  </SelectItem>
                  <SelectItem value="confirmed">
                    {translations.confirmed}
                  </SelectItem>
                  <SelectItem value="shipped">
                    {translations.shipped}
                  </SelectItem>
                  <SelectItem value="delivered">
                    {translations.delivered}
                  </SelectItem>
                  <SelectItem value="cancelled">
                    {translations.cancelled}
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
                <TableHead className="w-[150px]">
                  <div className="flex items-center">
                    {translations.orderNumber}
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    {translations.orderDate}
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>{translations.supplier}</TableHead>
                <TableHead className="text-right">
                  {translations.total}
                </TableHead>
                <TableHead className="text-center">
                  {translations.items}
                </TableHead>
                <TableHead className="text-center">
                  {translations.status}
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {translations.noOrdersFound}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const {
                    label,
                    variant,
                    icon: StatusIcon,
                  } = formatStatus(order.status);

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell className="text-right font-medium">
                        LKR {order.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {order.items}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge>
                          <StatusIcon className="h-3 w-3 mr-1" />
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
                            <DropdownMenuItem>
                              {translations.viewOrder}
                            </DropdownMenuItem>
                            {order.status === "pending" && (
                              <>
                                <DropdownMenuItem>
                                  {translations.editOrder}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  {translations.cancelOrder}
                                </DropdownMenuItem>
                              </>
                            )}
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

      {isAddOrderOpen && <OrderForm onClose={() => setIsAddOrderOpen(false)} />}
    </div>
  );
}
