import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Box } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LanguageContext } from "@/lib/language-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useLogin } from "@/hooks/auth/useAuth";
import toast from "react-hot-toast";

export default function AuthPages() {
  const [activeTab, setActiveTab] = useState("login");
  const { translations } = useContext(LanguageContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 dark:bg-gradient-to-b dark:from-black dark:to-gray-900 dark:text-white p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Box className="h-10 w-10 " />
        <h1 className="text-3xl font-bold ">StockWise AIIMS</h1>
      </div>

      <button className="absolute top-4 left-4 px-2 py-1 rounded ">
        <ThemeSwitcher className="ml-2" />
      </button>

      <Card className="w-full max-w-md shadow-xl p-2 bg-white dark:bg-neutral-900 dark:border-neutral-800">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">{translations.auth.login}</TabsTrigger>
            <TabsTrigger value="signup">{translations.auth.signup}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </Card>

      <p className="text-gray-500 dark:text-white text-sm mt-8">
        &copy; {new Date().getFullYear()} StockWise AIIMS.{" "}
        {translations.footer.allRightsReserved}
      </p>
    </div>
  );
}

function LoginForm() {
  const { translations: t } = useContext(LanguageContext);
  const [identifier, setIdentifier] = useState(""); // Identifier for email or username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginMutation.mutateAsync({ identifier, password }); // Use identifier instead of email
      toast.success("Login successful!");
      // navigate(0); // Refresh the page after successful login
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>{t.auth.welcomeBack}</CardTitle>
        <CardDescription>{t.auth.loginSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">{t.auth.emailOrUsername}</Label>
            <Input
              id="identifier"
              type="text"
              placeholder={t.auth.emailOrUsernamePlaceholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Button variant="link" className="p-0 h-auto" type="button">
                {t.auth.forgotPassword}
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t.auth.loggingIn : t.auth.login}
          </Button>
        </form>
      </CardContent>
    </>
  );
}

const signupSchema = z
  .object({
    name: z.string().min(2, "Full name is required"),
    company: z.string().min(2, "Company name is required"),
    email: z.string().email("Invalid email address"),
    mobile: z
      .string()
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number must be at most 15 digits")
      .regex(/^\d+$/, "Mobile number must be numeric"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { translations: t } = useContext(LanguageContext);

  // 2. Setup RHF with Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // 3. Handle form submit
  const onSubmit = async (data: SignupFormData) => {
    // TODO: Implement signup logic
    console.log("Signup data:", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
      {/* 2-column grid for name and company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t.auth.fullName}</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder={t.auth.namePlaceholder}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            {...register("company")}
            placeholder="Enter your company name"
          />
          {errors.company && (
            <p className="text-red-500 text-xs">{errors.company.message}</p>
          )}
        </div>
      </div>
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="signup-email">{t.auth.email}</Label>
        <Input
          id="signup-email"
          type="email"
          {...register("email")}
          placeholder={t.auth.emailPlaceholder}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>
      {/* Mobile */}
      <div className="space-y-2">
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          {...register("mobile")}
          placeholder="Enter your mobile number"
        />
        {errors.mobile && (
          <p className="text-red-500 text-xs">{errors.mobile.message}</p>
        )}
      </div>
      {/* Password and Confirm Password in 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-password">{t.auth.password}</Label>
          <Input
            id="signup-password"
            type="password"
            {...register("password")}
            placeholder={t.auth.passwordPlaceholder}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">{t.auth.confirmPassword}</Label>
          <Input
            id="confirm-password"
            type="password"
            {...register("confirmPassword")}
            placeholder={t.auth.confirmPasswordPlaceholder}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t.auth.creatingAccount : t.auth.signup}
      </Button>
    </form>
  );
}
