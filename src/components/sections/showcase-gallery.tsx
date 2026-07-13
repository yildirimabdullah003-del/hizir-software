"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Clock, Bell, TrendingUp } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

/**
 * Örnek Çalışmalar galerisi — üç kurgu marka, üç ürün: restoran web
 * sitesi, QR menü ve işletme paneli. Görseller stok fotoğraf değil;
 * her demo kendi sıcak renk paletiyle kodda resmedilir (yemek görselleri
 * katmanlı gradyanlarla). Gerçek müşteri işleri hazır olduğunda kart
 * içerikleri birebir ekran görüntüleriyle değiştirilir, çerçeve kalır.
 */

export type ShowcaseItem = {
  id: string;
  tag: string;
  title: string;
  description: string;
  /**
   * Panelden (Admin > Çalışmalar) seçilen gerçek ekran görüntüsü. Doluysa
   * kodla çizilmiş demo yerine bu görsel gösterilir ve "Demo" rozeti kalkar.
   */
  imageUrl?: string;
};

// Yemek "fotoğrafı" hissi veren katmanlı gradyan küçük görseller.
const FOOD_THUMBS: Record<string, string> = {
  kofte:
    "radial-gradient(circle at 35% 30%, #b45f3f 0%, #8a3f24 45%, #5f2a16 100%)",
  salata:
    "radial-gradient(circle at 60% 35%, #8fbf5f 0%, #5f9f3f 50%, #3f7f2a 100%)",
  pide:
    "radial-gradient(circle at 40% 40%, #e0a95f 0%, #c07f3f 55%, #8a5624 100%)",
  latte:
    "radial-gradient(circle at 40% 30%, #e8d5bf 0%, #b08a5f 55%, #6f4f33 100%)",
  cheesecake:
    "radial-gradient(circle at 55% 35%, #f5e8cf 0%, #e0bf8a 55%, #a8743f 100%)",
  espresso:
    "radial-gradient(circle at 45% 35%, #7a5033 0%, #4f3020 55%, #2f1c12 100%)",
};

function FoodThumb({ kind, size = 34 }: { kind: string; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-lg shadow-[inset_0_1px_2px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.15)]"
      style={{ width: size, height: size, background: FOOD_THUMBS[kind] }}
    />
  );
}

/* --- Demo 1: Lezzet Durağı — restoran web sitesi ------------------------- */
export function WebsiteDemo() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-soft">
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-[#faf7f2] px-3.5 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-amber-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
        <span className="ml-2 flex-1 rounded bg-black/[0.05] px-2 py-0.5 text-[8px] text-black/40">
          lezzetduragi.com.tr
        </span>
      </div>
      {/* Sıcak tonlu restoran hero'su */}
      <div
        className="relative flex h-28 flex-col items-center justify-center text-center"
        style={{
          background:
            "linear-gradient(160deg, #2f1c12 0%, #5f2a16 55%, #8a3f24 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, #e0a95f, transparent 55%)",
          }}
        />
        <p className="relative font-serif text-[15px] font-semibold tracking-wide text-[#f5e8cf]">
          Lezzet Durağı
        </p>
        <p className="relative mt-0.5 text-[8px] tracking-[0.2em] text-[#e0bf8a] uppercase">
          Ocakbaşı & Izgara · Est. 1998
        </p>
        <span className="relative mt-2 rounded-full bg-[#e0a95f] px-3 py-1 text-[8px] font-semibold text-[#2f1c12]">
          Rezervasyon Yap
        </span>
      </div>
      <div className="space-y-2.5 bg-[#faf7f2] p-3.5">
        <div className="flex gap-2.5">
          {(["kofte", "pide", "salata"] as const).map((kind) => (
            <div
              key={kind}
              className="flex-1 rounded-lg border border-black/[0.06] bg-white p-2"
            >
              <FoodThumb kind={kind} size={40} />
              <div className="mt-1.5 h-1.5 w-4/5 rounded bg-black/[0.12]" />
              <div className="mt-1 h-1 w-3/5 rounded bg-black/[0.07]" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-lg border border-black/[0.06] bg-white px-2.5 py-1.5 text-[8px] text-black/50">
          <span className="flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5 text-[#8a3f24]" /> Kadıköy, İstanbul
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5 text-[#8a3f24]" /> 11:00 – 23:00
          </span>
          <span className="flex items-center gap-0.5 text-amber-500">
            <Star className="h-2.5 w-2.5 fill-current" /> 4,8
          </span>
        </div>
      </div>
    </div>
  );
}

/* --- Demo 2: Fincan Kahve — QR menü -------------------------------------- */
export function QrMenuDemo() {
  return (
    <div className="mx-auto w-[13.5rem] overflow-hidden rounded-[1.4rem] border border-border bg-white shadow-soft">
      <div
        className="px-4 pb-3 pt-4"
        style={{
          background: "linear-gradient(150deg, #2d4a3e 0%, #1d332a 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8d5bf] text-[10px] font-bold text-[#2d4a3e]">
            F
          </span>
          <div>
            <p className="text-[11px] font-semibold text-[#f2ece2]">
              Fincan Kahve
            </p>
            <p className="text-[7px] tracking-widest text-[#a8c4b5] uppercase">
              Dijital Menü
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <span className="rounded-full bg-[#e8d5bf] px-2 py-0.5 text-[7.5px] font-semibold text-[#2d4a3e]">
            Kahve
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[7.5px] text-[#d5e0d8]">
            Tatlı
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[7.5px] text-[#d5e0d8]">
            Soğuk
          </span>
        </div>
      </div>
      <div className="space-y-1.5 bg-[#f7f4ee] p-3">
        {(
          [
            ["latte", "Karamel Latte", "Bol köpüklü, ev yapımı karamel", "₺95"],
            ["espresso", "Double Espresso", "Yoğun, çikolata notalı", "₺70"],
            ["cheesecake", "San Sebastian", "Günlük, orta yanık", "₺140"],
          ] as const
        ).map(([kind, name, desc, price]) => (
          <div
            key={name}
            className="flex items-center gap-2.5 rounded-xl border border-black/[0.05] bg-white p-2"
          >
            <FoodThumb kind={kind} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9.5px] font-semibold text-[#22302a]">
                {name}
              </p>
              <p className="truncate text-[7.5px] text-black/40">{desc}</p>
            </div>
            <span className="text-[9.5px] font-bold text-[#2d4a3e]">
              {price}
            </span>
          </div>
        ))}
        <p className="pt-0.5 text-center text-[7px] text-black/30">
          Alerjen bilgisi için ürüne dokunun
        </p>
      </div>
    </div>
  );
}

/* --- Demo 3: Saray Pide — işletme paneli ---------------------------------- */
function PosDemo() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#171c26] shadow-soft">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#e0a95f] text-[9px] font-bold text-[#171c26]">
            S
          </span>
          <p className="text-[10px] font-semibold text-white/90">
            Saray Pide · Panel
          </p>
        </div>
        <span className="relative">
          <Bell className="h-3 w-3 text-white/50" />
          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#e0a95f]" />
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {(
          [
            ["Bugünkü ciro", "₺18.450", true],
            ["Açık masa", "12 / 24", false],
            ["Bekleyen sipariş", "6", false],
          ] as const
        ).map(([label, value, accent]) => (
          <div
            key={label}
            className="rounded-lg bg-white/[0.05] px-2 py-2"
          >
            <p className="text-[6.5px] text-white/40">{label}</p>
            <p
              className={`mt-0.5 text-[11px] font-bold ${
                accent ? "text-[#e0a95f]" : "text-white/90"
              }`}
            >
              {value}
            </p>
            {accent ? (
              <p className="mt-0.5 flex items-center gap-0.5 text-[6.5px] text-emerald-400">
                <TrendingUp className="h-2 w-2" /> %12 dün
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <div className="space-y-1.5 px-3 pb-3">
        {(
          [
            ["Masa 7", "Kaşarlı Pide ×2, Ayran ×2", "Mutfakta", "#e0a95f"],
            ["Paket #142", "Kıymalı Pide, Mercimek", "Yolda", "#7fbf8f"],
            ["Masa 3", "Karışık Pide, Salata", "Servis edildi", "#8f9fb5"],
          ] as const
        ).map(([table, items, status, color]) => (
          <div
            key={table}
            className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 py-1.5"
          >
            <p className="w-12 shrink-0 text-[8px] font-semibold text-white/85">
              {table}
            </p>
            <p className="min-w-0 flex-1 truncate text-[7.5px] text-white/45">
              {items}
            </p>
            <span
              className="rounded-full px-1.5 py-0.5 text-[6.5px] font-medium"
              style={{ color, background: `${color}1f` }}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DEMOS: Record<string, () => React.ReactNode> = {
  "web-site": WebsiteDemo,
  "qr-menu": QrMenuDemo,
  pos: PosDemo,
};

export function ShowcaseGallery({
  items,
  demoBadge,
}: {
  items: ShowcaseItem[];
  /** Kartların köşesindeki dürüstlük rozeti: "Demo" */
  demoBadge: string;
}) {
  return (
    <motion.div
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 lg:grid-cols-3"
    >
      {items.map((item) => {
        const Demo = DEMOS[item.id];
        return (
          <motion.article
            key={item.id}
            variants={fadeInUp}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex flex-col rounded-2xl border border-border bg-surface p-5 transition-[box-shadow,border-color] duration-base ease-out-soft hover:border-accent/40 hover:shadow-glow"
          >
            <div className="relative">
              {item.imageUrl ? (
                // Gerçek müşteri ekran görüntüsü (panelden seçildi). Blob
                // URL'leri harici olduğundan bilinçli olarak düz img.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl border border-border object-cover shadow-soft"
                />
              ) : (
                <>
                  {Demo ? <Demo /> : null}
                  {/* Dürüstlük rozeti yalnızca kurgu demolarda gösterilir. */}
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-foreground/70 px-2 py-0.5 text-[9px] font-medium text-background backdrop-blur">
                    {demoBadge}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-1 flex-col px-1 pt-5">
              <p className="text-xs font-medium tracking-widest text-accent uppercase">
                {item.tag}
              </p>
              <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
