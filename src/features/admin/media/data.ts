import { prisma } from "@/lib/prisma";
import { isPreviewMode, PREVIEW_MEDIA } from "@/features/admin/preview";

export async function listMedia() {
  if (isPreviewMode()) return PREVIEW_MEDIA;
  return prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: { select: { name: true } } },
  });
}

export function createMediaAsset(params: {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  altText?: string | null;
  uploadedById: string;
}) {
  return prisma.mediaAsset.create({ data: params });
}

export function deleteMediaAsset(id: string) {
  return prisma.mediaAsset.delete({ where: { id } });
}
