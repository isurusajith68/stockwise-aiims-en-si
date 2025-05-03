import { useContext, useState } from "react";
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  Download,
  Calendar,
  TrendingUp,
  RefreshCw,
  Search,
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { LanguageContext } from "@/lib/language-context";
import { SalesOverviewCharts } from "./components/SalesOverviewCharts";
import { SalesByCategoryChart } from "./components/SalesByCategoryChart";
import { RevenueByPaymentChart } from "./components/RevenueByPaymentChart";
import { SalesForecastTable } from "./components/SalesForecastTable";
import { RecentSalesTable } from "./components/RecentSalesTable";
import { useLocalStorage } from "@/hooks/use-local-storage";

const salesData = [
  { name: "Jan", value: 15600 },
  { name: "Feb", value: 18200 },
  { name: "Mar", value: 17800 },
  { name: "Apr", value: 19500 },
  { name: "May", value: 22300 },
  { name: "Jun", value: 24600 },
  { name: "Jul", value: 23100 },
];

const categoryData = [
  { name: "Groceries", value: 45 },
  { name: "Dairy", value: 18 },
  { name: "Bakery", value: 12 },
  { name: "Beverages", value: 15 },
  { name: "Hygiene", value: 10 },
];

const stockMovementData = [
  { date: "Jul 1", in: 85, out: 72 },
  { date: "Jul 5", in: 65, out: 58 },
  { date: "Jul 10", in: 120, out: 98 },
  { date: "Jul 15", in: 45, out: 53 },
  { date: "Jul 20", in: 75, out: 63 },
  { date: "Jul 25", in: 95, out: 88 },
  { date: "Jul 30", in: 60, out: 65 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function Reports() {
  const { translations } = useContext(LanguageContext);
  const [timeRange, setTimeRange] = useState("month");
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [sales] = useLocalStorage<any[]>("sales", []);
  const [products] = useLocalStorage<any[]>("inventory", []);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {translations.reports}
        </h1>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder={translations.selectRange} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{translations.lastWeek}</SelectItem>
              <SelectItem value="month">{translations.lastMonth}</SelectItem>
              <SelectItem value="quarter">
                {translations.lastQuarter}
              </SelectItem>
              <SelectItem value="year">{translations.lastYear}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ReportStatCard 
          title={translations.totalSales} 
          value="LKR 175,340" 
          trend="+12.5%" 
          trend_direction="up"
          description={`${translations.vs} ${translations.previousMonth}`}
        />
        <ReportStatCard 
          title={translations.averageOrderValue} 
          value="LKR 2,450" 
          trend="+5.2%" 
          trend_direction="up"
          description={`${translations.vs} ${translations.previousMonth}`}
        />
        <ReportStatCard 
          title={translations.stockTurnover} 
          value="3.2x" 
          trend="-0.4x" 
          trend_direction="down"
          description={`${translations.vs} ${translations.previousMonth}`}
        />
        <ReportStatCard 
          title={translations.profitMargin} 
          value="18.5%" 
          trend="+2.3%" 
          trend_direction="up"
          description={`${translations.vs} ${translations.previousMonth}`}
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{translations.overview}</TabsTrigger>
          <TabsTrigger value="sales">{translations.sales}</TabsTrigger>
          <TabsTrigger value="inventory">{translations.inventory}</TabsTrigger>
          <TabsTrigger value="forecasts">{translations.forecasts}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>{translations.salesTrend}</CardTitle>
                <CardDescription>{translations.lastThirtyDays}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(0,0,0,0.1)"
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [
                        `LKR ${value.toLocaleString()}`,
                        translations.sales,
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary)/0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {translations.totalForPeriod}
                  </p>
                  <p className="text-xl font-bold">LKR 175,340</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {translations.exportData}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{translations.salesByCategory}</CardTitle>
                <CardDescription>
                  {translations.productCategoryDistribution}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [`${value}%`, null]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {translations.exportData}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{translations.stockMovement}</CardTitle>
              <CardDescription>
                {translations.incomingOutgoingStock}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stockMovementData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.1)"
                  />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="in"
                    name={translations.stockIn}
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="out"
                    name={translations.stockOut}
                    fill="hsl(var(--chart-2))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {translations.exportData}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setViewMode("daily")}
              variant={viewMode === "daily" ? "default" : "outline"}
            >
              {translations.daily}
            </Button>
            <Button
              onClick={() => setViewMode("weekly")}
              variant={viewMode === "weekly" ? "default" : "outline"}
            >
              {translations.weekly}
            </Button>
            <Button
              onClick={() => setViewMode("monthly")}
              variant={viewMode === "monthly" ? "default" : "outline"}
            >
              {translations.monthly}
            </Button>
          </div>
          <SalesOverviewCharts
            sales={sales}
            products={products}
            translations={translations}
            viewMode={viewMode}
          />
          <SalesByCategoryChart
            sales={sales}
            products={products}
            translations={translations}
          />
          <RevenueByPaymentChart
            sales={sales}
            products={products}
            translations={translations}
          />
          <SalesForecastTable
            sales={sales}
            products={products}
            translations={translations}
          />
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>{translations.inventoryAnalytics}</CardTitle>
              <CardDescription>
                {translations.detailedInventoryAnalytics}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-20">
                {translations.inventoryReportContent}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecasts">
          <Card>
            <CardHeader>
              <CardTitle>{translations.demandForecasts}</CardTitle>
              <CardDescription>
                {translations.aiPoweredPredictions}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-20">
                {translations.forecastsContent}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ReportStatCardProps {
  title: string;
  value: string;
  trend: string;
  trend_direction: "up" | "down";
  description: string;
}

function ReportStatCard({
  title,
  value,
  trend,
  trend_direction,
  description,
}: ReportStatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <Badge variant="outline" className="font-mono">
              {trend_direction === "up" ? (
                <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 mr-1 text-red-600 dark:text-red-400" />
              )}
              <span
                className={`${
                  trend_direction === "up"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend}
              </span>
            </Badge>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
