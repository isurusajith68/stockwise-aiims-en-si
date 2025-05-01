import { useState, useMemo, useContext } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  MoreHorizontal,
  Download,
  FileUp,
  Trash,
  Edit,
  Filter,
  Search,
} from "lucide-react";
import _ from "lodash";
import { LanguageContext } from "@/lib/language-context";

const categories = [
  "Rent",
  "Utilities",
  "Salaries",
  "Supplies",
  "Food",
  "Transportation",
  "Entertainment",
  "Medical",
  "Insurance",
  "Other",
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#8DD1E1",
  "#A4DE6C",
  "#D0ED57",
];

const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be positive"),
  description: z.string().optional(),
  paymentMethod: z.string().optional(),
  receipt: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type Expense = z.infer<typeof expenseSchema> & { id: number };

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function ExpensesPage() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { translations } = useContext(LanguageContext);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      category: "Other",
      amount: 0,
      description: "",
      paymentMethod: "Cash",
      receipt: "",
      tags: [],
    },
  });

  const onSubmit = (data: ExpenseFormValues) => {
    if (editingId) {
      setExpenses(
        expenses.map((e) => (e.id === editingId ? { ...data, id: e.id } : e))
      );
      setEditingId(null);
    } else {
      setExpenses([{ id: Date.now(), ...data }, ...expenses]);
    }
    form.reset();
    setShowForm(false);
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const editExpense = (expense: Expense) => {
    form.reset(expense);
    setEditingId(expense.id);
    setShowForm(true);
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Date,Category,Amount,Description,Payment Method\n" +
      expenses
        .map(
          (e) =>
            `${e.id},${e.date},${e.category},${e.amount},${
              e.description || ""
            },${e.paymentMethod || ""}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `expenses-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter({ start: "", end: "" });
    setCategoryFilter([]);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Date range filter
      const expenseDate = new Date(expense.date);
      const matchesDateRange =
        (dateFilter.start === "" ||
          new Date(dateFilter.start) <= expenseDate) &&
        (dateFilter.end === "" || new Date(dateFilter.end) >= expenseDate);

      // Category filter
      const matchesCategory =
        categoryFilter.length === 0 ||
        categoryFilter.includes(expense.category);

      return matchesSearch && matchesDateRange && matchesCategory;
    });
  }, [expenses, searchTerm, dateFilter, categoryFilter]);

  // Chart data preparation
  const categoryData = useMemo(() => {
    const groupedData = _.groupBy(filteredExpenses, "category");
    return Object.keys(groupedData).map((category) => ({
      name: category,
      value: _.sumBy(groupedData[category], "amount"),
    }));
  }, [filteredExpenses]);

  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString("default", { month: "short" }),
        year: date.getFullYear(),
        date: date,
      };
    }).reverse();

    return last6Months.map((monthObj) => {
      const monthExpenses = filteredExpenses.filter((expense) => {
        const expDate = new Date(expense.date);
        return (
          expDate.getMonth() === monthObj.date.getMonth() &&
          expDate.getFullYear() === monthObj.date.getFullYear()
        );
      });

      const totalAmount = _.sumBy(monthExpenses, "amount");

      return {
        name: `${monthObj.month} ${monthObj.year}`,
        amount: totalAmount || 0,
      };
    });
  }, [filteredExpenses]);

  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [filteredExpenses]
  );

  const mostExpensiveCategory = useMemo(() => {
    if (categoryData.length === 0) return null;
    return _.maxBy(categoryData, "value");
  }, [categoryData]);

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{translations.expenseTracker}</h1>
          {/* <p className="text-muted-foreground">
            {translations.trackAndAnalyzeExpenses}
          </p> */}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              form.reset({
                date: new Date().toISOString().slice(0, 10),
                category: "Other",
                amount: 0,
                description: "",
                paymentMethod: "Cash",
                receipt: "",
                tags: [],
              });
              setEditingId(null);
              setShowForm(true);
            }}
          >
            {translations.addExpense}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{translations.actions}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                {translations.exportToCSV}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileUp className="h-4 w-4 mr-2" />
                {translations.importExpenses}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {translations.totalExpenses}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredExpenses.length} {translations.expenseRecorded}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {translations.largestCategory}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostExpensiveCategory?.name || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {mostExpensiveCategory
                ? `₹${mostExpensiveCategory.value.toFixed(2)}`
                : translations.noExpenseData}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {translations.thisMonth}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(monthlyData[monthlyData.length - 1]?.amount || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full  mt-4"
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="list">{translations.expenseList}</TabsTrigger>
            <TabsTrigger value="analytics">
              {translations.analytics}
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder={translations.searchExpenses}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isFilterOpen && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{translations.filterExpenses}</CardTitle>
              <CardDescription>
                {translations.refineExpenseList}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {translations.dateRange}
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="date"
                      value={dateFilter.start}
                      onChange={(e) =>
                        setDateFilter({ ...dateFilter, start: e.target.value })
                      }
                      placeholder={translations.startDate || "Start Date"}
                    />
                    <span>to</span>
                    <Input
                      type="date"
                      value={dateFilter.end}
                      onChange={(e) =>
                        setDateFilter({ ...dateFilter, end: e.target.value })
                      }
                      placeholder={translations.endDate || "End Date"}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {translations.categories}
                  </label>
                  <Select
                    onValueChange={(value) => {
                      if (!categoryFilter.includes(value)) {
                        setCategoryFilter([...categoryFilter, value]);
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue
                        placeholder={translations.selectCategories}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {categoryFilter.map((cat) => (
                      <div
                        key={cat}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1"
                      >
                        {cat}
                        <button
                          onClick={() =>
                            setCategoryFilter(
                              categoryFilter.filter((c) => c !== cat)
                            )
                          }
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={clearFilters}>
                {translations.clearFilters}
              </Button>
            </CardFooter>
          </Card>
        )}

        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>{translations.expenseList}</CardTitle>
              <CardDescription>
                {filteredExpenses.length} {translations.expensesFound}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {translations.noExpensesFound}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">
                          {translations.orderDate || "Date"}
                        </th>
                        <th className="text-left p-3">
                          {translations.category}
                        </th>
                        <th className="text-right p-3">
                          {translations.amount}
                        </th>
                        <th className="text-left p-3">
                          {translations.description}
                        </th>
                        <th className="text-left p-3">
                          {translations.payment}
                        </th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((expense) => (
                        <tr
                          key={expense.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3">
                            {new Date(expense.date).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                              {expense.category}
                            </span>
                          </td>
                          <td className="p-3 text-right font-medium">
                            ₹{expense.amount.toFixed(2)}
                          </td>
                          <td className="p-3">{expense.description || "-"}</td>
                          <td className="p-3">
                            {expense.paymentMethod || "-"}
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editExpense(expense)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteExpense(expense.id)}
                                className="hover:text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{translations.monthlyExpenses}</CardTitle>
                <CardDescription>{translations.expenseTrends}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name={translations.totalExpenses}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{translations.expenseDistribution}</CardTitle>
                <CardDescription>
                  {translations.breakdownByCategory}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
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
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{translations.categorySummary}</CardTitle>
                <CardDescription>
                  {translations.totalByCategory}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      {translations.noExpenseData}
                    </div>
                  ) : (
                    categoryData
                      .sort((a, b) => b.value - a.value)
                      .map((item, idx) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{
                                backgroundColor: COLORS[idx % COLORS.length],
                              }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <div className="font-medium">
                            ₹{item.value.toFixed(2)}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Expense Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? translations.editExpense : translations.addExpense}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? translations.updateExpenseDetails
                : translations.enterExpenseDetails}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.orderDate || "Date"}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.category}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.amount}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={0.01}
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.paymentMethod}</FormLabel>
                      <Select
                        value={field.value || "Cash"}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">
                            {translations.cash}
                          </SelectItem>
                          <SelectItem value="Credit Card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="Debit Card">Debit Card</SelectItem>
                          <SelectItem value="Bank Transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Other">
                            {translations.other || "Other"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.description}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  {translations.cancel}
                </Button>
                <Button type="submit">
                  {editingId
                    ? translations.updateExpense
                    : translations.saveExpense}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
