import { useContext, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  PackageOpen,
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageContext } from "@/lib/language-context";
import { RecentActivityList } from "./recent-activity-list";
import { InventoryChart } from "./inventory-chart";
import { LowStockAlert } from "./low-stock-alert";
import { TopSellingProducts } from "./top-selling-products";
import { LowStockNotification } from "@/components/ui/LowStockNotification";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function Dashboard() {
  const { translations } = useContext(LanguageContext);
  const [inventory] = useLocalStorage<any[]>("inventory", []);

  useEffect(() => {
    const lowStock = inventory.filter((p) => p.status === "low_stock");
    const critical = inventory.filter((p) => p.status === "critical");
    if (
      (lowStock.length > 0 || critical.length > 0) &&
      "Notification" in window
    ) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        const body =
          [
            critical.length > 0 ? `${critical.length} critical` : null,
            lowStock.length > 0 ? `${lowStock.length} low stock` : null,
          ]
            .filter(Boolean)
            .join(", ") + " item(s) need attention.";
        new Notification("Inventory Alert", {
          body,
          icon: "/favicon.ico",
        });
      }
    }
  }, [inventory]);

  return (
    <div className="space-y-6 animate-fade-in">
      <LowStockNotification inventory={inventory} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {translations.dashboard}
        </h1>
        <div className="mt-4 sm:mt-0">
          <Badge variant="outline" className="mr-2">
            <span className="mr-1">●</span>
            {translations.lastUpdated}: 5 {translations.minutesAgo}
          </Badge>
          <Button size="sm">{translations.refresh}</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={translations.totalProducts}
          value="243"
          trend="+12%"
          trend_direction="up"
          icon={Package}
        />
        <StatCard
          title={translations.lowStock}
          value="18"
          trend="+5"
          trend_direction="up"
          icon={AlertTriangle}
          alert
        />
        <StatCard
          title={translations.sales}
          value="LKR 43,521"
          trend="+18%"
          trend_direction="up"
          icon={DollarSign}
        />
        <StatCard
          title={translations.pendingOrders}
          value="5"
          trend="-2"
          trend_direction="down"
          icon={ShoppingCart}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>{translations.inventoryOverview}</CardTitle>
            <div className="flex space-x-2">
              <Badge variant="outline">{translations.thisMonth}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <InventoryChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{translations.lowStockItems}</CardTitle>
            <CardDescription>
              {translations.itemsRequiringAttention}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LowStockAlert />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {translations.viewAllItems}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{translations.topSellingProducts}</CardTitle>
            <CardDescription>{translations.bestSellingItems}</CardDescription>
          </CardHeader>
          <CardContent>
            <TopSellingProducts />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {translations.viewAllProducts}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{translations.recentActivity}</CardTitle>
            <CardDescription>{translations.recentTransactions}</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityList />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {translations.viewAllActivity}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trend_direction: "up" | "down";
  icon: React.ElementType;
  alert?: boolean;
}

function StatCard({
  title,
  value,
  trend,
  trend_direction,
  icon: Icon,
  alert = false,
}: StatCardProps) {
  return (
    <Card
      className={
        alert
          ? "border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-800"
          : ""
      }
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div
            className={`rounded-full p-2 ${
              alert
                ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "bg-primary/10 text-primary"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {trend_direction === "up" ? (
            <TrendingUp
              className={`h-4 w-4 mr-1 ${
                alert
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
          )}
          <span
            className={`text-sm font-medium ${
              trend_direction === "up"
                ? alert
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
