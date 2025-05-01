import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ProductType {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
  status: string;
}

interface Sale {
  id: number;
  productId: number;
  quantity: number;
  date: string;
  customerType?: "regular" | "wholesale" | "new";
  paymentMethod?: "cash" | "credit" | "online";
  discount?: number;
}

interface SalesByCategoryChartProps {
  sales: Sale[];
  products: ProductType[];
  translations: Record<string, string>;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function SalesByCategoryChart({
  sales,
  products,
  translations,
}: SalesByCategoryChartProps) {
  const salesByCategory = useMemo(() => {
    const categories = Array.from(new Set(products.map((p) => p.category)));
    return categories.map((cat) => ({
      category: cat,
      quantity: sales
        .filter((s) => {
          const product = products.find((p) => p.id === s.productId);
          return product?.category === cat;
        })
        .reduce((sum, s) => sum + s.quantity, 0),
    }));
  }, [sales, products]);

  return (
    <div className="bg-card text-card-foreground p-4 rounded shadow">
      <h2 className="font-medium mb-2">{translations.salesByCategory}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={salesByCategory}
            dataKey="quantity"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ category, percent }) =>
              `${category} ${(percent * 100).toFixed(0)}%`
            }
          >
            {salesByCategory.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} items`, null]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
