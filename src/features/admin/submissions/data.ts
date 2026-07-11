import type { SubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isPreviewMode, PREVIEW_SUBMISSIONS } from "@/features/admin/preview";

export async function listSubmissions(status?: SubmissionStatus) {
  if (isPreviewMode()) {
    return status
      ? PREVIEW_SUBMISSIONS.filter((s) => s.status === status)
      : PREVIEW_SUBMISSIONS;
  }
  return prisma.contactSubmission.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { handledBy: { select: { name: true } } },
  });
}

export async function getSubmission(id: string) {
  if (isPreviewMode()) {
    return PREVIEW_SUBMISSIONS.find((s) => s.id === id) ?? null;
  }
  return prisma.contactSubmission.findUnique({
    where: { id },
    include: { handledBy: { select: { name: true } } },
  });
}

export function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  handledById: string
) {
  return prisma.contactSubmission.update({
    where: { id },
    data: { status, handledById },
  });
}

/** Durum başına mesaj sayıları (filtre çiplerindeki rozetler için). */
export async function countSubmissionsByStatus(): Promise<
  Record<SubmissionStatus, number>
> {
  const counts: Record<SubmissionStatus, number> = {
    NEW: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    SPAM: 0,
  };
  if (isPreviewMode()) {
    for (const s of PREVIEW_SUBMISSIONS) counts[s.status] += 1;
    return counts;
  }
  const rows = await prisma.contactSubmission.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  for (const row of rows) counts[row.status] = row._count._all;
  return counts;
}
