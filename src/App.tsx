import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Dashboard } from "@/pages/dashboard/dashboard";
import { Products } from "@/pages/products/products";
import { Suppliers } from "@/pages/suppliers/suppliers";
import { Orders } from "@/pages/orders/orders";
import { Reports } from "@/pages/reports/reports";
import { Settings } from "@/pages/settings/settings";
import { Layout } from "@/components/layout/layout";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Language, translations } from "@/lib/translations";
import { LanguageContext } from "@/lib/language-context";

function App() {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useLocalStorage<Language>(
    "stockwise-language",
    "en"
  );

  useEffect(() => {
    // Simulate loading time for demonstration purposes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "si" : "en");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <LanguageContext.Provider
      value={{ language, translations: translations[language], toggleLanguage }}
    >
      <ThemeProvider defaultTheme="light" storageKey="stockwise-theme">
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </LanguageContext.Provider>
  );
}

export default App;
