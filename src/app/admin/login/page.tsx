import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/features/admin/auth/session";
import { isPreviewMode } from "@/features/admin/preview";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Giriş" };

// Oturum cookie'sine baktığı için her istekte sunucuda çalışmalı.
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  // Önizleme modunda giriş adımı atlanır, doğrudan panele geçilir.
  if (isPreviewMode()) {
    redirect("/admin");
  }

  const session = await getSession();
  if (session.userId) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-8 shadow-soft">
        <h1 className="text-xl font-semibold tracking-tight">
          HIZIR Yönetim Paneli
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Devam etmek için giriş yapın.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
