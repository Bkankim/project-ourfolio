"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { GoogleIcon } from "@/components/google-icon";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { t } = useI18n();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  // Consent checkboxes (signup only)
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [crossBorderConsent, setCrossBorderConsent] = useState(false);

  const consentComplete = privacyConsent && crossBorderConsent;

  const handleAuth = async (
    e: React.FormEvent<HTMLFormElement>,
    action: () => Promise<{ error: Error | null }>,
  ) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await action();
    if (error) {
      setLoading(false);
      toast.error(error.message);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleGoogle = async () => {
    if (activeTab === "signup" && !consentComplete) {
      toast.error(t("consentIncomplete"));
      return;
    }
    setLoading(true);
    const { error } = await signInWithGoogle(activeTab === "signup" ? true : undefined);
    if (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/40 bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t("authTitle")}
          </CardTitle>
          <CardDescription>{t("authDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full mb-6 rounded-lg gap-2"
            onClick={handleGoogle}
            disabled={loading || (activeTab === "signup" && !consentComplete)}
          >
            <GoogleIcon />
            {t("continueWithGoogle")}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t("login")}</TabsTrigger>
              <TabsTrigger value="signup">{t("signup")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={(e) => handleAuth(e, () => signIn(email, password))} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  className="w-full rounded-lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("loginBtn")
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form
                onSubmit={(e) =>
                  handleAuth(e, () =>
                    signUp(email, password, fullName, true),
                  )
                }
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">{t("fullName")}</Label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t("email")}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t("password")}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Consent checkboxes */}
                <div className="space-y-3 rounded-lg border border-border/40 p-4">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="privacy-consent"
                      checked={privacyConsent}
                      onCheckedChange={(v) => setPrivacyConsent(v === true)}
                    />
                    <label htmlFor="privacy-consent" className="text-sm leading-tight">
                      <span className="text-destructive font-medium">{t("consentRequired")}</span>{" "}
                      <Link href="/privacy" target="_blank" className="underline underline-offset-2">
                        {t("footerPrivacy")}
                      </Link>
                      {" "}
                      {t("consentPrivacy")}
                    </label>
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="cross-border-consent"
                      checked={crossBorderConsent}
                      onCheckedChange={(v) => setCrossBorderConsent(v === true)}
                    />
                    <label htmlFor="cross-border-consent" className="text-sm leading-tight">
                      <span className="text-destructive font-medium">{t("consentRequired")}</span>{" "}
                      <Link href="/privacy#international-transfer" target="_blank" className="underline underline-offset-2">
                        {t("consentCrossBorder")}
                      </Link>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <Link href="/terms" target="_blank" className="underline underline-offset-2">
                      {t("footerTerms")}
                    </Link>
                  </p>
                </div>

                <Button
                  className="w-full rounded-lg"
                  type="submit"
                  disabled={loading || !consentComplete}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("signupBtn")
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
