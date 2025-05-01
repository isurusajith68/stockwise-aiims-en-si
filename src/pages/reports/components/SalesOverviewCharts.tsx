import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

interface SalesOverviewChartsProps {
  sales: Sale[];
  products: ProductType[];
  translations: any;
  viewMode: "daily" | "weekly" | "monthly";
}

export function SalesOverviewCharts({
  sales,
  products,
  translations,
  viewMode,
}: SalesOverviewChartsProps) {
  // Prepare time series data
  const timeSeriesData = useMemo(() => {
    const salesMap = new Map();
    sales.forEach((sale) => {
      let key;
      const saleDate = new Date(sale.date);
      if (viewMode === "daily") {
        key = sale.date;
      } else if (viewMode === "weekly") {
        const day = saleDate.getDay();
        const diff = saleDate.getDate() - day;
        const weekStart = new Date(saleDate);
        weekStart.setDate(diff);
        key = weekStart.toISOString().slice(0, 10);
      } else if (viewMode === "monthly") {
        key = `${saleDate.getFullYear()}-${String(
          saleDate.getMonth() + 1
        ).padStart(2, "0")}`;
      }
      if (!salesMap.has(key)) {
        salesMap.set(key, { date: key, quantity: 0, revenue: 0 });
      }
      const entry = salesMap.get(key);
      entry.quantity += sale.quantity;
      const product = products.find((p) => p.id === sale.productId);
      const price = product ? product.price * sale.quantity : 0;
      const discountAmount = price * ((sale.discount || 0) / 100);
      entry.revenue += price - discountAmount;
    });
    return Array.from(salesMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [sales, products, viewMode]);

  // Best-selling products
  const salesByProduct = useMemo(() => {
    return products
      .map((product) => ({
        name: product.name,
        quantity: sales
          .filter((s) => s.productId === product.id)
          .reduce((sum, s) => sum + s.quantity, 0),
      }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [sales, products]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card text-card-foreground p-4 rounded shadow">
        <div className="font-medium mb-2">
          {translations.salesOverTime} ({translations[viewMode]})
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={timeSeriesData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#8884d8"
              allowDecimals={false}
            />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="quantity"
              name="Quantity"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="Revenue (₹)"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card text-card-foreground p-4 rounded shadow">
        <div className="font-medium mb-2">
          {translations.bestSellingProducts}
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={salesByProduct.slice(0, 5)}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
