// src/components/AIAssistant.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Send,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Package,
} from "lucide-react";
import {
  generateInventoryRecommendations,
  generateSalesRecommendations,
  generateFinancialRecommendations,
} from "../lib/ai/recommendationsEngine";
import { ProductType } from "@/pages/products/types";
import { Sale } from "@/pages/sales/types";
import { Expense } from "@/pages/expenses/types";
import { translations, Language } from "../lib/translations";
import { Layout } from "@/components/layout/layout";
// If you have a theme context, import it. Otherwise, default to 'light'.
// import { useTheme } from "../path/to/theme-context";

// Recommendation type
interface Recommendation {
  type: string;
  icon: React.ReactNode;
  message: string;
}

interface AIAssistantProps {
  products: ProductType[];
  sales: Sale[];
  expenses: Expense[];
  theme?: "light" | "dark";
  language: Language;
}

// Translation function with variable interpolation
function t(
  language: Language,
  key: string,
  vars?: Record<string, string | number>
): string {
  // Support nested keys (e.g., aiAssistant.responses.inventory)
  const keys = key.split(".");
  let value: unknown = translations[language];
  for (const k of keys) {
    if (typeof value === "object" && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // fallback to key if not found
    }
  }
  if (typeof value !== "string") return key;
  if (vars) {
    return value.replace(/\{(\w+)\}/g, (_, v) => String(vars[v] ?? ""));
  }
  return value;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  products,
  sales,
  expenses,
  theme = "light",
  language,
}) => {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [aiResponse, setAiResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate initial recommendations on component mount or when data changes
  useEffect(() => {
    generateRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, sales, expenses]);

  const generateRecommendations = () => {
    // Get recommendations from each system
    const inventoryRecs = generateInventoryRecommendations(products, sales);
    const salesRecs = generateSalesRecommendations(products, sales);
    const financialRecs = generateFinancialRecommendations(
      products,
      sales,
      expenses
    );

    // Combine all recommendations
    const allRecommendations: Recommendation[] = [
      ...(inventoryRecs.criticalItems || []).map((item) => ({
        type: "critical-inventory",
        icon: <AlertCircle className="text-red-500" />,
        message: item.recommendation,
      })),
      ...(inventoryRecs.lowStockItems || []).map((item) => ({
        type: "low-inventory",
        icon: <Package className="text-yellow-500" />,
        message: item.recommendation,
      })),
      ...(salesRecs.growingProducts || []).map((item) => ({
        type: "sales-growth",
        icon: <TrendingUp className="text-green-500" />,
        message: item.recommendation,
      })),
      ...(financialRecs.anomalyRecommendations || []).map((item) => ({
        type: "expense-anomaly",
        icon: <DollarSign className="text-purple-500" />,
        message: item.recommendation,
      })),
    ];

    setRecommendations(allRecommendations);
  };

  const handleQuerySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);

    // Mock AI response based on query keywords
    // In a real implementation, this would use a natural language processing system
    let response = "";

    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("stock") || lowerQuery.includes("inventory")) {
      const criticalCount = recommendations.filter(
        (r) => r.type === "critical-inventory"
      ).length;
      const lowCount = recommendations.filter(
        (r) => r.type === "low-inventory"
      ).length;

      response = t(language, "aiAssistant.responses.inventory", {
        criticalCount,
        lowCount,
        total: products.length,
      });
    } else if (lowerQuery.includes("sale") || lowerQuery.includes("revenue")) {
      const growingCount = recommendations.filter(
        (r) => r.type === "sales-growth"
      ).length;
      const totalSales = sales
        .reduce((sum, sale) => sum + (sale.total || 0), 0)
        .toFixed(2);

      response = t(language, "aiAssistant.responses.sales", {
        growingCount,
        totalSales,
      });
    } else if (lowerQuery.includes("expense") || lowerQuery.includes("cost")) {
      const anomalyCount = recommendations.filter(
        (r) => r.type === "expense-anomaly"
      ).length;
      const totalExpenses = expenses
        .reduce((sum, expense) => sum + (expense.amount || 0), 0)
        .toFixed(2);

      response = t(language, "aiAssistant.responses.expenses", {
        anomalyCount,
        totalExpenses,
      });
    } else {
      response = t(language, "aiAssistant.responses.default");
    }

    // Simulate AI processing delay
    setTimeout(() => {
      setAiResponse(response);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <Card
      className={`shadow-md ${
        theme === "dark" ? "bg-slate-800 text-white" : "bg-white"
      }`}
    >
      <CardHeader>
        <CardTitle>{t(language, "aiAssistant.title")}</CardTitle>
        <CardDescription>
          {t(language, "aiAssistant.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* AI Recommendations */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">
              {t(language, "aiAssistant.recommendations")}
            </h3>
            {recommendations.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {recommendations.slice(0, 3).map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2 p-2 rounded-md bg-opacity-10 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20"
                  >
                    {rec.icon}
                    <span className="text-sm">{rec.message}</span>
                  </div>
                ))}
                {recommendations.length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    {t(language, "aiAssistant.showMore", {
                      count: recommendations.length - 3,
                    })}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t(language, "aiAssistant.noRecommendations")}
              </p>
            )}
          </div>

          {/* Query Input */}
          <form onSubmit={handleQuerySubmit} className="flex space-x-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(language, "aiAssistant.queryPlaceholder")}
              className="flex-1"
              disabled={isProcessing}
            />
            <Button type="submit" size="sm" disabled={isProcessing}>
              <Send size={16} />
            </Button>
          </form>

          {/* AI Response */}
          {aiResponse && (
            <div className="p-3 rounded-md bg-opacity-10 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20">
              <p className="text-sm">{aiResponse}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};



export default AIAssistant;
