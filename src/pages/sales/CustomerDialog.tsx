import { useState } from "react";
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
import { Customer, CustomerFormValues } from "./types";

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
  filteredCustomers: Customer[];
  translations: any;
}

export function CustomerDialog({
  open,
  onOpenChange,
  customers,
  setCustomers,
  setCurrentCustomer,
  setShowSaleDialog,
  searchTerm,
  setSearchTerm,
  filteredCustomers,
  translations,
}: CustomerDialogProps) {
  const [customerFormData, setCustomerFormData] = useState<CustomerFormValues>({
    customerName: "",
    customerType: "regular",
    primaryPhone: "",
    secondaryPhone: "",
    email: "",
    country: "",
    district: "",
    city: "",
    address: "",
  });

  const handleCustomerFormChange = (
    field: keyof CustomerFormValues,
    value: string
  ) => {
    setCustomerFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomerSubmit = () => {
    console.log(customerFormData);
    if (!customerFormData.customerName.trim()) {
      alert("Customer name is required");
      return;
    }

    if (!customerFormData.primaryPhone.trim()) {
      alert("Primary phone number is required");
      return;
    }

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: customerFormData.customerName,
      type: customerFormData.customerType,
      contactInfo: {
        primaryPhone: customerFormData?.primaryPhone,
        secondaryPhone: customerFormData.secondaryPhone,
        email: customerFormData.email,
      },
      locationInfo: {
        country: customerFormData.country,
        district: customerFormData.district,
        city: customerFormData.city,
        address: customerFormData.address,
      },
    };

    const existingCustomer = customers.find(
      (c) =>
        c.contactInfo &&
        c.contactInfo.primaryPhone === customerFormData.primaryPhone
    );

    if (!existingCustomer) {
      setCustomers([...customers, newCustomer]);
    }

    setCurrentCustomer(newCustomer);
    onOpenChange(false);
    setShowSaleDialog(true);
  };

  const selectCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    onOpenChange(false);
    setShowSaleDialog(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{translations.customerDetails}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="new">{translations.newCustomer}</TabsTrigger>
            <TabsTrigger value="existing">
              {translations.existingCustomer}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="form-item">
                  <label>{translations.customerName}</label>
                  <div className="form-control">
                    <Input
                      value={customerFormData.customerName}
                      onChange={(e) =>
                        handleCustomerFormChange("customerName", e.target.value)
                      }
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="form-item">
                  <label>{translations.customerType}</label>
                  <Select
                    value={customerFormData.customerType}
                    onValueChange={(value) =>
                      handleCustomerFormChange("customerType", value)
                    }
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
                      <SelectItem value="new">{translations.new}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="form-item">
                  <label>{translations.primaryPhone}</label>
                  <div className="form-control">
                    <Input
                      value={customerFormData.primaryPhone}
                      onChange={(e) =>
                        handleCustomerFormChange("primaryPhone", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div className="form-item">
                  <label>{translations.secondaryPhone}</label>
                  <div className="form-control">
                    <Input
                      value={customerFormData.secondaryPhone}
                      onChange={(e) =>
                        handleCustomerFormChange(
                          "secondaryPhone",
                          e.target.value
                        )
                      }
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                </div>

                <div className="form-item">
                  <label>{translations.emailAddress}</label>
                  <div className="form-control">
                    <Input
                      type="email"
                      value={customerFormData.email}
                      onChange={(e) =>
                        handleCustomerFormChange("email", e.target.value)
                      }
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
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
                    <div className="form-item">
                      <label>{translations.country}</label>
                      <div className="form-control">
                        <Input
                          value={customerFormData.country}
                          onChange={(e) =>
                            handleCustomerFormChange("country", e.target.value)
                          }
                          placeholder="United States"
                        />
                      </div>
                    </div>

                    <div className="form-item">
                      <label>{translations.district}</label>
                      <div className="form-control">
                        <Input
                          value={customerFormData.district}
                          onChange={(e) =>
                            handleCustomerFormChange("district", e.target.value)
                          }
                          placeholder="California"
                        />
                      </div>
                    </div>

                    <div className="form-item">
                      <label>{translations.city}</label>
                      <div className="form-control">
                        <Input
                          value={customerFormData.city}
                          onChange={(e) =>
                            handleCustomerFormChange("city", e.target.value)
                          }
                          placeholder="San Francisco"
                        />
                      </div>
                    </div>

                    <div className="form-item">
                      <label>{translations.address}</label>
                      <div className="form-control">
                        <Input
                          value={customerFormData.address}
                          onChange={(e) =>
                            handleCustomerFormChange("address", e.target.value)
                          }
                          placeholder="123 Main St, Apt 4B"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="existing" className="space-y-4 mt-4">
            <div className="form-item">
              <label>{translations.searchCustomer}</label>
              <div className="form-control">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={translations.searchByNamePhoneEmail}
                />
              </div>
              <span className="form-description">
                {translations.searchExistingCustomers}
              </span>
            </div>

            {filteredCustomers.length > 0 && (
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
                    {filteredCustomers.map((customer) => (
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
                            variant="ghost"
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

        <DialogFooter>
          <Button onClick={handleCustomerSubmit}>
            {translations.continue}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
