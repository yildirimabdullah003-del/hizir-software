"use client";

/**
 * İstemci tarafı analitik yardımcıları. Anonim bir visitorId (localStorage'da
 * saklanan rastgele kimlik) üretir ve olayları /api/track'e gönderir.
 * Kişisel veri toplanmaz; visitorId kimseyle ilişkilendirilemez.
 */

const VISITOR_KEY = "hz_vid";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        (crypto.randomUUID?.() ??
          `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    // localStorage kapalıysa (gizli mod vb.) oturumluk geçici kimlik.
    return "no-storage";
  }
}

type TrackType = "pageview" | "whatsapp_click";

export function trackEvent(type: TrackType, label?: string): void {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    type,
    path: window.location.pathname,
    visitorId: getVisitorId(),
    label,
  });

  try {
    // sendBeacon sayfa geçişlerinde bile güvenilir iletir; yoksa fetch.
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    // Analitik başarısızlığı sessizce yutulur.
  }
}
