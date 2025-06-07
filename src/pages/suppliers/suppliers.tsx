import { useContext, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Truck,
  RefreshCw,
  ArrowUpDown,
  MoreHorizontal,
  Phone,
  Mail,
  Trash,
  Edit,
  X,
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
import { LanguageContext } from "@/lib/language-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
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

// Supplier schema for form validation
const supplierSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Supplier name must be at least 2 characters." }),
  contact: z.string().min(2, { message: "Contact person name is required." }),
  phone: z.string().min(6, { message: "Valid phone number is required." }),
  email: z.string().email({ message: "Valid email address is required." }),
  address: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

// Mock suppliers data
const suppliers = [
  {
    id: 1,
    name: "Ceylon Grain Suppliers",
    contact: "Nuwan Perera",
    phone: "+94 77 123 4567",
    email: "nuwan@ceylongrain.lk",
    status: "active",
    productsSupplied: 15,
    lastOrder: "3 days ago",
  },
  {
    id: 2,
    name: "Dairy Fresh Ltd",
    contact: "Kamala Silva",
    phone: "+94 76 234 5678",
    email: "kamala@dairyfresh.lk",
    status: "active",
    productsSupplied: 8,
    lastOrder: "1 week ago",
  },
  {
    id: 3,
    name: "Kandy Wholesale Traders",
    contact: "Roshan Bandara",
    phone: "+94 71 345 6789",
    email: "roshan@kwt.lk",
    status: "inactive",
    productsSupplied: 25,
    lastOrder: "1 month ago",
  },
  {
    id: 4,
    name: "Colombo Grocery Distributors",
    contact: "Anita Fernando",
    phone: "+94 77 456 7890",
    email: "anita@cgd.lk",
    status: "active",
    productsSupplied: 32,
    lastOrder: "2 days ago",
  },
  {
    id: 5,
    name: "Island Spice Exporters",
    contact: "Ravi Mendis",
    phone: "+94 76 567 8901",
    email: "ravi@islandspice.lk",
    status: "active",
    productsSupplied: 10,
    lastOrder: "5 days ago",
  },
];

interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: string;
  productsSupplied: number;
  lastOrder: string;
  address?: string;
  notes?: string;
}

export function Suppliers() {
  const { translations } = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(suppliers);

  // Filter suppliers based on search query
  const filteredSuppliers = suppliersList.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit supplier
  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  // Handle delete supplier
  const handleDeleteSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete supplier
  const confirmDeleteSupplier = () => {
    if (!selectedSupplier) return;

    // Filter out the deleted supplier
    const updatedSuppliers = suppliersList.filter(
      (s) => s.id !== selectedSupplier.id
    );
    setSuppliersList(updatedSuppliers);

    toast.success(`${selectedSupplier.name} has been deleted.`);
    setIsDeleteDialogOpen(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {translations.suppliers}
        </h1>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {translations.addSupplier}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>{translations.supplierDirectory}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center rounded-md border px-3 h-9 text-sm w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  className="border-0 p-0 shadow-none focus-visible:ring-0 h-8"
                  placeholder={translations.searchSuppliers}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

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
                <TableHead className="w-[250px]">
                  <div className="flex items-center">
                    {translations.supplier}
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>{translations.contactPerson}</TableHead>
                <TableHead>{translations.contactInfo}</TableHead>
                <TableHead className="text-center">
                  {translations.status}
                </TableHead>
                <TableHead>{translations.products}</TableHead>
                <TableHead>{translations.lastOrder}</TableHead>
                <TableHead className="w-[100px]">
                  {translations.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {translations.noSuppliersFound}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      {supplier.name}
                    </TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                          <span className="text-sm">{supplier.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                          <span className="text-sm">{supplier.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          supplier.status === "active" ? "outline" : "secondary"
                        }
                      >
                        {supplier.status === "active"
                          ? translations.active
                          : translations.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell>{supplier.productsSupplied}</TableCell>
                    <TableCell>{supplier.lastOrder}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteSupplier(supplier)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Supplier Dialog */}
      <SupplierFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title={translations.addSupplier || "Add Supplier"}
        description={
          translations.addSupplierDescription ||
          "Add a new supplier to your inventory."
        }
        onSubmit={(data) => {
          const newSupplier: Supplier = {
            id: suppliersList.length + 1,
            name: data.name,
            contact: data.contact,
            phone: data.phone,
            email: data.email,
            status: data.isActive ? "active" : "inactive",
            productsSupplied: 0,
            lastOrder: "Never",
            address: data.address,
            notes: data.notes,
          };

          setSuppliersList([...suppliersList, newSupplier]);
          toast.success(`${data.name} has been added to suppliers.`);
          setIsAddDialogOpen(false);
        }}
      />

      {/* Edit Supplier Dialog */}
      {selectedSupplier && (
        <SupplierFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title={translations.editSupplier || "Edit Supplier"}
          description={
            translations.editSupplierDescription ||
            "Update supplier information."
          }
          defaultValues={{
            name: selectedSupplier.name,
            contact: selectedSupplier.contact,
            phone: selectedSupplier.phone,
            email: selectedSupplier.email,
            address: selectedSupplier.address || "",
            notes: selectedSupplier.notes || "",
            isActive: selectedSupplier.status === "active",
          }}
          onSubmit={(data) => {
            const updatedSuppliers = suppliersList.map((s) => {
              if (s.id === selectedSupplier.id) {
                return {
                  ...s,
                  name: data.name,
                  contact: data.contact,
                  phone: data.phone,
                  email: data.email,
                  status: data.isActive ? "active" : "inactive",
                  address: data.address,
                  notes: data.notes,
                };
              }
              return s;
            });

            setSuppliersList(updatedSuppliers);
            toast.success(`${data.name} has been updated.`);
            setIsEditDialogOpen(false);
            setSelectedSupplier(null);
          }}
        />
      )}

      {/* Delete Supplier Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {translations.deleteSupplier || "Delete Supplier"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {translations.deleteSupplierConfirmation ||
                "Are you sure you want to delete this supplier? This action cannot be undone."}
              {selectedSupplier && (
                <span className="font-medium block mt-2">
                  {selectedSupplier.name}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {translations.cancel || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSupplier}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {translations.delete || "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface SupplierFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  defaultValues?: SupplierFormValues;
  onSubmit: (data: SupplierFormValues) => void;
}

function SupplierFormDialog({
  open,
  onOpenChange,
  title,
  description,
  defaultValues = {
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    isActive: true,
  },
  onSubmit,
}: SupplierFormDialogProps) {
  const { translations } = useContext(LanguageContext);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues,
  });

  const handleSubmit = (data: SupplierFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Supplier Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translations.supplierName || "Supplier Name"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ceylon Grain Suppliers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Person */}
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translations.contactPerson || "Contact Person"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nuwan Perera" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translations.phone || "Phone Number"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+94 77 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.email || "Email"}</FormLabel>
                    <FormControl>
                      <Input placeholder="supplier@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.address || "Address"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Main St, Colombo, Sri Lanka"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.notes || "Notes"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional information about this supplier..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {translations.activeStatus || "Active Status"}
                    </FormLabel>
                    <FormDescription>
                      {translations.activeStatusDescription ||
                        "Is this supplier currently active?"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                {translations.cancel || "Cancel"}
              </Button>
              <Button type="submit">{translations.save || "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
