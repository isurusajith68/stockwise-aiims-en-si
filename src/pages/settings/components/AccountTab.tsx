import { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageContext } from "@/lib/language-context";
import { FaUser, FaTrash, FaDownload } from "react-icons/fa";
import { Mail, Phone, Calendar, AlertCircle, Save, User2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateProfile } from "@/hooks/auth/useAuth";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .regex(/^[a-zA-Z0-9_ ]+$/, {
      message:
        "Username can only contain letters, numbers, underscores, and spaces.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function AccountTab() {
  const { translations } = useContext(LanguageContext);
  const { user } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const updateProfileMutation = useUpdateProfile();

  console.log("User data:", user);
  const userData = {
    username: user?.username || "johndoe",
    email: user?.email || "john.doe@example.com",
    phone: user?.phone || "+1 (555) 123-4567",
    joinDate: user?.createdAt || "January 15, 2023",
    role: user?.role || "user",
    lastLogin: user?.lastLogin || "2023-10-01T12:00:00Z",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: userData.username,
      email: userData.email,
      phone: userData.phone || "",
    },
    mode: "onChange",
  });

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    try {
      updateProfileMutation.mutate(
        {
          username: values.username,
          email: values.email,
          phone: values.phone,
        },
        {
          onSuccess: () => {
            toast.success(
              translations.profileUpdated || "Profile updated successfully"
            );
            setIsEditing(false);
          },
          onError: () => {
            toast.error(translations.updateError || "Failed to update profile");
          },
        }
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(translations.updateError || "Failed to update profile");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));

      toast.success(translations.imageUploaded || "Profile image uploaded");
    }
  };

  const handleExportData = () => {
    toast.success(
      translations.dataExported || "Account data exported successfully"
    );
  };

  const handleDeleteAccount = () => {
    toast.error(
      translations.accountDeletedWarning ||
        "Account deletion initiated. Please check your email to confirm."
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {translations.profileInformation || "Profile Information"}
          </CardTitle>
          <CardDescription>
            {translations.profileDescription ||
              "Update your account details and profile information"}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleProfileUpdate)}>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {profileImage ? (
                      <AvatarImage src={profileImage} alt={userData.username} />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {getInitials(userData.username)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="mt-2 flex justify-center">
                    <label htmlFor="profile-image" className="cursor-pointer">
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={!isEditing}
                      />
                      {/* <span className="text-sm text-primary hover:underline">
                        {translations.changePhoto || "Change photo"}
                      </span> */}
                    </label>
                  </div>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold">{userData.username}</h3>
                  <p className="text-muted-foreground">@{userData.username}</p>

                  <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                    <Badge variant="outline">
                      {userData.role === "admin"
                        ? translations.admin || "Admin"
                        : translations.user || "User"}
                    </Badge>
                    <Badge variant="outline">
                      {translations.freeAccount || "Free Account"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {translations.username || "Username"}
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <User2 className="h-4 w-4 text-muted-foreground" />
                          <Input {...field} disabled={!isEditing} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {translations.email || "Email Address"}
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input {...field} disabled={!isEditing} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {translations.phoneNumber || "Phone Number"}
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Input {...field} disabled={!isEditing} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>{translations.joinDate || "Join Date"}</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formatDate(userData.joinDate)}
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
              {isEditing ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {translations.saveChanges || "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }}
                    className="flex-1"
                  >
                    {translations.cancel || "Cancel"}
                  </Button>
                </div>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  {translations.editProfile || "Edit Profile"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaUser className="h-5 w-5 text-primary" />
            {translations.accountManagement || "Account Management"}
          </CardTitle>
          <CardDescription>
            {translations.accountManagementDescription ||
              "Manage your account data and preferences"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {translations.dataPrivacy || "Data Privacy Information"}
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    {translations.dataPrivacyInfo ||
                      "Your data is kept private and secure. You can export or delete your account data at any time."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">
                {translations.exportData || "Export Your Data"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {translations.exportDataDescription ||
                  "Download a copy of all your account data"}
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <FaDownload className="mr-2 h-4 w-4" />
              {translations.exportData || "Export Data"}
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-destructive">
                {translations.deleteAccount || "Delete Account"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {translations.deleteAccountWarning ||
                  "Permanently delete your account and all associated data"}
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <FaTrash className="mr-2 h-4 w-4" />
              {translations.deleteAccount || "Delete Account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
