import { useState, useContext } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageContext } from "@/lib/language-context";
import { FaUser, FaTrash, FaDownload } from "react-icons/fa";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  AlertCircle,
  Save,
} from "lucide-react";

export function AccountTab() {
  const { translations } = useContext(LanguageContext);
  const [userData, setUserData] = useState({
    username: "john_doe",
    email: "john.doe@example.com",
    fullName: "John Doe",
    phone: "+94 77 123 4567",
    companyName: "My Grocery Store",
    joinDate: "January 15, 2023",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast.error(
        translations.invalidEmail || "Please enter a valid email address"
      );
      return;
    }

    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
    if (!phoneRegex.test(userData.phone)) {
      toast.error(
        translations.invalidPhone || "Please enter a valid phone number"
      );
      return;
    }

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: translations.updatingProfile || "Updating profile...",
      success: translations.profileUpdated || "Profile updated successfully!",
      error: translations.profileUpdateError || "Failed to update profile",
    });

    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
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

  return (
    <div className="space-y-6">
      {/* Profile Section */}
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
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={userData.fullName} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {getInitials(userData.fullName)}
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
                  />
                  <span className="text-sm text-primary hover:underline">
                    {translations.changePhoto || "Change photo"}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-semibold">{userData.fullName}</h3>
              <p className="text-muted-foreground">@{userData.username}</p>
              <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                <Badge variant="outline">
                  {translations.storeOwner || "Store Owner"}
                </Badge>
                <Badge variant="outline">
                  {translations.freeAccount || "Free Account"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {translations.fullName || "Full Name"}
              </label>
              <Input
                name="fullName"
                value={userData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {translations.username || "Username"}
              </label>
              <Input
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {translations.email || "Email Address"}
              </label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {translations.phoneNumber || "Phone Number"}
              </label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {translations.companyName || "Company Name"}
              </label>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <Input
                  name="companyName"
                  value={userData.companyName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {translations.joinDate || "Join Date"}
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input value={userData.joinDate} disabled />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
          {isEditing ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={handleProfileUpdate} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {translations.saveChanges || "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                {translations.cancel || "Cancel"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              {translations.editProfile || "Edit Profile"}
            </Button>
          )}
        </CardFooter>
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
