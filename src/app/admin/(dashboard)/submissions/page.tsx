import Link from "next/link";
import type { SubmissionStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { listSubmissions } from "@/features/admin/submissions/data";
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

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter =
    status && status in STATUS_LABELS ? (status as SubmissionStatus) : undefined;

  const submissions = await listSubmissions(activeFilter);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Mesajlar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        İletişim formundan gelen talepler.
      </p>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={
              f.value === "ALL"
                ? "/admin/submissions"
                : `/admin/submissions?status=${f.value}`
            }
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              (f.value === "ALL" && !activeFilter) || f.value === activeFilter
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {submissions.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Bu filtreyle eşleşen mesaj yok.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-background">
          {submissions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/submissions/${s.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted"
              >
                <div className="min-w-0">
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
