/**
 * İlk kurulum seed'i:
 *   1) OWNER rolünde ilk admin hesabını oluşturur (env: ADMIN_EMAIL,
 *      ADMIN_PASSWORD, ADMIN_NAME — .env.local'a yazın).
 *   2) messages/{tr,en}.json içindeki serviceDetails düğümlerini
 *      Page + PageTranslation tablolarına aktarır (panelden düzenlenebilir
 *      hale getirir). Var olan kayıtların İÇERİĞİNE dokunmaz — panelde
 *      yapılmış düzenlemeler seed tekrar çalıştırılınca kaybolmaz.
 *
 * Çalıştırma: npm run db:seed
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient, type Locale } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Yönetici";

  if (!email || !password) {
    console.log(
      "· ADMIN_EMAIL / ADMIN_PASSWORD tanımlı değil — admin hesabı atlandı."
    );
    return;
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD en az 10 karakter olmalı.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`· Admin hesabı zaten var: ${email} — atlandı.`);
    return;
  }

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
      role: "OWNER",
    },
  });
  console.log(`✓ OWNER hesabı oluşturuldu: ${email}`);
}

async function seedPages() {
  const locales: Locale[] = ["tr", "en"];
  const messagesByLocale = Object.fromEntries(
    locales.map((locale) => [
      locale,
      JSON.parse(
        readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8")
      ) as { serviceDetails?: Record<string, unknown> },
    ])
  );

  const slugs = Object.keys(messagesByLocale.tr.serviceDetails ?? {});

  for (const slug of slugs) {
    const page = await prisma.page.upsert({
      where: { type_slug: { type: "service-detail", slug } },
      create: { type: "service-detail", slug },
      update: {},
    });

    for (const locale of locales) {
      const content = messagesByLocale[locale].serviceDetails?.[slug];
      if (!content) continue;

      const existing = await prisma.pageTranslation.findUnique({
        where: { pageId_locale: { pageId: page.id, locale } },
      });
      if (existing) {
        console.log(`· ${slug} [${locale}] zaten var — içeriğe dokunulmadı.`);
        continue;
      }

      await prisma.pageTranslation.create({
        data: {
          pageId: page.id,
          locale,
          content: content as object,
        },
      });
      console.log(`✓ ${slug} [${locale}] içe aktarıldı.`);
    }
  }
}

async function main() {
  await seedAdminUser();
  await seedPages();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
