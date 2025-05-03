import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  CreditCard,
  Banknote,
  Smartphone,
  Truck,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SaleDetailsProps {
  paymentMethod: "cash" | "credit" | "online" | "cash_on_delivery";
  setPaymentMethod: (
    method: "cash" | "credit" | "online" | "cash_on_delivery"
  ) => void;
  saleDate: string;
  setSaleDate: (date: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  translations: Record<string, string>;
}

export function SaleDetails({
  paymentMethod,
  setPaymentMethod,
  saleDate,
  setSaleDate,
  notes,
  setNotes,
  translations,
}: SaleDetailsProps) {
  const [date, setDate] = useState<Date | undefined>(
    saleDate ? new Date(saleDate) : new Date()
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setSaleDate(selectedDate.toISOString().slice(0, 10));
    }
  };

  const PaymentIcons = {
    cash: <Banknote className="h-4 w-4 mr-2" />,
    credit: <CreditCard className="h-4 w-4 mr-2" />,
    online: <Smartphone className="h-4 w-4 mr-2" />,
    cash_on_delivery: <Truck className="h-4 w-4 mr-2" />,
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{translations.saleDetails}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="payment-method">{translations.paymentMethod}</Label>
          <Select
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as any)}
          >
            <SelectTrigger id="payment-method">
              <SelectValue>
                <div className="flex items-center">
                  {PaymentIcons[paymentMethod]}
                  {translations[paymentMethod] || paymentMethod}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">
                <div className="flex items-center">
                  <Banknote className="h-4 w-4 mr-2" />
                  {translations.cash || "Cash"}
                </div>
              </SelectItem>
              <SelectItem value="credit">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {translations.credit || "Credit"}
                </div>
              </SelectItem>
              <SelectItem value="online">
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  {translations.online || "Online"}
                </div>
              </SelectItem>
              <SelectItem value="cash_on_delivery">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  {translations.cash_on_delivery || "Cash on Delivery"}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sale-date">{translations.saleDate}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="sale-date"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span>{translations.pickADate}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">{translations.notes}</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              translations.notesPlaceholder || "Optional notes or reference"
            }
            className="resize-none"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
