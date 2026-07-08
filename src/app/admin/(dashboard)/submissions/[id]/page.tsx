import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { SubmissionStatus } from "@prisma/client";
import { getSubmission } from "@/features/admin/submissions/data";
import { setSubmissionStatus } from "@/features/admin/submissions/actions";
import {
  StatusBadge,
  STATUS_LABELS,
} from "@/features/admin/submissions/status-badge";

export const dynamic = "force-dynamic";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/submissions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Mesajlara dön
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {submission.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <a
              href={`mailto:${submission.email}`}
              className="text-accent hover:underline"
            >
              {submission.email}
            </a>
            {submission.company ? ` · ${submission.company}` : ""}
          </p>
        </div>
        <StatusBadge status={submission.status} />
      </div>

      <dl className="mt-6 space-y-1 text-sm text-muted-foreground">
        <div>
          <dt className="inline font-medium text-foreground">Tarih: </dt>
          <dd className="inline">
            {submission.createdAt.toLocaleString("tr-TR")}
          </dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">
            E-posta iletimi:{" "}
          </dt>
          <dd className="inline">
            {submission.emailDelivered ? "İletildi" : "İletilmedi (yalnızca kayıt)"}
          </dd>
        </div>
        {submission.handledBy ? (
          <div>
            <dt className="inline font-medium text-foreground">İlgilenen: </dt>
            <dd className="inline">{submission.handledBy.name}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-6 whitespace-pre-wrap rounded-xl border border-border bg-background p-6 text-sm leading-relaxed">
        {submission.message}
      </div>

      <form action={setSubmissionStatus} className="mt-6 flex items-center gap-3">
        <input type="hidden" name="id" value={submission.id} />
        <label htmlFor="status" className="text-sm font-medium">
          Durum:
        </label>
        <select
          id="status"
          name="status"
          defaultValue={submission.status}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {(Object.keys(STATUS_LABELS) as SubmissionStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-foreground)] hover:opacity-90"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
}
