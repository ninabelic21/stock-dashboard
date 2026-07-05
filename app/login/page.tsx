import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-400 font-semibold">
          V
        </div>
        <h1 className="mb-1 text-lg font-semibold text-neutral-100">Vermögen</h1>
        <p className="mb-6 text-sm text-neutral-400">
          Privates Dashboard — Anmeldung erforderlich.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-white"
          >
            Mit Google anmelden
          </button>
        </form>
      </div>
    </div>
  );
}
