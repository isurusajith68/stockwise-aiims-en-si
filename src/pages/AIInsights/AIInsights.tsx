import React from "react";

import { translations, Language } from "@/lib/translations";
import { ProductType as BaseProductType } from "@/pages/products/types";
import { Sale } from "@/pages/sales/types";
import { Expense } from "@/pages/expenses/types";

import AIAssistant from "@/components/AIAssistant";

function t(
  language: Language,
  key: string,
  vars?: Record<string, string | number>
): string {
  const keys = key.split(".");
  let value: unknown = translations[language];
  for (const k of keys) {
    if (typeof value === "object" && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  if (typeof value !== "string") return key;
  if (vars) {
    return value.replace(/\{(\w+)\}/g, (_, v) => String(vars[v] ?? ""));
  }
  return value;
}

type ProductType = BaseProductType & { reorderPoint?: number };

interface AIInsightsProps {
  products: ProductType[];
  sales: Sale[];
  expenses: Expense[];
  language: Language;
  theme?: "light" | "dark";
}

const dummyProducts = [
  {
    id: 1,
    name: "Product A",
    sku: "SKU-A",
    category: "Category 1",
    stock: 100,
    quantity: 100,
    price: 10,
    reorderPoint: 20,
    threshold: 10,
    status: "active",
  },
  {
    id: 2,
    name: "Product B",
    sku: "SKU-B",
    category: "Category 2",
    stock: 50,
    quantity: 50,
    price: 20,
    reorderPoint: 10,
    threshold: 5,
    status: "active",
  },
  {
    id: 3,
    name: "Product C",
    sku: "SKU-C",
    category: "Category 3",
    stock: 10,
    quantity: 10,
    price: 15,
    reorderPoint: 5,
    threshold: 2,
    status: "active",
  },
];
const dummySales = [
  {
    id: 1,
    date: new Date().toISOString(),
    total: 200,
    productId: 0,
    quantity: 0,
    customer: "John Doe",
    customerType: "regular" as const,
    paymentMethod: "credit" as const,
    customerId: "101",
    items: [
      { id: 1, productId: 1, quantity: 5, price: 10, discount: 0, total: 50 },
      { id: 2, productId: 2, quantity: 2, price: 20, discount: 0, total: 40 },
    ],
    products: [
      { id: 1, name: "Product A", price: 10, quantity: 5 },
      { id: 2, name: "Product B", price: 20, quantity: 2 },
    ],
    customerName: "John Doe",
    totalAmount: 200,
    customerContactInfo: { email: "john.doe@example.com", primaryPhone: "123-456-7890", secondaryPhone: "987-654-3210" },
    customerLocationInfo: { address: "123 Main St", city: "Cityville", state: "Stateville", zip: "12345", country: "CountryA", district: "DistrictA" },
  },
  {
    id: 2,
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    total: 150,
    productId: 0,
    quantity: 0,
    customer: "Jane Smith",
    customerType: "wholesale" as const,
    paymentMethod: "cash" as const,
    customerId: "102",
    items: [
      { id: 2, productId: 2, quantity: 3, price: 20, discount: 0, total: 60 },
      { id: 3, productId: 3, quantity: 1, price: 15, discount: 0, total: 15 },
    ],
    products: [
      { id: 2, name: "Product B", price: 20, quantity: 3 },
      { id: 3, name: "Product C", price: 15, quantity: 1 },
    ],
    customerName: "Jane Smith",
    totalAmount: 150,
    customerContactInfo: { email: "jane.smith@example.com", primaryPhone: "555-123-4567", secondaryPhone: "555-765-4321" },
    customerLocationInfo: { address: "456 Elm St", city: "Townsville", state: "Stateville", zip: "67890", country: "CountryB", district: "DistrictB" },
  },
];
const dummyExpenses = [
  {
    id: 1,
    date: new Date().toISOString(),
    amount: 50,
    category: "Utilities",
    description: "Electricity bill",
  },
  {
    id: 2,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    amount: 30,
    category: "Supplies",
    description: "Office supplies",
  },
];

const AIInsights: React.FC<Partial<AIInsightsProps>> = ({
  language = "en",
  theme = "light",
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">{t(language, "aiInsights.title")}</h1>

      <AIAssistant
        products={dummyProducts}
        sales={dummySales}
        expenses={dummyExpenses}
        language={language}
        theme={theme}
      />
    </div>
  );
};

export default AIInsights;
