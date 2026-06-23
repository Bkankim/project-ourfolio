"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getClientT, type Locale } from "@/lib/i18n-translations";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, CheckCircle } from "lucide-react";
import type { TemplateStyle } from "@/components/portfolio/template-styles";
import { INQUIRY_TYPES } from "@/types/portfolio";

interface PortfolioContactProps {
  profileId: string;
  username: string;
  style: TemplateStyle;
  locale: Locale;
}

export function PortfolioContact({
  profileId,
  username,
  style,
  locale,
}: PortfolioContactProps) {
  const t = getClientT(locale);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const res = await fetch(`/api/portfolio/${username}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderName: name,
        senderEmail: email,
        message,
        inquiryType: inquiryType || undefined,
        privacyConsent,
      }),
    });

    if (res.ok) {
      trackEvent(profileId, "contact_submit");
      toast.success(t("messageSent"));
      setSent(true);
    } else {
      toast.error("Failed to send message");
    }
    setSending(false);
  };

  if (sent) {
    return (
      <section id="contact" className="text-center py-12 space-y-4">
        <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
        <h2 className="text-2xl font-bold">{t("messageSent")}</h2>
        <p className={style.muted}>{t("messageSuccess")}</p>
      </section>
    );
  }

  return (
    <section id="contact" className="space-y-6">
      <h2 className="text-2xl font-bold">{t("contactMe")}</h2>

      <form onSubmit={handleSubmit} className={`rounded-xl p-6 space-y-4 ${style.card}`}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t("yourName")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t("yourEmail")}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("selectInquiryType")}</Label>
          <Select value={inquiryType} onValueChange={(v) => setInquiryType(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectInquiryType")} />
            </SelectTrigger>
            <SelectContent>
              {INQUIRY_TYPES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("projectDescriptionField")}</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="contact-privacy-consent"
            checked={privacyConsent}
            onCheckedChange={(v) => setPrivacyConsent(v === true)}
          />
          <label htmlFor="contact-privacy-consent" className="text-sm leading-tight">
            <span className="text-destructive font-medium">{t("consentRequired")}</span>{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              {t("consentPrivacy")}
            </a>
          </label>
        </div>

        <Button
          type="submit"
          className="rounded-xl gap-2"
          style={{ backgroundColor: "var(--portfolio-primary)" }}
          disabled={sending || !privacyConsent}
        >
          <Send className="h-4 w-4" />
          {sending ? "..." : t("sendMessage")}
        </Button>
      </form>
    </section>
  );
}
