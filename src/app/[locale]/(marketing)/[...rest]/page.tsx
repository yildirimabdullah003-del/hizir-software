import { notFound } from "next/navigation";

/**
 * Locale altında eşleşmeyen tüm yolları yakalar ve en yakın not-found
 * sınırına (../not-found.tsx) devreder. Böylece 404 sayfası site
 * kabuğu (header/footer) ve doğru dil ile render edilir.
 */
export default function CatchAllPage() {
  notFound();
}
