"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { FolderOpen, FileText, ExternalLink } from "lucide-react";

interface QuickActionsProps {
  username?: string | null;
}

export function QuickActions({ username }: QuickActionsProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t("quickActions")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Link href="/dashboard/projects">
          <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
            <FolderOpen className="h-4 w-4" />
            {t("addProject")}
          </Button>
        </Link>
        <Link href="/dashboard/case-studies">
          <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
            <FileText className="h-4 w-4" />
            {t("writeCaseStudy")}
          </Button>
        </Link>
        {username && (
          <Link href={`/${username}`} target="_blank">
            <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
              <ExternalLink className="h-4 w-4" />
              {t("viewPortfolio")}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
