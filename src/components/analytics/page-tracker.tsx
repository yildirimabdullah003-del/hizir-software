"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/track";

/**
 * Rota her değiştiğinde bir "pageview" olayı gönderir. Kendi barındırdığımız,
 * gizlilik dostu analitiğin sayfa görüntüleme kaynağı (bkz. /api/track).
 */
export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("pageview");
  }, [pathname]);

  return null;
}
