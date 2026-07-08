import type { SubmissionStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  NEW: "Yeni",
  IN_PROGRESS: "İlgileniliyor",
  RESOLVED: "Sonuçlandı",
  SPAM: "Spam",
};

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  NEW: "bg-accent/10 text-accent",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  SPAM: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
