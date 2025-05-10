import { useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
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

export function Settings() {
  const { translations } = useContext(LanguageContext);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {translations.settings}
        </h1>
        <div className="mt-4 sm:mt-0">
          <Badge variant="outline">{translations.freeAccount}</Badge>
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
