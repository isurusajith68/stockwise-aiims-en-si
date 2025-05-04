import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, Mail, MapPin } from "lucide-react";
import { Customer } from "./types";
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
import { useEffect, useState } from "react";
import { sriLankaDistricts, sriLankaCities } from "./sri-lanka-location";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Customer[] | null;
  setCustomers: (customers: Customer[]) => void;
  currentCustomer: Customer | null;
  setCurrentCustomer: (customer: Customer | null) => void;
  setShowSaleDialog: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  translations: Record<string, string>;
  from: string;
}

const customerSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerType: z.enum(["regular", "wholesale", "new"]),
  primaryPhone: z.string().min(1, "Primary phone is required"),
  secondaryPhone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  country: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
});

type CustomerFormSchema = z.infer<typeof customerSchema>;

export function CustomerDialog({
  open,
  onOpenChange,
  customers,
  setCustomers,
  setCurrentCustomer,
  setShowSaleDialog,
  searchTerm,
  setSearchTerm,
  translations,
  from,
  currentCustomer,
}: CustomerDialogProps) {
  const form = useForm<CustomerFormSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerName: "",
      customerType: "regular",
      primaryPhone: "",
      secondaryPhone: "",
      email: "",
      country: "",
      district: "",
      city: "",
      address: "",
    },
  });

  const [countries] = useState<string[]>(["Sri Lanka", "India"]);

  const [district, setDistrict] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const handleCountryChange = (country: string) => {
    form.setValue("country", country);
    setDistrict("");
    setCity("");
  };
  const handleDistrictChange = (district: string) => {
    setDistrict(district);
    setCity("");
    form.setValue("district", district);
  };
  const handleCityChange = (city: string) => {
    setCity(city);
    form.setValue("city", city);
  };

  const handleCustomerSubmit = (data: CustomerFormSchema) => {
    if (currentCustomer) {
      const updatedCustomer: Customer = {
        ...currentCustomer,
        name: data.customerName,
        type: data.customerType,
        contactInfo: {
          primaryPhone: data.primaryPhone || "",
          secondaryPhone: data.secondaryPhone || "",
          email: data.email || "",
        },
        locationInfo: {
          country: data.country || "",
          district: data.district || "",
          city: data.city || "",
          address: data.address || "",
        },
      };
      setCustomers(
        customers?.map((c) =>
          c.id === currentCustomer.id ? updatedCustomer : c
        ) || []
      );
      setCurrentCustomer(updatedCustomer);
      onOpenChange(false);
      setShowSaleDialog(true);
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: data.customerName,
        type: data.customerType,
        contactInfo: {
          primaryPhone: data.primaryPhone || "",
          secondaryPhone: data.secondaryPhone || "",
          email: data.email || "",
        },
        locationInfo: {
          country: data.country || "",
          district: data.district || "",
          city: data.city || "",
          address: data.address || "",
        },
      };
      const existingCustomer =
        customers &&
        customers.find(
          (c) =>
            c.contactInfo && c.contactInfo.primaryPhone === data.primaryPhone
        );
      if (!existingCustomer) {
        setCustomers([...(customers || []), newCustomer]);
      }
      setCurrentCustomer(newCustomer);
      onOpenChange(false);
      setShowSaleDialog(true);
    }
  };

  const selectCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    onOpenChange(false);
    setShowSaleDialog(true);
  };

  useEffect(() => {
    if (currentCustomer) {
      form.reset({
        customerName: currentCustomer?.name || "",
        customerType: currentCustomer?.type || "regular",
        primaryPhone: currentCustomer?.contactInfo?.primaryPhone || "",
        secondaryPhone: currentCustomer?.contactInfo?.secondaryPhone || "",
        email: currentCustomer?.contactInfo?.email || "",
        country: currentCustomer?.locationInfo?.country || "",
        district: currentCustomer?.locationInfo?.district || "",
        city: currentCustomer?.locationInfo?.city || "",
        address: currentCustomer?.locationInfo?.address || "",
      });
    }
  }, [currentCustomer]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setCurrentCustomer(null);
          setSearchTerm("");
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{translations.customerDetails}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="new" className="w-full">
          {from !== "customer" && (
            <TabsList
              className={
                from === "customer" ? "grid grid-cols-1" : "grid grid-cols-2"
              }
            >
              <TabsTrigger value="new">{translations.newCustomer}</TabsTrigger>
              <TabsTrigger value="existing">
                {translations.existingCustomer}
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="new" className="space-y-4 mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCustomerSubmit)}
                className="space-y-4"
                autoComplete="off"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.customerName}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John Doe" />
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
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select customer type" />
                              </SelectTrigger>
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="primaryPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.primaryPhone}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+1 (555) 123-4567" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="secondaryPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.secondaryPhone}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+1 (555) 987-6543" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.emailAddress}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="john.doe@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="location">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{translations.locationInfo}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{translations.country}</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={handleCountryChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {countries.map((country) => (
                                      <SelectItem key={country} value={country}>
                                        {country}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("country") === "Sri Lanka" && (
                          <FormField
                            control={form.control}
                            name="district"
                            render={() => (
                              <FormItem>
                                <FormLabel>{translations.district}</FormLabel>
                                <FormControl>
                                  <Select
                                    value={district}
                                    onValueChange={handleDistrictChange}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {sriLankaDistricts.map((d) => (
                                        <SelectItem key={d} value={d}>
                                          {d}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        {form.watch("country") === "Sri Lanka" &&
                          district &&
                          sriLankaCities[district] && (
                            <FormField
                              control={form.control}
                              name="city"
                              render={() => (
                                <FormItem>
                                  <FormLabel>{translations.city}</FormLabel>
                                  <FormControl>
                                    <Select
                                      value={city}
                                      onValueChange={handleCityChange}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select city" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {sriLankaCities[district].map((c) => (
                                          <SelectItem key={c} value={c}>
                                            {c}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                        {form.watch("country") === "India" && (
                          <>
                            <FormField
                              control={form.control}
                              name="district"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{translations.district}</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter district"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{translations.city}</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter city"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{translations.address}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="123 Main St, Apt 4B"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <DialogFooter>
                  <Button type="submit">{translations.continue}</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="existing" className="space-y-4 mt-4">
            <div className="form-item">
              <label>{translations.searchCustomer}</label>
              <div className="form-control mt-2">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={translations.searchByNamePhoneEmail}
                />
              </div>
              <span className="form-description text-xs mt-1">
                {translations.searchExistingCustomers}
              </span>
            </div>

            {customers && customers.length > 0 && (
              <div className="border rounded-md h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{translations.name}</TableHead>
                      <TableHead>{translations.contact}</TableHead>
                      <TableHead>{translations.type}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {customer.contactInfo?.primaryPhone}
                            </span>
                            {customer.contactInfo?.email && (
                              <span className="text-sm flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {customer.contactInfo?.email}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer?.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => selectCustomer(customer)}
                          >
                            {translations.select}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
