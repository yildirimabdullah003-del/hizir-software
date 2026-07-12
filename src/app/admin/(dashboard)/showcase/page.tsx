import Link from "next/link";
import { getMessages } from "next-intl/server";
import { requireRole } from "@/features/admin/auth/session";
import { getStoredShowcase } from "@/features/admin/showcase/data";
import type { ShowcaseContent } from "@/features/admin/showcase/schema";
import { listMedia } from "@/features/admin/media/data";
import { ShowcaseForm } from "./showcase-form";

export const dynamic = "force-dynamic";

async function effective(locale: "tr" | "en"): Promise<ShowcaseContent> {
  const stored = await getStoredShowcase(locale);
  if (stored) return stored;
  const messages = await getMessages({ locale });
  const works = (messages.home as Record<string, unknown>).works as {
    items: ShowcaseContent["items"];
  };
  // messages'taki öğelerde imageUrl yok — boş (kodlu demo) olarak başlar.
  return { items: works.items.map((i) => ({ ...i, imageUrl: i.imageUrl ?? "" })) };
}

export default async function AdminShowcasePage() {
  await requireRole("ADMIN");
  const [tr, en, media] = await Promise.all([
    effective("tr"),
    effective("en"),
    listMedia(),
  ]);

  // Görsel seçici yalnızca resim dosyalarını listeler.
  const images = media
    .filter((m) => m.mimeType.startsWith("image/"))
    .map((m) => ({ url: m.url, filename: m.filename }));

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Çalışmalar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Ana sayfadaki ve <em>Örnek Çalışmalar</em> sayfasındaki vitrin
        kartlarını buradan yönetin. Bir karta{" "}
        <Link href="/admin/media" className="text-accent underline-offset-2 hover:underline">
          Medya
        </Link>
        &apos;dan yüklediğiniz gerçek bir ekran görüntüsü seçerseniz, kodla
        çizilmiş demo yerine o görsel gösterilir ve &quot;Demo&quot; rozeti
        kalkar.
      </p>
      <ShowcaseForm initialTr={tr} initialEn={en} images={images} />
    </div>
  );
}
