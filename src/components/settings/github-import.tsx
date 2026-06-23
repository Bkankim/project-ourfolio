"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Github, Loader2, Star } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface GithubRepo {
  repoId: string;
  name: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  language: string | null;
}

export function GithubImport() {
  const { t } = useI18n();
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [notConnected, setNotConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await authClient.linkSocial({
        provider: "github",
        callbackURL: "/dashboard/settings",
      });
    } catch {
      toast.error("Failed to connect GitHub");
      setConnecting(false);
    }
  };

  const handleLoadRepos = async () => {
    setLoading(true);
    setNotConnected(false);
    try {
      const res = await fetch("/api/github/repos");
      if (res.status === 400) {
        setNotConnected(true);
        setRepos([]);
        setLoaded(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to load repositories");
        return;
      }
      const data = await res.json();
      setRepos(data.repos ?? []);
      setSelected(new Set());
      setLoaded(true);
    } catch {
      toast.error("Failed to load repositories");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (repoId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(repoId)) {
        next.delete(repoId);
      } else {
        next.add(repoId);
      }
      return next;
    });
  };

  const handleImport = async () => {
    if (selected.size === 0) return;
    setImporting(true);
    try {
      const res = await fetch("/api/github/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoIds: Array.from(selected) }),
      });
      if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "GitHub not connected") {
          setNotConnected(true);
          setLoaded(false);
          return;
        }
        toast.error(data.error ?? "Import failed");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Import failed");
        return;
      }
      toast.success(t("githubImported"));
      setSelected(new Set());
    } catch {
      toast.error("Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/40 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Github className="h-5 w-5" />
        <h3 className="text-lg font-semibold">GitHub</h3>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Github className="h-4 w-4" />
          )}
          {t("githubConnect")}
        </Button>

        <Button
          variant="outline"
          className="gap-2"
          onClick={handleLoadRepos}
          disabled={loading}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("githubLoadRepos")}
        </Button>
      </div>

      {notConnected && (
        <p className="text-sm text-muted-foreground">{t("githubNotConnected")}</p>
      )}

      {loaded && repos.length === 0 && !notConnected && (
        <p className="text-sm text-muted-foreground">No repositories found.</p>
      )}

      {repos.length > 0 && (
        <>
          <ul className="space-y-2">
            {repos.map((repo) => (
              <li
                key={repo.repoId}
                className="flex items-start gap-3 rounded-lg border border-border/40 p-3"
              >
                <Checkbox
                  id={`repo-${repo.repoId}`}
                  checked={selected.has(repo.repoId)}
                  onCheckedChange={() => toggle(repo.repoId)}
                  className="mt-1"
                />
                <label
                  htmlFor={`repo-${repo.repoId}`}
                  className="flex-1 cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{repo.name}</span>
                    {repo.language && (
                      <span className="text-xs text-muted-foreground">
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Star className="h-3 w-3" />
                      {repo.stars}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground">
                      {repo.description}
                    </p>
                  )}
                </label>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleImport}
              disabled={importing || selected.size === 0}
              className="gap-2 rounded-xl"
            >
              {importing && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("githubImportSelected")}
            </Button>
            <Link
              href="/dashboard/projects"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              /dashboard/projects
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
