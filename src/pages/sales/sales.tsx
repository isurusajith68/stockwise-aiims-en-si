import { useContext, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { LanguageContext } from "@/lib/language-context";
import { Phone, ShoppingCart, Truck } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormLabel } from "@/components/ui/form";
import { Sale } from "./types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

const DELIVERY_STATUS = {
  NOT_SCHEDULED: "not_scheduled",
  SCHEDULED: "scheduled",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  FAILED: "failed",
};

const deliverySchema = z.object({
  status: z.enum([
    "not_scheduled",
    "scheduled",
    "in_transit",
    "delivered",
    "failed",
  ]),
  address: z.string().min(1, "Address is required"),
  scheduledDate: z.string().optional(),
  notes: z.string().optional(),
  trackingInfo: z.string().optional(),
});
type DeliveryFormValues = z.infer<typeof deliverySchema>;

export default function SalesPage() {
  const { translations } = useContext(LanguageContext);
  const [sales, setSales] = useLocalStorage<Sale[]>("sales", []);
  const [inventory] = useLocalStorage<ProductType[]>("inventory", []);
  const [filter, setFilter] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);

  const deliveryFormRHF = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      status: DELIVERY_STATUS.NOT_SCHEDULED,
      address: "",
      scheduledDate: "",
      notes: "",
      trackingInfo: "",
    },
  });

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

  // Open delivery dialog
  const handleDeliveryClick = (sale: Sale) => {
    setSelectedSale(sale);
    deliveryFormRHF.reset({
      status:
        (sale.delivery?.status as DeliveryFormValues["status"]) ||
        DELIVERY_STATUS.NOT_SCHEDULED,
      address: sale.delivery?.address || "",
      scheduledDate: sale.delivery?.scheduledDate || "",
      notes: sale.delivery?.notes || "",
      trackingInfo: sale.delivery?.trackingInfo || "",
    });
    setShowDeliveryDialog(true);
  };

  // Save delivery information
  const saveDeliveryInfo = () => {
    if (!selectedSale) return;

    const updatedSales = sales.map((sale) => {
      if (sale.id === selectedSale.id) {
        return {
          ...sale,
          delivery: {
            ...deliveryFormRHF.getValues(),
          },
        };
      }
      return sale;
    });

    setSales(updatedSales);
    setShowDeliveryDialog(false);
    setSelectedSale(null);
  };

  // Get delivery status badge variant
  const getDeliveryStatusBadge = (status) => {
    switch (status) {
      case DELIVERY_STATUS.SCHEDULED:
        return "secondary";
      case DELIVERY_STATUS.IN_TRANSIT:
        return "warning";
      case DELIVERY_STATUS.DELIVERED:
        return "success";
      case DELIVERY_STATUS.FAILED:
        return "destructive";
      default:
        return "outline";
    }
  };

  // Format delivery status for display
  const formatDeliveryStatus = (status) => {
    switch (status) {
      case DELIVERY_STATUS.NOT_SCHEDULED:
        return translations.notScheduled || "Not Scheduled";
      case DELIVERY_STATUS.SCHEDULED:
        return translations.scheduled || "Scheduled";
      case DELIVERY_STATUS.IN_TRANSIT:
        return translations.inTransit || "In Transit";
      case DELIVERY_STATUS.DELIVERED:
        return translations.delivered || "Delivered";
      case DELIVERY_STATUS.FAILED:
        return translations.failed || "Failed";
      default:
        return translations.notScheduled || "Not Scheduled";
    }
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
                <TableHead>{translations.delivery || "Delivery"}</TableHead>
                <TableHead className="text-right">
                  {translations.total || "Total"}
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
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
                    <TableCell>
                      {sale.delivery ? (
                        <Badge
                          variant={getDeliveryStatusBadge(sale.delivery.status)}
                        >
                          {formatDeliveryStatus(sale.delivery.status)}
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          {translations.notScheduled || "Not Scheduled"}
                        </Badge>
                      )}
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
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeliveryClick(sale)}
                        title={translations.manageDelivery || "Manage Delivery"}
                      >
                        <Truck className="h-4 w-4" />
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
                      {translations.delivery || "Delivery"}:
                    </span>{" "}
                    {selectedSale.delivery ? (
                      <Badge
                        variant={getDeliveryStatusBadge(
                          selectedSale.delivery.status
                        )}
                      >
                        {formatDeliveryStatus(selectedSale.delivery.status)}
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {translations.notScheduled || "Not Scheduled"}
                      </Badge>
                    )}
                    {selectedSale.delivery?.scheduledDate && (
                      <span className="ml-2 text-sm">
                        {new Date(
                          selectedSale.delivery.scheduledDate
                        ).toLocaleDateString()}
                      </span>
                    )}
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

                  {/* Delivery details section */}
                  {selectedSale.delivery && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="font-semibold mb-2">
                        {translations.deliveryDetails || "Delivery Details"}
                      </div>

                      {selectedSale.delivery.address && (
                        <div className="mb-2">
                          <span className="font-medium">
                            {translations.address || "Address"}:
                          </span>{" "}
                          {selectedSale.delivery.address}
                        </div>
                      )}

                      {selectedSale.delivery.scheduledDate && (
                        <div className="mb-2">
                          <span className="font-medium">
                            {translations.scheduledDate || "Scheduled Date"}:
                          </span>{" "}
                          {new Date(
                            selectedSale.delivery.scheduledDate
                          ).toLocaleString()}
                        </div>
                      )}

                      {selectedSale.delivery.trackingInfo && (
                        <div className="mb-2">
                          <span className="font-medium">
                            {translations.tracking || "Tracking"}:
                          </span>{" "}
                          {selectedSale.delivery.trackingInfo}
                        </div>
                      )}

                      {selectedSale.delivery.notes && (
                        <div className="mb-2">
                          <span className="font-medium">
                            {translations.notes || "Notes"}:
                          </span>{" "}
                          {selectedSale.delivery.notes}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{translations.close || "Close"}</Button>
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

      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {translations.manageDelivery || "Manage Delivery"}
            </DialogTitle>
            <DialogDescription>
              {translations.deliveryDetails ||
                "Enter delivery details for this order"}
            </DialogDescription>
          </DialogHeader>
          <Form {...deliveryFormRHF}>
            <form
              onSubmit={deliveryFormRHF.handleSubmit((data) => {
                if (!selectedSale) return;
                const updatedSales = sales.map((sale) =>
                  sale.id === selectedSale.id
                    ? { ...sale, delivery: { ...data } }
                    : sale
                );
                setSales(updatedSales);
                setShowDeliveryDialog(false);
                setSelectedSale(null);
              })}
              className="grid gap-4 py-4"
            >
              <FormField
                control={deliveryFormRHF.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translations.deliveryStatus || "Delivery Status"}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            translations.selectStatus || "Select status"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_scheduled">
                          {translations.notScheduled || "Not Scheduled"}
                        </SelectItem>
                        <SelectItem value="scheduled">
                          {translations.scheduled || "Scheduled"}
                        </SelectItem>
                        <SelectItem value="in_transit">
                          {translations.inTransit || "In Transit"}
                        </SelectItem>
                        <SelectItem value="delivered">
                          {translations.delivered || "Delivered"}
                        </SelectItem>
                        <SelectItem value="failed">
                          {translations.failed || "Failed"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deliveryFormRHF.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translations.deliveryAddress || "Delivery Address"}
                    </FormLabel>
                    <Textarea
                      {...field}
                      placeholder={
                        translations.enterAddress ||
                        "Enter full delivery address"
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deliveryFormRHF.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translations.scheduledDate || "Scheduled Date"}
                    </FormLabel>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deliveryFormRHF.control}
                name="trackingInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translations.trackingInfo || "Tracking Information"}
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder={
                        translations.trackingNumber ||
                        "Tracking number or delivery reference"
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deliveryFormRHF.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.notes || "Notes"}</FormLabel>
                    <Textarea
                      {...field}
                      placeholder={
                        translations.deliveryNotes ||
                        "Special instructions or delivery notes"
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">
                    {translations.cancel || "Cancel"}
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {translations.saveDelivery || "Save Delivery Info"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
