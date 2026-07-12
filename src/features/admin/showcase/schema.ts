import { z } from "zod";

/**
 * Örnek Çalışmalar (vitrin) içeriği — panelden düzenlenebilir.
 * `imageUrl` boşsa kart, kodla çizilmiş demo maketini gösterir; doluysa
 * (Medya kütüphanesinden seçilen gerçek ekran görüntüsü) o görsel gösterilir
 * ve "Demo" rozeti kaldırılır.
 */
export const showcaseItemSchema = z.object({
  id: z.string().min(1),
  tag: z.string().min(1, "Etiket boş olamaz"),
  title: z.string().min(1, "Başlık boş olamaz"),
  description: z.string().min(1, "Açıklama boş olamaz"),
  imageUrl: z
    .union([z.literal(""), z.string().url("Görsel adresi geçerli bir URL olmalı")])
    .optional(),
});

export const showcaseContentSchema = z.object({
  items: z.array(showcaseItemSchema).min(1).max(6),
});

export type ShowcaseContent = z.infer<typeof showcaseContentSchema>;
export type StoredShowcaseItem = z.infer<typeof showcaseItemSchema>;
