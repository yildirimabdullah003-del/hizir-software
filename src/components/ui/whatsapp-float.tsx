"use client";

import { track } from "@vercel/analytics";
import { trackEvent } from "@/lib/track";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { siteConfig } from "@/config/site";

/**
 * Sayfanın sağ altında sabit duran WhatsApp butonu. Hedef kitle (restoran
 * işletmecileri) için en hızlı iletişim kanalı — her sayfadan tek dokunuşla
 * erişilir. Tıklamalar analitiğe "whatsapp_click / float" olarak düşer.
 */
export function WhatsAppFloat({ message }: { message: string }) {
  const href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
      onClick={() => {
        track("whatsapp_click", { product: "float" });
        trackEvent("whatsapp_click", "float");
      }}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lifted transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
