import Link from "next/link";
import { authConfigured, currentAuthor } from "@/lib/author-auth";
import { authorList, type AuthorRow } from "@/lib/author-data";
import { signOut } from "./actions";
import LoginForm from "@/components/author/LoginForm";

export const dynamic = "force-dynamic";

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");

function Item({ r }: { r: AuthorRow }) {
  const langs = [r.title || r.body ? "EN" : "", r.title_hi || r.body_hi ? "हिं" : ""].filter(Boolean).join(" · ");
  const name = r.title || r.title_hi || "Untitled";
  return (
    <li>
      <Link href={`/author/${r.id}`} className="block rounded-xl border border-line bg-white p-4 no-underline hover:border-gold">
        <p className="text-base font-medium leading-snug text-navy-deep">{name}</p>
        <p className="mt-1 text-xs text-muted">
          {langs || "Empty"} · {r.status === "published" ? `Published ${when(r.published_at)}` : `Edited ${when(r.updated_at || r.created_at)}`}
        </p>
      </Link>
    </li>
  );
}

export default async function AuthorHome() {
  const who = await currentAuthor();

  if (!who) {
    return (
      <div className="mx-auto max-w-md px-5 py-14">
        <h1 className="font-serif text-4xl font-light text-navy-deep">Author sign-in</h1>
        <p className="mb-6 mt-2 text-sm text-body">Private area for writing and publishing articles.</p>
        {authConfigured() ? (
          <LoginForm />
        ) : (
          <p role="alert" className="rounded-lg border border-line bg-white p-4 text-sm text-body">
            Sign-in is not set up yet. The site owner needs to finish the steps in docs/AUTHOR_SETUP.md.
          </p>
        )}
      </div>
    );
  }

  const { rows, error } = await authorList();
  const drafts = rows.filter((r) => r.status === "draft");
  const live = rows.filter((r) => r.status === "published");

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-light text-navy-deep">Your articles</h1>
        <form action={signOut}><button type="submit" className="min-h-11 px-2 text-sm text-gold-deep underline">Sign out</button></form>
      </div>

      <Link href="/author/new" className="mt-5 flex min-h-14 items-center justify-center rounded-xl bg-navy px-6 text-base font-semibold text-white no-underline hover:bg-navy-deep">
        + Write a new article
      </Link>

      {error === "pending-sql" ? (
        <p role="note" className="mt-4 rounded-lg border border-gold/50 bg-gold-soft p-3 text-sm text-ink">The database update (03_author.sql) has not been run yet. Saving will not work until it is.</p>
      ) : error ? (
        <p role="alert" className="mt-4 text-sm text-red-700">Could not load articles: {error}</p>
      ) : null}

      <h2 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wider text-gold-deep">Drafts ({drafts.length})</h2>
      {drafts.length ? <ul className="space-y-3">{drafts.map((r) => <Item key={r.id} r={r} />)}</ul> : <p className="text-sm text-muted">No drafts.</p>}

      <h2 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wider text-gold-deep">Published ({live.length})</h2>
      {live.length ? <ul className="space-y-3">{live.map((r) => <Item key={r.id} r={r} />)}</ul> : <p className="text-sm text-muted">Nothing published yet.</p>}
    </div>
  );
}
