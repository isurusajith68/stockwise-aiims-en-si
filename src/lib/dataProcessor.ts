import { ProductType } from "@/pages/products/types";
import { Sale } from "@/pages/sales/types";
import { Expense } from "@/pages/expenses/types";

export function preprocessInventoryData(products: ProductType[]) {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    currentStock: product.quantity,
    stockHistory: product.stockHistory || [],
    category: product.category,
    price: product.price,
    cost: product.cost,
  }));
}

export function preprocessSalesData(sales: Sale[]) {
  // Transform sales data for pattern recognition
  return sales.map((sale) => ({
    date: new Date(sale.date),
    products: sale.products,
    total: sale.total,
    customer: sale.customer,
    paymentMethod: sale.paymentMethod,
  }));
}

export function preprocessExpenseData(expenses: Expense[]) {
  // Prepare expense data for anomaly detection
  return expenses.map((expense) => ({
    date: new Date(expense.date),
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
  }));
}
