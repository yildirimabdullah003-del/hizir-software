"use client";

import { useActionState } from "react";
import { addUser, type CreateUserState } from "@/features/admin/users/actions";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-fast focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15";

export function AddUserForm() {
  const [state, formAction, pending] = useActionState<CreateUserState, FormData>(
    addUser,
    {}
  );

  return (
    <form
      action={formAction}
      className="mt-4 grid gap-4 rounded-xl border border-border bg-background p-6 shadow-soft sm:grid-cols-2"
    >
      <div>
        <label htmlFor="new-name" className="mb-1 block text-xs font-medium">
          Ad Soyad
        </label>
        <input id="new-name" name="name" type="text" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="new-email" className="mb-1 block text-xs font-medium">
          E-posta
        </label>
        <input id="new-email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="new-password" className="mb-1 block text-xs font-medium">
          Parola (en az 10 karakter)
        </label>
        <input
          id="new-password"
          name="password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="new-role" className="mb-1 block text-xs font-medium">
          Rol
        </label>
        <select id="new-role" name="role" className={inputClass} defaultValue="EDITOR">
          <option value="EDITOR">Editör (içerik düzenler)</option>
          <option value="ADMIN">Yönetici (ayarlar + kullanıcılar)</option>
        </select>
      </div>
      <div className="flex items-center gap-4 sm:col-span-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Ekleniyor..." : "Kullanıcı ekle"}
        </Button>
        {state.error ? (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-emerald-700">Kullanıcı eklendi ✓</p>
        ) : null}
      </div>
    </form>
  );
}
