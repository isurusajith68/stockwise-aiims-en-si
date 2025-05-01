import { Card, CardContent } from "@/components/ui/card";
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

interface RecentSalesTableProps {
  sales: Sale[];
  products: ProductType[];
  translations: Record<string, string>;
}

export function RecentSalesTable({
  sales,
  products,
  translations,
}: RecentSalesTableProps) {
  const sortedSales = useMemo(() => {
    return [...sales].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [sales]);

  return (
    <Card className="p-0 mt-2">
      <CardContent className="">
        <div className="bg-card text-card-foreground  rounded shadow mt-8">
          <div className="font-medium text-lg mb-4">
            {translations.recentSales}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-card text-left text-xs font-medium text-card-foreground uppercase tracking-wider">
                    {translations.orderDate || "Date"}
                  </th>
                  <th className="px-6 py-3 bg-card text-left text-xs font-medium text-card-foreground uppercase tracking-wider">
                    {translations.product}
                  </th>
                  <th className="px-6 py-3 bg-card text-left text-xs font-medium text-card-foreground uppercase tracking-wider">
                    {translations.customerType}
                  </th>
                  <th className="px-6 py-3 bg-card text-right text-xs font-medium text-card-foreground uppercase tracking-wider">
                    {translations.quantity}
                  </th>
                  <th className="px-6 py-3 bg-card text-right text-xs font-medium text-card-foreground uppercase tracking-wider">
                    {translations.paymentMethod}
                  </th>
                  <th className="px-6 py-3 bg-card text-right text-xs font-medium text-card-foreground uppercase tracking-wider">
                    {translations.discount}
                  </th>
                  <th className="px-6 py-3 bg-card text-right text-xs font-medium text-card-foreground uppercase tracking-wider">
                    {translations.totalRevenue || "Revenue"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {sortedSales.slice(0, 10).map((sale, index) => {
                  const product = products.find((p) => p.id === sale.productId);
                  const baseRevenue = product
                    ? product.price * sale.quantity
                    : 0;
                  const discount = (sale.discount || 0) / 100;
                  const revenue = baseRevenue * (1 - discount);
                  return (
                    <tr
                      key={sale.id}
                      className={index % 2 === 0 ? "bg-card" : "bg-card"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                        {sale.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
                        {product?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        sale.customerType === "regular"
                          ? "bg-blue-100 text-blue-800"
                          : sale.customerType === "wholesale"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }
                    `}
                        >
                          {translations[sale.customerType || "regular"] ||
                            sale.customerType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground text-right">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                        {translations[sale.paymentMethod || "cash"] ||
                          sale.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground text-right">
                        {sale.discount ? `${sale.discount}%` : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground font-medium text-right">
                        ₹{revenue.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
