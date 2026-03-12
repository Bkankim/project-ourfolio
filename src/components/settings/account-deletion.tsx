"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export function AccountDeletion() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (res.ok) {
        toast.success(t("accountDeleted"));
        window.location.href = "/auth";
      } else {
        const data = await res.json();
        toast.error(data.error ?? "Failed to delete account");
        setDeleting(false);
      }
    } catch {
      toast.error("Failed to delete account");
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-destructive/30 p-6 space-y-3">
      <h3 className="text-lg font-semibold text-destructive">
        {t("deleteAccount")}
      </h3>
      <p className="text-sm text-muted-foreground">{t("deleteAccountDesc")}</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            {t("deleteAccount")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteAccountConfirm")}</DialogTitle>
            <DialogDescription>{t("deleteAccountDesc")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={deleting}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("deleteAccountFinal")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
