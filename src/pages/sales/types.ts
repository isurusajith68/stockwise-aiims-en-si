export type ContactInfo = {
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
};

export type LocationInfo = {
  country: string;
  district: string;
  city: string;
  address: string;
};

export type Customer = {
  id: string;
  name: string;
  type: "regular" | "wholesale" | "new";
  contactInfo: ContactInfo;
  locationInfo: LocationInfo;
};

export type SaleItem = {
  productId: number;
  quantity: number;
  price: number;
  discount: number;
  total: number;
};

export type Sale = {
  id: number;
  items: SaleItem[];
  date: string;
  customerType: "regular" | "wholesale" | "new";
  paymentMethod: "cash" | "credit" | "online" | "cash_on_delivery";
  customerId: string;
  customerName: string;
  totalAmount: number;
  customerContactInfo: ContactInfo;
  customerLocationInfo: LocationInfo;
  delivery?: {
    status: string;
    address: string;
    scheduledDate?: string;
    notes?: string;
    trackingInfo?: string;
  };
};

export interface CustomerFormValues {
  customerName: string;
  customerType: "regular" | "wholesale" | "new";
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  country: string;
  district: string;
  city: string;
  address: string;
}

export interface ProductType {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  threshold: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}
