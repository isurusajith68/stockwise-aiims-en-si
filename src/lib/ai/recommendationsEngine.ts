import {
  predictStockLevels,
  detectSalesPatterns,
  detectExpenseAnomalies,
} from "./predictionEngine";
import { ProductType } from "@/pages/products/types";
import { Sale } from "@/pages/sales/types";
import { Expense } from "@/pages/expenses/types";

export function generateInventoryRecommendations(
  products: ProductType[],
  sales: Sale[]
) {
  const stockPredictions = predictStockLevels(products, sales);

  return {
    criticalItems: stockPredictions
      .filter(
        (item: any) => item.daysRemaining !== null && item.daysRemaining < 7
      )
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        currentStock: item.currentStock,
        daysRemaining: item.daysRemaining,
        reorderQuantity: item.reorderQuantity,
        recommendation: `Reorder ${item.reorderQuantity} units of ${item.name} immediately. Stock will run out in ${item.daysRemaining} days.`,
      })),

    lowStockItems: stockPredictions
      .filter(
        (item: any) =>
          item.daysRemaining !== null &&
          item.daysRemaining >= 7 &&
          item.daysRemaining < 14
      )
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        currentStock: item.currentStock,
        daysRemaining: item.daysRemaining,
        reorderQuantity: item.reorderQuantity,
        recommendation: `Consider reordering ${item.reorderQuantity} units of ${item.name} soon. Stock will run out in ${item.daysRemaining} days.`,
      })),

    overstockedItems: stockPredictions
      .filter(
        (item: any) => item.daysRemaining !== null && item.daysRemaining > 60
      )
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        currentStock: item.currentStock,
        daysRemaining: item.daysRemaining,
        recommendation: `${item.name} has ${item.daysRemaining} days of inventory. Consider running a promotion to reduce excess stock.`,
      })),
  };
}

export function generateSalesRecommendations(
  products: ProductType[],
  sales: Sale[]
) {
  const salesPatterns = detectSalesPatterns(sales);

  // Find products with growth potential
  const growingProducts = salesPatterns
    .filter((pattern: any) => pattern.growthTrend === "growing")
    .map((pattern: any) => {
      const product = products.find(
        (p) => String(p.id) === String(pattern.productId)
      );
      return {
        id: pattern.productId,
        name: product ? product.name : `Product #${pattern.productId}`,
        growthTrend: pattern.growthTrend,
        recommendation: `${
          product ? product.name : `Product #${pattern.productId}`
        } shows increasing demand. Consider stocking more and featuring prominently.`,
      };
    });

  // Find products with declining sales
  const decliningProducts = salesPatterns
    .filter((pattern: any) => pattern.growthTrend === "declining")
    .map((pattern: any) => {
      const product = products.find(
        (p) => String(p.id) === String(pattern.productId)
      );
      return {
        id: pattern.productId,
        name: product ? product.name : `Product #${pattern.productId}`,
        growthTrend: pattern.growthTrend,
        recommendation: `${
          product ? product.name : `Product #${pattern.productId}`
        } shows declining sales. Consider discounts or bundling with popular items.`,
      };
    });

  // Generate bundle recommendations based on frequently co-purchased items
  const bundleRecommendations = generateBundleRecommendations(sales, products);

  return {
    growingProducts,
    decliningProducts,
    bundleRecommendations,
  };
}

function generateBundleRecommendations(sales: Sale[], products: ProductType[]) {
  // This would be more sophisticated in a real implementation
  // Simple implementation for demonstration

  // Count co-occurrences of products in sales
  const coOccurrences: { [key: string]: number } = {};

  sales.forEach((sale: Sale) => {
    if (!Array.isArray(sale.products) || sale.products.length < 2) return; // Skip single-item sales

    // For each pair of products in this sale
    for (let i = 0; i < sale.products.length; i++) {
      for (let j = i + 1; j < sale.products.length; j++) {
        const id1 = String(sale.products[i].id);
        const id2 = String(sale.products[j].id);

        // Create consistent key regardless of order
        const key = [id1, id2].sort().join("-");

        if (!coOccurrences[key]) {
          coOccurrences[key] = 0;
        }

        coOccurrences[key]++;
      }
    }
  });

  // Sort by occurrence count and take top 5
  const topPairs = Object.entries(coOccurrences)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Format recommendations
  return topPairs.map(([key, count]) => {
    const [id1, id2] = key.split("-");
    const product1 = products.find((p) => String(p.id) === id1) || {
      name: `Product #${id1}`,
    };
    const product2 = products.find((p) => String(p.id) === id2) || {
      name: `Product #${id2}`,
    };

    return {
      pair: [id1, id2],
      productNames: [product1.name, product2.name],
      occurrences: count,
      recommendation: `Consider bundling ${product1.name} with ${product2.name}. They were purchased together ${count} times.`,
    };
  });
}

export function generateFinancialRecommendations(
  products: ProductType[],
  sales: Sale[],
  expenses: Expense[]
) {
  const expenseAnomalies = detectExpenseAnomalies(expenses);

  // Recommend action on expense anomalies
  const anomalyRecommendations = expenseAnomalies.flatMap((category: any) =>
    category.anomalies
      .filter((anomaly: any) => anomaly.deviationPercent > 50) // Only significant anomalies
      .map((anomaly: any) => ({
        category: category.category,
        date: anomaly.date,
        amount: anomaly.amount,
        deviationPercent: anomaly.deviationPercent,
        recommendation: `Unusual ${
          category.category
        } expense on ${anomaly.date.toLocaleDateString()}: $${anomaly.amount.toFixed(
          2
        )} (${Math.round(
          anomaly.deviationPercent
        )}% higher than average). Review this transaction.`,
      }))
  );

  // Calculate profit margins by product
  const profitMargins = products.map((product: ProductType) => {
    const margin =
      ((product.price - (product as any).cost) / product.price) * 100;

    let recommendation = null;
    if (margin < 15) {
      recommendation = `${product.name} has a low profit margin (${Math.round(
        margin
      )}%). Consider increasing the price.`;
    }

    return {
      id: product.id,
      name: product.name,
      cost: (product as any).cost,
      price: product.price,
      margin,
      recommendation,
    };
  });

  // Filter products with recommendations
  const marginRecommendations = profitMargins.filter(
    (product: any) => product.recommendation !== null
  );

  return {
    anomalyRecommendations,
    marginRecommendations,
    // Future: cash flow forecasts
  };
}
