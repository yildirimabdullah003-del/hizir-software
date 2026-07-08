import { requireRole } from "@/features/admin/auth/session";
import { listUsers } from "@/features/admin/users/data";
import { toggleUserActive } from "@/features/admin/users/actions";
import { AddUserForm } from "./add-user-form";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Sahip",
  ADMIN: "Yönetici",
  EDITOR: "Editör",
};

export default async function AdminUsersPage() {
  const auth = await requireRole("ADMIN");
  const users = await listUsers();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Kullanıcılar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Panele erişebilen personel hesapları.
      </p>

      <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-background">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div>
              <p className="text-sm font-medium">
                {user.name}
                {user.id === auth.userId ? (
                  <span className="ml-2 text-xs text-muted-foreground">(siz)</span>
                ) : null}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.email} · {ROLE_LABELS[user.role] ?? user.role}
              </p>
            </div>
            <div className="flex items-center gap-3">
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
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">
        Yeni kullanıcı ekle
      </h2>
      <AddUserForm />
    </div>
  );
}
