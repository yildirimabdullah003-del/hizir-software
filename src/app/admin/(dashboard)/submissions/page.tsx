import Link from "next/link";
import type { SubmissionStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  listSubmissions,
  countSubmissionsByStatus,
} from "@/features/admin/submissions/data";
import {
  StatusBadge,
  STATUS_LABELS,
} from "@/features/admin/submissions/status-badge";

export const dynamic = "force-dynamic";

const FILTERS: { value: SubmissionStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tümü" },
  { value: "NEW", label: "Yeni" },
  { value: "IN_PROGRESS", label: "İlgileniliyor" },
  { value: "RESOLVED", label: "Sonuçlandı" },
  { value: "SPAM", label: "Spam" },
];

/** İsimden baş harfleri üretir (liste avatarları için). */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter =
    status && status in STATUS_LABELS ? (status as SubmissionStatus) : undefined;

  const [submissions, counts] = await Promise.all([
    listSubmissions(activeFilter),
    countSubmissionsByStatus(),
  ]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Mesajlar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        İletişim formundan gelen talepler — potansiyel müşterileriniz.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = f.value === "ALL" ? total : counts[f.value];
          const active =
            (f.value === "ALL" && !activeFilter) || f.value === activeFilter;
          return (
            <Link
              key={f.value}
              href={
                f.value === "ALL"
                  ? "/admin/submissions"
                  : `/admin/submissions?status=${f.value}`
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                active
                  ? "border-accent bg-accent/10 font-medium text-accent"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs tabular-nums",
                  active ? "bg-accent/15" : "bg-muted"
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {submissions.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
          Bu filtreyle eşleşen mesaj yok.
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-background shadow-soft">
          {submissions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/submissions/${s.id}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    s.status === "NEW"
                      ? "bg-accent/10 text-accent"
                      : "bg-muted text-muted-foreground"
                  )}
                  aria-hidden="true"
                >
                  {initials(s.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {s.name}
                    <span className="ml-2 font-normal text-muted-foreground">
                      {s.email}
                      {s.company ? ` · ${s.company}` : ""}
                    </span>
                  </p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {s.message}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={s.status} />
                  <time className="text-xs text-muted-foreground">
                    {s.createdAt.toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
