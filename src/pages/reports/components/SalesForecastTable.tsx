import React, { useMemo } from "react";

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

interface SalesForecastTableProps {
  sales: Sale[];
  products: ProductType[];
  translations: Record<string, string>;
}

export function SalesForecastTable({
  sales,
  products,
  translations,
}: SalesForecastTableProps) {
  const forecast = useMemo(() => {
    const categories = Array.from(new Set(products.map((p) => p.category)));
    return categories.map((category) => {
      const categorySales = sales.filter((sale) => {
        const product = products.find((p) => p.id === sale.productId);
        return product?.category === category;
      });
      // Calculate average daily sales for this category
      const earliestDate = new Date(
        categorySales.length > 0
          ? categorySales.reduce(
              (earliest, sale) =>
                new Date(sale.date) < new Date(earliest) ? sale.date : earliest,
              categorySales[0].date
            )
          : new Date().toISOString()
      );
      const totalDays = Math.max(
        1,
        (new Date().getTime() - new Date(earliestDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const totalQuantity = categorySales.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      );
      const dailyAverage = totalQuantity / totalDays;
      // Project for next 30 days with a small growth factor
      const growthFactor = 1.05;
      const prediction = Math.round(dailyAverage * 30 * growthFactor);
      return { category, prediction };
    });
  }, [sales, products]);

  return (
    <div className="bg-card text-card-foreground p-4 rounded shadow mt-8">
      <div className="font-medium text-lg mb-4">
        {translations.salesForecast}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-card text-left text-xs font-medium text-card-foreground uppercase tracking-wider">
                {translations.category}
              </th>
              <th className="px-6 py-3 bg-card text-right text-xs font-medium text-card-foreground uppercase tracking-wider">
                Projected Units (30 days)
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {forecast.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-card" : "bg-card"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground text-right">
                  {item.prediction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
