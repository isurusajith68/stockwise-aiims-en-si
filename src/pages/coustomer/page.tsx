import { useContext, useState, useRef } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Search, Eye } from "lucide-react";
import { Customer } from "../sales/types";
import { CustomerDialog } from "../sales/CustomerDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { LanguageContext } from "@/lib/language-context";

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>(
    "customers",
    []
  );
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const { translations } = useContext(LanguageContext);

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.contactInfo.primaryPhone.toLowerCase().includes(q) ||
      c.contactInfo.email.toLowerCase().includes(q)
    );
  });

  const handleSaveCustomer = (customer: Customer) => {
    if (editCustomer) {
      // Edit
      setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
    } else {
      // Add
      setCustomers([...customers, customer]);
    }
    // Properly close dialog and reset state
    setShowDialog(false);
    setEditCustomer(null);
  };

  // Delete customer
  const handleDeleteCustomer = () => {
    if (deleteCustomer) {
      setCustomers(customers.filter((c) => c.id !== deleteCustomer.id));
      setDeleteCustomer(null);
    }
  };

  // Handlers for opening and closing dialogs
  const handleAddCustomer = () => {
    setEditCustomer(null);
    setShowDialog(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditCustomer(customer);
    setShowDialog(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setViewCustomer(customer);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewCustomer(null);
    setViewDialogOpen(false);
  };

  const handleConfirmDelete = (customer: Customer) => {
    setDeleteCustomer(customer);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteCustomer(null);
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {translations.customers}
          </h1>
          <div className="mt-4 sm:mt-0">
            <Button onClick={handleAddCustomer}>
              <Plus className="mr-2 h-4 w-4" />
              {translations.addCustomer}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>{translations.customers}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center rounded-md border px-3 h-9 text-sm w-full sm:w-auto">
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    className="border-0 p-0 shadow-none focus-visible:ring-0 h-8"
                    placeholder={translations.searchCustomers}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translations.name}</TableHead>
                  <TableHead>{translations.contact}</TableHead>
                  <TableHead>{translations.address}</TableHead>
                  <TableHead>{translations.type}</TableHead>
                  <TableHead className="w-[50px]">
                    {translations.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {translations.noCustomersFound}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm flex items-center">
                            {customer.contactInfo &&
                            customer.contactInfo.primaryPhone
                              ? customer.contactInfo.primaryPhone
                              : "-"}
                          </span>
                          {customer.contactInfo &&
                          customer.contactInfo.email ? (
                            <span className="text-sm flex items-center">
                              {customer.contactInfo.email}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.locationInfo && (
                          <div className="flex flex-col">
                            <span>
                              {customer.locationInfo.country
                                ? customer.locationInfo.country
                                : "-"}
                              {customer.locationInfo.district
                                ? " " + customer.locationInfo.district
                                : ""}
                              {customer.locationInfo.city
                                ? " " + customer.locationInfo.city
                                : ""}
                            </span>
                            <span>
                              {customer.locationInfo.address
                                ? " " + customer.locationInfo.address
                                : ""}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">
                          {translations[customer.type]}
                        </span>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewCustomer(customer)}
                            >
                              {translations.viewCustomer}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditCustomer(customer)}
                            >
                              {translations.editCustomer}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleConfirmDelete(customer)}
                            >
                              {translations.deleteCustomer}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <CustomerDialog
          open={showDialog}
          onOpenChange={() => setShowDialog(false)}
          customers={customers}
          setCustomers={setCustomers}
          currentCustomer={editCustomer}
          setCurrentCustomer={(c) => {
            if (c) handleSaveCustomer(c);
            else setShowDialog(false);
          }}
          setShowSaleDialog={() => setShowDialog(false)}
          searchTerm={""}
          setSearchTerm={() => {}}
          translations={translations}
          from="customer"
          filteredCustomers={filteredCustomers}
        />

        <AlertDialog
          open={!!deleteCustomer}
          onOpenChange={(open) => !open && handleCloseDeleteDialog()}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{translations.deleteCustomer}</AlertDialogTitle>
              <AlertDialogDescription>
                {translations.confirmDelete}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseDeleteDialog}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white"
                onClick={handleDeleteCustomer}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Dialog open={viewDialogOpen} onOpenChange={handleCloseViewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{translations.viewCustomer}</DialogTitle>
            <DialogDescription>
              {translations.customerDetails}
            </DialogDescription>
          </DialogHeader>
          {viewCustomer && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">{viewCustomer.name}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-muted text-xs font-semibold">
                    {translations[viewCustomer.type]}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mt-2 sm:mt-0">
                <div>
                  <span className="font-semibold">{translations.contact}:</span>
                  <div className="flex items-center mt-1">
                    <span className="mr-2">📞</span>
                    {viewCustomer.contactInfo?.primaryPhone || "-"}
                  </div>
                  {viewCustomer.contactInfo?.secondaryPhone && (
                    <div className="flex items-center mt-1">
                      <span className="mr-2">📱</span>
                      {viewCustomer.contactInfo.secondaryPhone}
                    </div>
                  )}
                  {viewCustomer.contactInfo?.email && (
                    <div className="flex items-center mt-1">
                      <span className="mr-2">✉️</span>
                      {viewCustomer.contactInfo.email}
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-semibold">
                    {translations.customerDetails}:
                  </span>
                  <div className="mt-1">
                    {[
                      viewCustomer.locationInfo?.address,
                      viewCustomer.locationInfo?.city,
                      viewCustomer.locationInfo?.district,
                      viewCustomer.locationInfo?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button onClick={handleCloseViewDialog}>
                {translations.close || "Close"}
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
