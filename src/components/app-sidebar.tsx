"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen, FileText, MessageSquare, Settings, LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getUserDisplayName, getInitials } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const { t } = useI18n();
  const { user, profile, signOut } = useAuth();

  const items = [
    { title: t("dashboard"), url: "/dashboard", icon: LayoutDashboard },
    { title: t("projects"), url: "/dashboard/projects", icon: FolderOpen },
    { title: t("caseStudies"), url: "/dashboard/case-studies", icon: FileText },
    { title: t("leads"), url: "/dashboard/leads", icon: MessageSquare },
    { title: t("settings"), url: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (path: string) =>
    path === "/dashboard" ? pathname === path : pathname.startsWith(path);

  const displayName = getUserDisplayName(profile?.fullName, user?.email);
  const initials = getInitials(displayName);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/40 p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <img src="/logo-120.svg" alt="OurFolio" className="h-5 w-5 shrink-0" />
          {!collapsed && <span>OurFolio</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={cn(
                      "hover:bg-muted/50",
                      active && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={profile?.avatarUrl || undefined} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors" title={t("logout")}>
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
