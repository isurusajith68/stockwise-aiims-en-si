import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Customer } from "./types";

interface CustomerInfoProps {
  customer: Customer;
  translations: Record<string, string>;
  openCustomerDialog: (open: boolean) => void;
}

export function CustomerInfo({
  customer,
  translations,
  openCustomerDialog,
}: CustomerInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              {translations.customerDetails}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openCustomerDialog(true)}
            >
              {translations.changeCustomer}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{customer.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {translations[customer.type]}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mt-2 sm:mt-0">
              {customer.contactInfo?.primaryPhone && (
                <div className="flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{customer.contactInfo.primaryPhone}</span>
                </div>
              )}

              {customer.contactInfo?.email && (
                <div className="flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{customer.contactInfo.email}</span>
                </div>
              )}

              {(customer.locationInfo?.city ||
                customer.locationInfo?.country) && (
                <div className="flex items-start sm:col-span-2 mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground mt-0.5" />
                  <span>
                    {[
                      customer.locationInfo?.address,
                      customer.locationInfo?.city,
                      customer.locationInfo?.district,
                      customer.locationInfo?.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
