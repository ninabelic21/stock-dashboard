import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function TopBar({ active }: { active: "portfolio" | "watchlist" }) {
  const session = await auth();
  const initial = session?.user?.name?.[0]?.toUpperCase() ?? "?";

  const tabClass = (isActive: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      isActive
        ? "bg-emerald-400 text-neutral-900"
        : "text-neutral-300 hover:text-neutral-100"
    }`;

  return (
    <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-sm font-semibold text-emerald-400">
          V
        </div>
        <span className="font-medium text-neutral-100">Vermögen</span>
      </div>

      <nav className="flex gap-1 rounded-full bg-neutral-900 p-1">
        <Link href="/" className={tabClass(active === "portfolio")}>
          Portfolio
        </Link>
        <Link href="/watchlist" className={tabClass(active === "watchlist")}>
          Watchlist
        </Link>
      </nav>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          title={session?.user?.email ?? "Abmelden"}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-sm font-medium text-neutral-300 transition hover:bg-neutral-700"
        >
          {initial}
        </button>
      </form>
    </header>
  );
}
