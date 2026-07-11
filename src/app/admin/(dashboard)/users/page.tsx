import { ShieldCheck, Shield, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { requireRole } from "@/features/admin/auth/session";
import { listUsers } from "@/features/admin/users/data";
import { toggleUserActive } from "@/features/admin/users/actions";
import { AddUserForm } from "./add-user-form";

export const dynamic = "force-dynamic";

const ROLE_META: Record<
  string,
  { label: string; icon: typeof Shield; className: string }
> = {
  OWNER: {
    label: "Sahip",
    icon: ShieldCheck,
    className: "bg-accent/10 text-accent",
  },
  ADMIN: {
    label: "Yönetici",
    icon: Shield,
    className: "bg-violet-100 text-violet-800",
  },
  EDITOR: {
    label: "Editör",
    icon: Pencil,
    className: "bg-muted text-muted-foreground",
  },
};

/** İsimden baş harfleri üretir (avatar için). */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function AdminUsersPage() {
  const auth = await requireRole("ADMIN");
  const users = await listUsers();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Kullanıcılar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Panele erişebilen personel hesapları — {users.length} hesap.
      </p>

      <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-background shadow-soft">
        {users.map((user) => {
          const role = ROLE_META[user.role] ?? ROLE_META.EDITOR;
          return (
            <li
              key={user.id}
              className="flex items-center gap-4 px-5 py-4"
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  user.isActive
                    ? "bg-accent/10 text-accent"
                    : "bg-muted text-muted-foreground"
                )}
                aria-hidden="true"
              >
                {initials(user.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {user.name}
                  {user.id === auth.userId ? (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      (siz)
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    role.className
                  )}
                >
                  <role.icon className="h-3 w-3" aria-hidden="true" />
                  {role.label}
                </span>
                <span
                  className={
                    user.isActive
                      ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                      : "inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  }
                >
                  {user.isActive ? "Aktif" : "Pasif"}
                </span>
                {user.id !== auth.userId && user.role !== "OWNER" ? (
                  <form action={toggleUserActive}>
                    <input type="hidden" name="id" value={user.id} />
                    <input
                      type="hidden"
                      name="isActive"
                      value={String(!user.isActive)}
                    />
                    <button
                      type="submit"
                      className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {user.isActive ? "Pasifleştir" : "Aktifleştir"}
                    </button>
                  </form>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">
        Yeni kullanıcı ekle
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Editör içerik düzenleyebilir; Yönetici ayarlara ve kullanıcılara da
        erişir.
      </p>
      <AddUserForm />
    </div>
  );
}
