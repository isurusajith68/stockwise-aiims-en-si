import { useContext, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { LanguageContext } from "@/lib/language-context";
import { Phone, ShoppingCart, Truck, Plus, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProductType } from "../products/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Sale } from "./types";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";

// Simple enum for delivery statuses
const DELIVERY_STATUS = {
  NOT_SCHEDULED: "not_scheduled",
  SCHEDULED: "scheduled",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  FAILED: "failed",
};

// Validation schema for delivery form
const deliverySchema = z.object({
  status: z.enum([
    "not_scheduled",
    "scheduled",
    "in_transit",
    "delivered",
    "failed",
  ]),
  address: z.string().min(1, "Address is required"),
  scheduledDate: z.string().min(1, "Scheduled Date is required"),
  notes: z.string().optional(),
  trackingInfo: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

export default function SalesPage() {
  const { translations } = useContext(LanguageContext);
  const [sales, setSales] = useLocalStorage<Sale[]>("sales", []);
  const [inventory] = useLocalStorage<ProductType[]>("inventory", []);
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [selectedDeliverySale, setSelectedDeliverySale] = useState<Sale | null>(
    null
  );

  // Setup form with validation
  const deliveryForm = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      status: DELIVERY_STATUS.NOT_SCHEDULED as DeliveryFormValues["status"],
      address: "",
      scheduledDate: "",
      notes: "",
      trackingInfo: "",
    },
  });

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  // Filter sales based on all filters
  const filteredSales = sales.filter((sale) => {
    let match = true;
    if (
      filterCustomer &&
      !sale.customerName.toLowerCase().includes(filterCustomer.toLowerCase())
    ) {
      match = false;
    }
    if (
      filterStatus &&
      filterStatus !== "all" &&
      (!sale.delivery || sale.delivery.status !== filterStatus)
    ) {
      match = false;
    }
    if (
      filterPayment &&
      filterPayment !== "all" &&
      sale.paymentMethod !== filterPayment
    ) {
      match = false;
    }
    if (dateRange.from) {
      const saleDate = new Date(sale.date);
      if (saleDate < dateRange.from) match = false;
    }
    if (dateRange.to) {
      const saleDate = new Date(sale.date);
      if (saleDate > dateRange.to) match = false;
    }
    return match;
  });

  // Delete sale handler
  const handleDelete = (id: number) => {
    setSales(sales.filter((sale) => sale.id !== id));
    setShowDetailsDialog(false);
    setSelectedSale(null);
  };

  // Get product name from inventory
  const getProductName = (productId: number) => {
    const product = inventory.find((p) => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  // Get badge variant based on delivery status
  const getDeliveryStatusBadge = (status: DeliveryFormValues["status"]) => {
    switch (status) {
      case DELIVERY_STATUS.SCHEDULED:
        return "secondary";
      case DELIVERY_STATUS.IN_TRANSIT:
        return "default";
      case DELIVERY_STATUS.DELIVERED:
        return "secondary";
      case DELIVERY_STATUS.FAILED:
        return "destructive";
      default:
        return "outline";
    }
  };

  // Format delivery status for display
  const formatDeliveryStatus = (status: DeliveryFormValues["status"]) => {
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

  // Handle delivery form submission
  const handleDeliverySubmit = (data: DeliveryFormValues) => {
    if (!selectedDeliverySale) return;

    // Update sales with delivery info
    const updatedSales = sales.map((sale) =>
      sale.id === selectedDeliverySale.id
        ? { ...sale, delivery: { ...data } }
        : sale
    );

    setSales(updatedSales);
    setSelectedDeliverySale({
      ...selectedDeliverySale,
      delivery: { ...data },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {translations.salesManagement || "Sales Management"}
        </h1>
        <Button asChild>
          <Link to="/sales/add">
            <Plus className="h-4 w-4 mr-2" />
            {translations.newSale || "New Sale"}
          </Link>
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">
            {translations.customer || "Customer"}
          </label>
          <Input
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
            placeholder={translations.customerName || "Customer name"}
            className="min-w-[160px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {translations.deliveryStatus || "Delivery Status"}
          </label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="min-w-[140px]">
              <SelectValue
                placeholder={translations.selectStatus || "Select status"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {translations.allStatuses || "All Statuses"}
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
              <SelectItem value="not_scheduled">
                {translations.notScheduled || "Not Scheduled"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {translations.paymentMethod || "Payment Method"}
          </label>
          <Select value={filterPayment} onValueChange={setFilterPayment}>
            <SelectTrigger className="min-w-[120px]">
              <SelectValue placeholder={translations.select || "Select"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {translations.allStatuses || "All"}
              </SelectItem>
              <SelectItem value="cash">
                {translations.cash || "Cash"}
              </SelectItem>
              <SelectItem value="credit">
                {translations.credit || "Credit"}
              </SelectItem>
              <SelectItem value="online">
                {translations.online || "Online"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {translations.dateRange || "Date Range"}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={
                  "w-[220px] justify-start text-left font-normal" +
                  (!dateRange.from && !dateRange.to
                    ? " text-muted-foreground"
                    : "")
                }
              >
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, "yyyy-MM-dd")} - ${format(
                      dateRange.to,
                      "yyyy-MM-dd"
                    )}`
                  : dateRange.from
                  ? `${format(dateRange.from, "yyyy-MM-dd")} - ...`
                  : translations.selectRange || "Select date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) =>
                  setDateRange(range ?? { from: undefined, to: undefined })
                }
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setFilterCustomer("");
            setFilterStatus("");
            setFilterPayment("");
            setDateRange({ from: undefined, to: undefined });
          }}
        >
          {translations.clearFilters || "Clear Filters"}
        </Button>
      </div>

      {/* Sales table */}
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
                      <Badge variant="outline">{sale.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      {sale.delivery ? (
                        <Badge
                          variant={getDeliveryStatusBadge(
                            sale.delivery.status as DeliveryFormValues["status"]
                          )}
                        >
                          {formatDeliveryStatus(
                            sale.delivery.status as DeliveryFormValues["status"]
                          )}
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
                          setShowDetailsDialog(true);
                        }}
                        title={translations.viewDetails || "View Details"}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedDeliverySale(sale);

                          if (sale.delivery) {
                            deliveryForm.reset({
                              status: sale.delivery
                                .status as DeliveryFormValues["status"],
                              address: sale.delivery.address || "",
                              scheduledDate: sale.delivery.scheduledDate || "",
                              notes: sale.delivery.notes || "",
                              trackingInfo: sale.delivery.trackingInfo || "",
                            });
                          } else {
                            deliveryForm.reset({
                              status:
                                DELIVERY_STATUS.NOT_SCHEDULED as DeliveryFormValues["status"],
                              address: sale.customerLocationInfo
                                ? sale.customerLocationInfo.address +
                                  " " +
                                  sale.customerLocationInfo.city +
                                  " " +
                                  sale.customerLocationInfo.district +
                                  " " +
                                  sale.customerLocationInfo.country
                                : " ",
                              notes: "",
                              trackingInfo: "",
                            });
                          }

                          setShowDeliveryDialog(true);
                        }}
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

      {/* Sale Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {translations.saleDetails || "Sale Details"}
            </DialogTitle>
          </DialogHeader>

          {selectedSale && (
            <div className="space-y-4">
              {/* Customer info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h3 className="font-medium text-sm">
                    {translations.customer || "Customer"}
                  </h3>
                  <p>{selectedSale.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSale.customerType}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">
                    {translations.contact || "Contact"}
                  </h3>
                  <p>{selectedSale.customerContactInfo?.primaryPhone}</p>
                  {selectedSale.customerContactInfo?.email && (
                    <p className="text-sm text-muted-foreground">
                      {selectedSale.customerContactInfo.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Order info */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <h3 className="font-medium text-sm">
                    {translations.date || "Date"}
                  </h3>
                  <p>{new Date(selectedSale.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">
                    {translations.paymentMethod || "Payment"}
                  </h3>
                  <p>{selectedSale.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">
                    {translations.total || "Total"}
                  </h3>
                  <p className="font-medium">
                    {formatCurrency(selectedSale.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Delivery status */}
              {selectedSale.delivery && (
                <div>
                  <h3 className="font-medium text-sm">
                    {translations.delivery || "Delivery"}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={getDeliveryStatusBadge(
                        selectedSale.delivery
                          .status as DeliveryFormValues["status"]
                      )}
                    >
                      {formatDeliveryStatus(
                        selectedSale.delivery
                          .status as DeliveryFormValues["status"]
                      )}
                    </Badge>
                    {selectedDeliverySale &&
                      selectedDeliverySale.delivery &&
                      selectedDeliverySale.delivery.scheduledDate && (
                        <span className="text-sm text-muted-foreground">
                          {(() => {
                            const d = new Date(
                              String(
                                selectedDeliverySale.delivery.scheduledDate ??
                                  ""
                              )
                            );
                            return isNaN(d.getTime())
                              ? ""
                              : `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
                          })()}
                        </span>
                      )}
                  </div>
                  {selectedSale.delivery.address && (
                    <p className="text-sm mt-1">
                      {selectedSale.delivery.address}
                    </p>
                  )}
                </div>
              )}

              {/* Items table */}
              <div>
                <h3 className="font-medium text-sm mb-2">
                  {translations.items || "Items"}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{translations.product || "Product"}</TableHead>
                      <TableHead className="text-right">
                        {translations.quantity || "Qty"}
                      </TableHead>
                      <TableHead className="text-right">
                        {translations.price || "Price"}
                      </TableHead>
                      <TableHead className="text-right">
                        {translations.total || "Total"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.items.map(
                      (item: {
                        productId: number;
                        quantity: number;
                        price: number;
                        total: number;
                      }) => (
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
                            {formatCurrency(item.total)}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => selectedSale && handleDelete(selectedSale.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {translations.delete || "Delete"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">{translations.close || "Close"}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="">
              {translations.deliveryDetails || "Delivery Details"}
            </DialogTitle>
          </DialogHeader>

          {selectedDeliverySale &&
            (selectedDeliverySale.delivery &&
            selectedDeliverySale.delivery.status !==
              DELIVERY_STATUS.NOT_SCHEDULED ? (
              <div className="space-y-6 p-2  bg-background  ">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-sm font-semibold mb-1">
                    {translations.deliveryStatus || "Delivery Status"} :
                  </h3>
                  <Badge
                    variant={getDeliveryStatusBadge(
                      selectedDeliverySale.delivery
                        .status as DeliveryFormValues["status"]
                    )}
                  >
                    {formatDeliveryStatus(
                      selectedDeliverySale.delivery
                        .status as DeliveryFormValues["status"]
                    )}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold mb-1">
                  {translations.scheduledDate || "Scheduled Date"} :
                </h3>
                {selectedDeliverySale &&
                  selectedDeliverySale.delivery &&
                  selectedDeliverySale.delivery.scheduledDate && (
                    <span className="text-sm text-muted-foreground">
                      {(() => {
                        const d = new Date(
                          String(
                            selectedDeliverySale.delivery.scheduledDate ?? ""
                          )
                        );
                        return isNaN(d.getTime())
                          ? ""
                          : `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
                      })()}
                    </span>
                  )}

                {selectedDeliverySale.delivery.address && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">
                      {translations.address || "Address"}
                    </h3>
                    <p className="text-sm">
                      {selectedDeliverySale.delivery.address}
                    </p>
                  </div>
                )}

                {selectedDeliverySale.delivery.trackingInfo && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">
                      {translations.trackingNumber || "Tracking #"}
                    </h3>
                    <p className="text-sm">
                      {selectedDeliverySale.delivery.trackingInfo}
                    </p>
                  </div>
                )}

                {selectedDeliverySale.delivery.notes && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">
                      {translations.notes || "Notes"}
                    </h3>
                    <p className="text-sm">
                      {selectedDeliverySale.delivery.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    className="mt-4"
                    onClick={() => {
                      deliveryForm.reset({
                        status: selectedDeliverySale.delivery
                          ?.status as DeliveryFormValues["status"],
                        address: selectedDeliverySale.delivery?.address || "",
                        scheduledDate:
                          selectedDeliverySale.delivery?.scheduledDate || "",
                        notes: selectedDeliverySale.delivery?.notes || "",
                        trackingInfo:
                          selectedDeliverySale.delivery?.trackingInfo || "",
                      });
                      setSelectedDeliverySale({
                        ...selectedDeliverySale,
                        delivery: undefined,
                      });
                    }}
                  >
                    {translations.editDelivery || "Edit Delivery Info"}
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...deliveryForm}>
                <form
                  onSubmit={deliveryForm.handleSubmit(handleDeliverySubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={deliveryForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {translations.deliveryStatus || "Delivery Status"}
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                translations.selectStatus || "Select status"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
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
                            <SelectItem value="not_scheduled">
                              {translations.notScheduled || "Not Scheduled"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={deliveryForm.control}
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
                            "Enter delivery address"
                          }
                          rows={2}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={deliveryForm.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {translations.scheduledDate || "Scheduled Date"}
                        </FormLabel>
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) =>
                            field.onChange(date ? date.toISOString() : "")
                          }
                          showTimeSelect
                          dateFormat="Pp"
                          className="w-full rounded border px-2 py-1 bg-background"
                          placeholderText="Select date and time"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={deliveryForm.control}
                    name="trackingInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {translations.trackingNumber || "Tracking #"}
                        </FormLabel>
                        <Input
                          {...field}
                          placeholder={
                            translations.trackingNumber || "Tracking number"
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={deliveryForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translations.notes || "Notes"}</FormLabel>
                        <Textarea
                          {...field}
                          placeholder={
                            translations.deliveryNotes || "Special instructions"
                          }
                          rows={2}
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
                      {translations.saveDelivery || "Save"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
