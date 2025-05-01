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

interface RevenueByPaymentChartProps {
  sales: Sale[];
  products: ProductType[];
  translations: Record<string, string>;
}

const PAYMENT_METHODS = ["cash", "credit", "online"];
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

export function RevenueByPaymentChart({
  sales,
  products,
  translations,
}: RevenueByPaymentChartProps) {
  const revenueByPayment = useMemo(() => {
    return PAYMENT_METHODS.map((method) => ({
      method,
      revenue: sales
        .filter((s) => s.paymentMethod === method)
        .reduce((sum, s) => {
          const product = products.find((p) => p.id === s.productId);
          const price = product ? product.price * s.quantity : 0;
          const discountAmount = price * ((s.discount || 0) / 100);
          return sum + (price - discountAmount);
        }, 0),
    }));
  }, [sales, products]);

  return (
    <div className="bg-card text-card-foreground p-4 rounded shadow">
      <h2 className="font-medium mb-2">{translations.revenueByPayment}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={revenueByPayment}
            dataKey="revenue"
            nameKey="method"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ method, percent }) =>
              `${translations[method] || method} ${(percent * 100).toFixed(0)}%`
            }
          >
            {revenueByPayment.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`₹${Number(value).toLocaleString()}`, null]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
