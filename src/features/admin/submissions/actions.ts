"use server";

import { revalidatePath } from "next/cache";
import type { SubmissionStatus } from "@prisma/client";
import { requireSession } from "@/features/admin/auth/session";
import { updateSubmissionStatus } from "@/features/admin/submissions/data";
import { isPreviewMode } from "@/features/admin/preview";

const VALID_STATUSES: SubmissionStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "RESOLVED",
  "SPAM",
];

export async function setSubmissionStatus(formData: FormData) {
  const auth = await requireSession();
  if (isPreviewMode()) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as SubmissionStatus;

  if (!id || !VALID_STATUSES.includes(status)) return;

  await updateSubmissionStatus(id, status, auth.userId);
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
}
