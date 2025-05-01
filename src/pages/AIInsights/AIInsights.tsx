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
    products: [
      { id: 1, quantity: 5, price: 10 },
      { id: 2, quantity: 2, price: 20 },
    ],
  },
  {
    id: 2,
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    total: 150,
    productId: 0,
    quantity: 0,
    customer: "Jane Smith",
    products: [
      { id: 2, quantity: 3, price: 20 },
      { id: 3, quantity: 1, price: 15 },
    ],
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
    <div
      className={`space-y-6 ${
        theme === "dark" ? "bg-slate-900 text-white" : "bg-white"
      }`}
    >
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
