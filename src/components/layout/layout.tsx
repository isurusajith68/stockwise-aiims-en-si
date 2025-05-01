import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Package,
  Home,
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
  Truck,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import { LanguageContext } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { translations } = useContext(LanguageContext);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const navItems = [
    {
      id: "dashboard",
      label: translations.dashboard,
      icon: Home,
      path: "/dashboard",
    },
    {
      id: "products",
      label: translations.products,
      icon: Package,
      path: "/products",
    },
    {
      id: "suppliers",
      label: translations.suppliers,
      icon: Truck,
      path: "/suppliers",
    },
    {
      id: "orders",
      label: translations.orders,
      icon: ShoppingCart,
      path: "/orders",
    },
    {
      id: "sales",
      label: translations.sales,
      icon: BarChart3,
      path: "/sales",
    },
    {
      id: "reports",
      label: translations.reports,
      icon: BarChart3,
      path: "/reports",
    },
    {
      id: "settings",
      label: translations.settings,
      icon: SettingsIcon,
      path: "/settings",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar for desktop */}
      <div
        className={cn(
          "hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          {!sidebarCollapsed && (
            <h1 className="text-2xl font-bold tracking-tight text-primary animate-fade-in">
              StockWise
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </Button>
        </div>

        <Separator />

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "w-full flex items-center justify-start rounded-md transition-colors",
                      sidebarCollapsed ? "px-2" : "px-4",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                      "h-10"
                    )
                  }
                  onClick={() => setMobileSidebarOpen(false)}
                  end={item.path === "/dashboard"}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      sidebarCollapsed ? "mr-0" : "mr-2"
                    )}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex justify-center">
            {!sidebarCollapsed && <LanguageSwitcher />}
            <ThemeSwitcher className="ml-2" />
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[240px] bg-card border-r border-border transition-all duration-300 ease-in-out transform md:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            StockWise
          </h1>
        </div>

        <Separator />

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "w-full flex items-center justify-start rounded-md transition-colors px-4",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                      "h-10"
                    )
                  }
                  onClick={() => setMobileSidebarOpen(false)}
                  end={item.path === "/dashboard"}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex justify-center">
            <LanguageSwitcher />
            <ThemeSwitcher className="ml-2" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4 md:px-6">{children}</div>
      </main>
    </div>
  );
}
