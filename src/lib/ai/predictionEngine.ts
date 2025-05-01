import {
  preprocessInventoryData,
  preprocessSalesData,
  preprocessExpenseData,
} from "../dataProcessor";
import { ProductType } from "@/pages/products/types";
import { Sale } from "@/pages/sales/types";
import { Expense } from "@/pages/expenses/types";

export function predictStockLevels(
  products: ProductType[],
  sales: Sale[],
  daysToForecast: number = 30
) {
  const processedProducts = preprocessInventoryData(products);
  const processedSales = preprocessSalesData(sales);

  return processedProducts.map((product: any) => {
    // Calculate average daily sales for this product
    const productSales = processedSales.filter(
      (sale: any) =>
        Array.isArray(sale.products) &&
        sale.products.some((p: any) => p.id === product.id)
    );

    // Calculate sales velocity (units sold per day)
    const salesVelocity = calculateSalesVelocity(product.id, productSales);

    // Predict days until out of stock
    const daysRemaining = product.currentStock
      ? product.currentStock / (salesVelocity || 1)
      : null;

    // Predict stock level after specified days
    const predictedStock = Math.max(
      0,
      (product.currentStock || 0) - salesVelocity * daysToForecast
    );

    return {
      id: product.id,
      name: product.name,
      currentStock: product.currentStock,
      salesVelocity,
      daysRemaining: isFinite(daysRemaining) ? Math.round(daysRemaining) : null,
      predictedStock: Math.round(predictedStock),
      needsReorder: daysRemaining !== null && daysRemaining < 14, // Flag if less than 2 weeks of stock
      reorderQuantity: calculateReorderQuantity(product, salesVelocity),
    };
  });
}

function calculateSalesVelocity(
  productId: number,
  sales: any[],
  days: number = 30
): number {
  // Get recent sales within the specified number of days
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const relevantSales = sales.filter((sale: any) => sale.date >= startDate);

  // Count total units sold for this product
  const unitsSold = relevantSales.reduce((total: number, sale: any) => {
    const productInSale = Array.isArray(sale.products)
      ? sale.products.find((p: any) => p.id === productId)
      : null;
    return (
      total +
      (productInSale ? productInSale.quantity || productInSale.stock || 0 : 0)
    );
  }, 0);

  // Return average units sold per day
  return unitsSold / days;
}

function calculateReorderQuantity(product: any, salesVelocity: number): number {
  // A simple formula for reorder quantity:
  // 30 days of stock plus 50% safety stock
  return Math.ceil(salesVelocity * 30 * 1.5);
}

export function detectSalesPatterns(sales: Sale[]) {
  const processedSales = preprocessSalesData(sales);

  // Group sales by product
  const salesByProduct: { [productId: string]: any[] } = {};
  processedSales.forEach((sale: any) => {
    if (!Array.isArray(sale.products)) return;
    sale.products.forEach((product: any) => {
      if (!salesByProduct[product.id]) {
        salesByProduct[product.id] = [];
      }
      salesByProduct[product.id].push({
        date: sale.date,
        quantity: product.quantity,
        total: (product.price || 0) * (product.quantity || 0),
      });
    });
  });

  // Analyze patterns for each product
  return Object.entries(salesByProduct).map(([productId, productSales]) => {
    // Calculate monthly sales trends
    const monthlySales = calculateMonthlySales(productSales);

    // Detect seasonal patterns if enough data
    const seasonalPattern = detectSeasonalPattern(monthlySales);

    return {
      productId,
      monthlySales,
      seasonalPattern,
      growthTrend: calculateGrowthTrend(monthlySales),
    };
  });
}

function calculateMonthlySales(
  productSales: any[]
): { monthYear: string; quantity: number }[] {
  // Group and sum sales by month
  const monthlySales: { [monthYear: string]: number } = {};

  productSales.forEach((sale: any) => {
    const dateObj = new Date(sale.date);
    const monthYear = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
    if (!monthlySales[monthYear]) {
      monthlySales[monthYear] = 0;
    }
    monthlySales[monthYear] += sale.quantity;
  });

  return Object.entries(monthlySales).map(([monthYear, quantity]) => ({
    monthYear,
    quantity,
  }));
}

function detectSeasonalPattern(
  monthlySales: { monthYear: string; quantity: number }[]
): any {
  // Simple seasonal detection - requires at least 12 months of data
  if (monthlySales.length < 12) {
    return null;
  }

  // More sophisticated pattern detection would go here
  // For now returning a simple month-to-month comparison

  return monthlySales;
}

function calculateGrowthTrend(
  monthlySales: { monthYear: string; quantity: number }[]
): string {
  if (monthlySales.length < 2) return "insufficient data";

  // Sort by date
  const sorted = [...monthlySales].sort(
    (a, b) => new Date(a.monthYear).getTime() - new Date(b.monthYear).getTime()
  );

  // Calculate percentage change from first to last month
  const firstMonth = sorted[0].quantity;
  const lastMonth = sorted[sorted.length - 1].quantity;

  const percentChange = ((lastMonth - firstMonth) / firstMonth) * 100;

  if (percentChange > 10) return "growing";
  if (percentChange < -10) return "declining";
  return "stable";
}

export function detectExpenseAnomalies(expenses: Expense[]) {
  const processedExpenses = preprocessExpenseData(expenses);

  // Group expenses by category
  const expensesByCategory: { [category: string]: any[] } = {};
  processedExpenses.forEach((expense: any) => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = [];
    }
    expensesByCategory[expense.category].push(expense);
  });

  // Detect anomalies in each category
  return Object.entries(expensesByCategory).map(
    ([category, categoryExpenses]) => {
      // Calculate mean and standard deviation
      const amounts = (categoryExpenses as any[]).map((e) => e.amount);
      const mean =
        amounts.reduce((sum: number, amount: number) => sum + amount, 0) /
        amounts.length;
      const stdDev = Math.sqrt(
        amounts.reduce(
          (sum: number, amount: number) => sum + Math.pow(amount - mean, 2),
          0
        ) / amounts.length
      );

      // Flag expenses that are more than 2 standard deviations from the mean
      const anomalies = (categoryExpenses as any[]).filter(
        (expense) => Math.abs(expense.amount - mean) > 2 * stdDev
      );

      return {
        category,
        mean,
        stdDev,
        anomalies: anomalies.map((a) => ({
          date: a.date,
          amount: a.amount,
          description: a.description,
          deviationPercent: ((a.amount - mean) / mean) * 100,
        })),
      };
    }
  );
}
