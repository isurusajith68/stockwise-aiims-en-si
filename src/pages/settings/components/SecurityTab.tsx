import { useState, useEffect, useContext } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LanguageContext } from "@/lib/language-context";
import {
  setup2FA,
  disable2FA,
  verify2FA,
  check2FAStatus,
} from "@/services/auth/twoFactorAuthService";

export function SecurityTab() {
  const { translations } = useContext(LanguageContext);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTwoFactorStatus();
  }, []);

  const fetchTwoFactorStatus = async () => {
    try {
      const response = await check2FAStatus();
      setIs2FAEnabled(response.isEnabled);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch 2FA status:", error);
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    if (is2FAEnabled) {
      setShowDisableDialog(true);
    } else {
      try {
        setIsLoading(true);
        const response = await setup2FA();
        setQrCode(response.qrCode);
        setShowVerifyDialog(true);
      } catch (error) {
        toast.error(translations.twoFactorEnableError);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.security}</CardTitle>
        <CardDescription>{translations.securityDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{translations.twoFactorAuth}</div>
            <div className="text-sm text-muted-foreground">
              {translations.twoFactorAuthDescription}
            </div>
          </div>
          <Switch
            checked={is2FAEnabled}
            onCheckedChange={handleToggle2FA}
            disabled={isLoading}
          />
        </div>

        {is2FAEnabled && (
          <div className="flex flex-col items-start space-y-2">
            <Alert className="flex items-center w-full max-w-md space-x-2">
              <AlertDescription className="flex items-center gap-3">
                <FaShieldAlt className="h-4 w-4 text-primary" />
                {translations.twoFactorEnabled}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="font-medium">{translations.passwordSecurity}</div>
          <div className="text-sm text-muted-foreground">
            {translations.passwordSecurityDescription ||
              "Keep your account secure by updating your password regularly."}
          </div>
          <Button variant="outline">
            {translations.changePassword || "Change Password"}
          </Button>
        </div>

        {/* Verification Dialog */}
        <VerifyTwoFactorDialog
          open={showVerifyDialog}
          onClose={() => setShowVerifyDialog(false)}
          qrCode={qrCode}
          onSuccess={(codes) => {
            setIs2FAEnabled(true);
            setBackupCodes(codes);
            setShowBackupCodes(true);
            setShowVerifyDialog(false);
          }}
          translations={translations}
        />

        {/* Disable 2FA Dialog */}
        <DisableTwoFactorDialog
          open={showDisableDialog}
          onClose={() => setShowDisableDialog(false)}
          onDisabled={() => {
            setIs2FAEnabled(false);
            setShowDisableDialog(false);
            toast.success(translations.twoFactorDisabled);
          }}
          translations={translations}
        />

        {/* Backup Codes Dialog */}
        <BackupCodesDialog
          open={showBackupCodes}
          onClose={() => setShowBackupCodes(false)}
          backupCodes={backupCodes}
          translations={translations}
        />
      </CardContent>
    </Card>
  );
}

function VerifyTwoFactorDialog({
  open,
  onClose,
  qrCode,
  onSuccess,
  translations,
}: {
  open: boolean;
  onClose: () => void;
  qrCode: string | null;
  onSuccess: (codes: string[]) => void;
  translations: Record<string, string>;
}) {
  const [token, setToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      toast.error(
        translations.enterVerificationCode || "Please enter verification code"
      );
      return;
    }

    setIsVerifying(true);
    try {
      const response = await verify2FA(token);
      toast.success(
        translations.twoFactorVerified ||
          "Two-factor authentication verified successfully!"
      );
      onSuccess(response.backupCodes);
    } catch (error) {
      toast.error(
        translations.invalidVerificationCode ||
          "Invalid verification code. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {translations.setupTwoFactor || "Set up Two-Factor Authentication"}
          </DialogTitle>
          <DialogDescription>
            {translations.scanQRCodeInstructions ||
              "Scan this QR code with your authenticator app and enter the verification code."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {qrCode && (
            <div className="bg-white p-2 rounded">
              <img src={qrCode} alt="QR Code for 2FA" className="w-48 h-48" />
            </div>
          )}
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={translations.enterCode || "Enter verification code"}
            className="text-center"
            maxLength={6}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {translations.cancel || "Cancel"}
          </Button>
          <Button onClick={handleVerify} disabled={isVerifying}>
            {isVerifying
              ? translations.verifying || "Verifying..."
              : translations.verify || "Verify"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DisableTwoFactorDialog({
  open,
  onClose,
  onDisabled,
  translations,
}: {
  open: boolean;
  onClose: () => void;
  onDisabled: () => void;
  translations: Record<string, string>;
}) {
  const [password, setPassword] = useState("");
  const [isDisabling, setIsDisabling] = useState(false);

  const handleDisable = async () => {
    if (!password) {
      toast.error(translations.enterPassword || "Please enter your password");
      return;
    }

    setIsDisabling(true);
    try {
      await disable2FA(password);
      onDisabled();
    } catch (error) {
      toast.error(
        translations.incorrectPassword ||
          "Incorrect password. Please try again."
      );
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {translations.disableTwoFactor ||
              "Disable Two-Factor Authentication"}
          </DialogTitle>
          <DialogDescription>
            {translations.disableTwoFactorWarning ||
              "This will reduce the security of your account. Please enter your password to confirm."}
          </DialogDescription>
        </DialogHeader>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={translations.password || "Password"}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {translations.cancel || "Cancel"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDisable}
            disabled={isDisabling}
          >
            {isDisabling
              ? translations.disabling || "Disabling..."
              : translations.disable || "Disable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BackupCodesDialog({
  open,
  onClose,
  backupCodes,
  translations,
}: {
  open: boolean;
  onClose: () => void;
  backupCodes: string[];
  translations: Record<string, string>;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {translations.backupCodes || "Backup Codes"}
          </DialogTitle>
          <DialogDescription>
            {translations.backupCodesDescription ||
              "Store these backup codes in a safe place. Each code can only be used once."}
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted p-4 rounded grid grid-cols-2 gap-2">
          {backupCodes.map((code, index) => (
            <div
              key={index}
              className="font-mono text-center border p-1 rounded"
            >
              {code}
            </div>
          ))}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              const codesText = backupCodes.join("\n");
              navigator.clipboard.writeText(codesText);
              toast.success(
                translations.copiedToClipboard ||
                  "Backup codes copied to clipboard"
              );
            }}
          >
            {translations.copyToClipboard || "Copy to Clipboard"}
          </Button>
          <Button className="w-full sm:w-auto" onClick={onClose}>
            {translations.iHaveSavedTheseCodes || "I've Saved These Codes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
