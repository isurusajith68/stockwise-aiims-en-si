import { useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageContext } from "@/lib/language-context";
import { FaShieldAlt } from "react-icons/fa";
import { SecurityTab } from "./components/SecurityTab";
import { AccountTab } from "./components/AccountTab";
import { useAuthStore } from "@/store/authStore";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import { CalendarClock, ChevronRight } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";

const storeInformationSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storePhone: z.string().min(1, "Store phone is required"),
  storeEmail: z.string().email("Invalid email address"),
  storeAddress: z.string().min(1, "Store address is required"),
});

const inventorySettingsSchema = z.object({
  autoStockAlerts: z.boolean(),
  autoReorder: z.boolean(),
  defaultThreshold: z.coerce
    .number()
    .min(1, "Threshold must be at least 1")
    .max(100, "Threshold must be at most 100"),
});

export function Settings() {
  const { translations } = useContext(LanguageContext);
  const { user: userData } = useAuthStore();

  const storeForm = useForm({
    resolver: zodResolver(storeInformationSchema),
    defaultValues: {
      storeName: "",
      storePhone: "",
      storeEmail: "",
      storeAddress: "",
    },
  });

  const inventoryForm = useForm({
    resolver: zodResolver(inventorySettingsSchema),
    defaultValues: {
      autoStockAlerts: true,
      autoReorder: false,
      defaultThreshold: 10,
    },
  });

  useEffect(() => {
    if (userData) {
      storeForm.reset({
        storeName: userData.storeInformation?.[0]?.storeName || "",
        storePhone: userData.storeInformation?.[0]?.storePhone || "",
        storeEmail: userData.storeInformation?.[0]?.storeEmail || "",
        storeAddress: userData.storeInformation?.[0]?.storeAddress || "",
      });
    }
  }, [userData, storeForm]);

  const onStoreSubmit = (data) => {
    console.log("Store information submitted:", data);
    toast.success(translations.storeInfoUpdated || "Store information updated");
  };

  const onInventorySubmit = (data) => {
    console.log("Inventory settings submitted:", data);
    toast.success(
      translations.inventorySettingsUpdated ||
        "Inventory settings updated successfully"
    );
  };

  const getTimeSince = (date) => {
    const now = new Date();
    const loginDate = new Date(date);
    const diffMs = now.getTime() - loginDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    }
  };

  const formatDate = (date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleString("en-US", options);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative p-6 rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              {translations.settings || "Settings"}
            </h1>
            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs font-medium bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
            >
              {translations.freeAccount || "Free Account"}
            </Badge>

            <div className="flex items-center space-x-2 group">
              <CalendarClock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />

              <div className="flex flex-col space-y-0.5">
                <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {translations.lastLogin || "Last Login"}
                </p>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-primary font-medium cursor-default hover:underline">
                        {getTimeSince(
                          userData?.lastLogin || new Date().toISOString()
                        )}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover/95 backdrop-blur-sm border-border/50 shadow-lg">
                      {userData?.lastLogin && (
                        <p className="text-xs font-medium text-primary">
                          {formatDate(userData.lastLogin)}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="general">
            {translations.general || "General"}
          </TabsTrigger>
          <TabsTrigger value="account">
            {translations.account || "Account"}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            {translations.notifications || "Notifications"}
          </TabsTrigger>
          <TabsTrigger value="billing">
            {translations.billing || "Billing"}
          </TabsTrigger>
          <TabsTrigger value="security">
            {translations.security || "Security"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {translations.storeInformation || "Store Information"}
              </CardTitle>
              <CardDescription>
                {translations.storeInfoDescription ||
                  "Manage your store details and contact information"}
              </CardDescription>
            </CardHeader>
            <Form {...storeForm}>
              <form onSubmit={storeForm.handleSubmit(onStoreSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={storeForm.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations.storeName || "Store Name"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your store name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={storeForm.control}
                      name="storePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations.storePhone || "Store Phone"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={storeForm.control}
                      name="storeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations.storeEmail || "Store Email"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={storeForm.control}
                      name="storeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations.storeAddress || "Store Address"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your store address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">
                    {translations.saveChanges || "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{translations.appearance || "Appearance"}</CardTitle>
              <CardDescription>
                {translations.appearanceDescription ||
                  "Customize how the application looks and feels"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="space-y-1">
                  <div className="font-medium">
                    {translations.theme || "Theme"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {translations.themeDescription ||
                      "Select your preferred color theme"}
                  </div>
                </div>
                <ThemeSwitcher />
              </div>

              <Separator />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="space-y-1">
                  <div className="font-medium">
                    {translations.language || "Language"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {translations.languageDescription ||
                      "Choose your preferred language"}
                  </div>
                </div>
                <LanguageSwitcher />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{translations.inventory || "Inventory"}</CardTitle>
              <CardDescription>
                {translations.inventorySettingsDescription ||
                  "Configure how your inventory is managed"}
              </CardDescription>
            </CardHeader>
            <Form {...inventoryForm}>
              <form onSubmit={inventoryForm.handleSubmit(onInventorySubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={inventoryForm.control}
                    name="autoStockAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {translations.autoStockAlerts ||
                              "Automatic Stock Alerts"}
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            {translations.autoStockAlertsDescription ||
                              "Receive alerts when stock levels are low"}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={inventoryForm.control}
                    name="autoReorder"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {translations.autoReorder || "Automatic Reordering"}
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            {translations.autoReorderDescription ||
                              "Automatically place orders when stock is low"}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={inventoryForm.control}
                    name="defaultThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {translations.defaultThreshold || "Default Threshold"}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="100" {...field} />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          {translations.defaultThresholdDescription ||
                            "Set the default stock level threshold for alerts"}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit">
                    {translations.saveChanges || "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <AccountTab />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>
                {translations.notifications || "Notifications"}
              </CardTitle>
              <CardDescription>
                {translations.notificationSettingsDescription ||
                  "Manage your notification preferences"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      {translations.emailNotifications || "Email Notifications"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {translations.emailNotificationsDescription ||
                        "Receive notifications via email"}
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      {translations.pushNotifications || "Push Notifications"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {translations.pushNotificationsDescription ||
                        "Receive notifications in the browser"}
                    </div>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      {translations.stockAlerts || "Stock Alerts"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {translations.stockAlertsDescription ||
                        "Get notified when stock levels are low"}
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      {translations.marketingEmails || "Marketing Emails"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {translations.marketingEmailsDescription ||
                        "Receive marketing and promotional emails"}
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>{translations.saveChanges || "Save Changes"}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>{translations.billing || "Billing"}</CardTitle>
              <CardDescription>
                {translations.billingDescription ||
                  "Manage your subscription and payment methods"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {translations.freeTier || "Free Tier"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {translations.currentPlan || "Current Plan"}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {translations.active || "Active"}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <FaShieldAlt className="h-4 w-4" />
                    </div>
                    <span>
                      {translations.upTo50Products || "Up to 50 products"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <FaShieldAlt className="h-4 w-4" />
                    </div>
                    <span>
                      {translations.basicReporting || "Basic reporting"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <FaShieldAlt className="h-4 w-4" />
                    </div>
                    <span>{translations.basicSupport || "Basic support"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {translations.starterPlan || "Starter Plan"}
                    </h3>
                    <p className="text-xl font-bold mt-2">
                      LKR 1,490
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </p>
                  </div>
                  <Button className="w-full">
                    {translations.upgrade || "Upgrade"}
                  </Button>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {translations.proPlan || "Pro Plan"}
                    </h3>
                    <p className="text-xl font-bold mt-2">
                      LKR 2,990
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </p>
                  </div>
                  <Button className="w-full">
                    {translations.upgrade || "Upgrade"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
