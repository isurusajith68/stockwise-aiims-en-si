import { useContext } from "react";
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

export function Settings() {
  const { translations } = useContext(LanguageContext);
  const { user: userData } = useAuthStore();
  const getTimeSince = (date: Date | string): string => {
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

  const formatDate = (date: Date | string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleString("en-US", options);
  };

  console.log(userData);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative p-6 rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              {translations.settings}
            </h1>
            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs font-medium bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
            >
              {translations.freeAccount}
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
          <TabsTrigger value="general">{translations.general}</TabsTrigger>
          <TabsTrigger value="account">{translations.account}</TabsTrigger>
          <TabsTrigger value="notifications">
            {translations.notifications}
          </TabsTrigger>
          <TabsTrigger value="billing">{translations.billing}</TabsTrigger>
          <TabsTrigger value="security">{translations.security}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{translations.storeInformation}</CardTitle>
              <CardDescription>
                {translations.storeInfoDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {translations.storeName}
                  </label>
                  <Input defaultValue="My Grocery Store" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {translations.storePhone}
                  </label>
                  <Input defaultValue="+94 77 123 4567" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {translations.storeEmail}
                  </label>
                  <Input defaultValue="contact@mystore.lk" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {translations.storeAddress}
                  </label>
                  <Input defaultValue="123 Main Street, Colombo 05" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>{translations.saveChanges}</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{translations.appearance}</CardTitle>
              <CardDescription>
                {translations.appearanceDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="space-y-1">
                  <div className="font-medium">{translations.theme}</div>
                  <div className="text-sm text-muted-foreground">
                    {translations.themeDescription}
                  </div>
                </div>
                <ThemeSwitcher />
              </div>

              <Separator />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="space-y-1">
                  <div className="font-medium">{translations.language}</div>
                  <div className="text-sm text-muted-foreground">
                    {translations.languageDescription}
                  </div>
                </div>
                <LanguageSwitcher />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{translations.inventory}</CardTitle>
              <CardDescription>
                {translations.inventorySettingsDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">
                    {translations.autoStockAlerts}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {translations.autoStockAlertsDescription}
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">{translations.autoReorder}</div>
                  <div className="text-sm text-muted-foreground">
                    {translations.autoReorderDescription}
                  </div>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {translations.defaultThreshold}
                </label>
                <Input type="number" defaultValue="10" min="1" />
                <p className="text-sm text-muted-foreground">
                  {translations.defaultThresholdDescription}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>{translations.saveChanges}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          {/* <Card>
            <CardHeader>
              <CardTitle>{translations.account}</CardTitle>
              <CardDescription>
                {translations.accountSettingsDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-20">
                {translations.accountSettingsContent}
              </p>
            </CardContent>
          </Card> */}
          <AccountTab />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{translations.notifications}</CardTitle>
              <CardDescription>
                {translations.notificationSettingsDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-20">
                {translations.notificationSettingsContent}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>{translations.billing}</CardTitle>
              <CardDescription>
                {translations.billingDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {translations.freeTier}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {translations.currentPlan}
                    </p>
                  </div>
                  <Badge variant="secondary">{translations.active}</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <FaShieldAlt className="h-4 w-4" />
                    </div>
                    <span>{translations.upTo50Products}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <FaShieldAlt className="h-4 w-4" />
                    </div>
                    <span>{translations.basicReporting}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <FaShieldAlt className="h-4 w-4" />
                    </div>
                    <span>{translations.basicSupport}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {translations.starterPlan}
                    </h3>
                    <p className="text-xl font-bold mt-2">
                      LKR 1,490
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </p>
                  </div>
                  <Button className="w-full">{translations.upgrade}</Button>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {translations.proPlan}
                    </h3>
                    <p className="text-xl font-bold mt-2">
                      LKR 2,990
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </p>
                  </div>
                  <Button className="w-full">{translations.upgrade}</Button>
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
