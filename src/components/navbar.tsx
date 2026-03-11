"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_LINKS = [
  { href: "#features", labelKey: "features" },
  { href: "#pricing", labelKey: "pricing" },
] as const;

const navLinkClass = "text-sm text-muted-foreground hover:text-foreground transition-colors";

export function Navbar() {
  const { t } = useI18n();
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- reset mobile menu on navigation
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const displayName = getUserDisplayName(profile?.fullName, user?.email);
  const initials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Image src="/ourfolio-logo.svg" alt="OurFolio" width={24} height={24} />
          <span>OurFolio</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={navLinkClass}>
              {t(link.labelKey)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="rounded-lg gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("dashboard")}</span>
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/50">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={profile?.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate max-w-[120px]">{displayName}</span>
              </div>
              <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground hover:text-foreground" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden md:inline-flex">
                <Button variant="ghost" size="sm" className="rounded-lg">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/signup" className="hidden md:inline-flex">
                <Button size="sm" className="rounded-lg">
                  {t("signup")}
                </Button>
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`block ${navLinkClass}`}
              onClick={() => setMobileOpen(false)}
            >
              {t(link.labelKey)}
            </a>
          ))}
          {!user && (
            <div className="pt-2 flex gap-2">
              <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full rounded-lg">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full rounded-lg">
                  {t("signup")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
