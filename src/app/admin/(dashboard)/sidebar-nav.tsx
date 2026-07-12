"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Tag,
  Image as ImageIcon,
  GalleryHorizontalEnd,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

/**
 * Panel yan menüsü (client). `usePathname` ile aktif bağlantı vurgulanır.
 * Menü, işlevsel gruplara ayrılmıştır; koyu premium bir zemin üzerinde durur.
 */
export function SidebarNav({ newSubmissions }: { newSubmissions?: number }) {
  const pathname = usePathname();

  const groups: NavGroup[] = [
    {
      title: "Genel",
      items: [{ href: "/admin", label: "Genel Bakış", icon: LayoutDashboard }],
    },
    {
      title: "İçerik",
      items: [
        {
          href: "/admin/submissions",
          label: "Mesajlar",
          icon: Inbox,
          badge: newSubmissions,
        },
        { href: "/admin/pages", label: "Sayfalar", icon: FileText },
        { href: "/admin/pricing", label: "Fiyatlandırma", icon: Tag },
        { href: "/admin/showcase", label: "Çalışmalar", icon: GalleryHorizontalEnd },
        { href: "/admin/media", label: "Medya", icon: ImageIcon },
      ],
    },
    {
      title: "Yönetim",
      items: [
        { href: "/admin/settings", label: "Ayarlar", icon: Settings },
        { href: "/admin/users", label: "Kullanıcılar", icon: Users },
      ],
    },
  ];

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav aria-label="Panel navigasyonu" className="flex-1 space-y-6 px-3 py-4">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-white/35">
            {group.title}
          </p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-white/10 font-medium text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent"
                      />
                    ) : null}
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active
                          ? "text-accent"
                          : "text-white/45 group-hover:text-white/80"
                      )}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[0.7rem] font-semibold leading-5 text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
