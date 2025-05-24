import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { Dashboard } from "@/pages/dashboard/dashboard";
import { Products } from "@/pages/products/products";
import { Suppliers } from "@/pages/suppliers/suppliers";
import { Orders } from "@/pages/orders/orders";
import { Reports } from "@/pages/reports/reports";
import { Settings } from "@/pages/settings/settings";
import { Layout } from "@/components/layout/layout";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Language, translations } from "@/lib/translations";
import { LanguageContext } from "@/lib/language-context";
import SalesPage from "@/pages/sales/sales";
import ExpensesPage from "@/pages/expenses/expenses";
import AIInsights from "./pages/AIInsights/AIInsights";
import AddSalePage from "@/pages/sales/add-sale";
import CustomerManagementPage from "@/pages/coustomer/page";
import Web from "./pages/web/page";
import AuthPages from "./pages/auth/Login";
import {
  ProtectedRoute,
  ProtectedRouteWithRedirect,
} from "./components/auth/ProtectedRoute";
import SupplyChainPage from "./pages/sales/supply-chain";

function App() {
  const [language, setLanguage] = useLocalStorage<Language>(
    "stockwise-language",
    "en"
  );

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "si" : "en");
  };

  return (
    <LanguageContext.Provider
      value={{ language, translations: translations[language], toggleLanguage }}
    >
      <ThemeProvider defaultTheme="light" storageKey="stockwise-theme">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRouteWithRedirect>
                  <Web />
                </ProtectedRouteWithRedirect>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRouteWithRedirect>
                  <AuthPages />
                </ProtectedRouteWithRedirect>
              }
            />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/sales/supply-chain" element={<SupplyChainPage />} />
              <Route path="/sales/add" element={<AddSalePage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route
                path="/ai-insights"
                element={
                  <AIInsights
                    products={[]}
                    sales={[]}
                    expenses={[]}
                    language={language}
                    theme="light"
                  />
                }
              />
              <Route path="/customers" element={<CustomerManagementPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </LanguageContext.Provider>
  );
}

export default App;
