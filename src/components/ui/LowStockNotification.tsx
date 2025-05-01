import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { ProductType } from "@/pages/products/types";

interface LowStockNotificationProps {
  inventory: ProductType[];
}

export function LowStockNotification({ inventory }: LowStockNotificationProps) {
  const lowStock = inventory.filter((p) => p.status === "low_stock");
  const critical = inventory.filter((p) => p.status === "critical");
  const [dismissed, setDismissed] = useState(false);

  if ((lowStock.length === 0 && critical.length === 0) || dismissed)
    return null;

  return (
    <div className="mb-4 p-4 rounded shadow flex flex-col gap-2 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 relative">
      <button
        className="absolute top-2 right-2 text-yellow-700 dark:text-yellow-300 hover:opacity-70"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        <X size={18} />
      </button>
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle
          className="text-yellow-600 dark:text-yellow-300"
          size={20}
        />
        <span className="font-semibold text-yellow-800 dark:text-yellow-200">
          Inventory Alert: {critical.length} critical, {lowStock.length} low
          stock item(s)
        </span>
      </div>
      {critical.length > 0 && (
        <div>
          <span className="font-medium text-red-700 dark:text-red-300">
            Critical:
          </span>
          <ul className="ml-4 list-disc text-red-700 dark:text-red-300">
            {critical.map((p) => (
              <li key={p.id}>
                {p.name} ({p.stock} left)
              </li>
            ))}
          </ul>
        </div>
      )}
      {lowStock.length > 0 && (
        <div>
          <span className="font-medium text-yellow-800 dark:text-yellow-200">
            Low Stock:
          </span>
          <ul className="ml-4 list-disc text-yellow-800 dark:text-yellow-200">
            {lowStock.map((p) => (
              <li key={p.id}>
                {p.name} ({p.stock} left)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
