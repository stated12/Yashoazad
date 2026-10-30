"use client";

import { useActionState } from "react";
import { requestCode, type LoginState } from "@/app/author/actions";

const input = "w-full rounded-lg border border-line bg-white px-4 py-3 text-base focus:border-gold focus:outline-none";
const button = "w-full min-h-12 rounded-lg bg-navy px-5 text-base font-semibold text-white hover:bg-navy-deep disabled:opacity-60";

export default function LoginForm() {
  const init: LoginState = { ok: false };
  const [sent, send, sending] = useActionState(requestCode, init);

  if (sent.ok) {
    return (
      <div role="status" className="space-y-4 rounded-xl border border-line bg-white p-5">
        <p className="font-serif text-2xl text-navy-deep">Check your email</p>
        <p className="text-sm leading-relaxed text-body">
          If <strong>{sent.email}</strong> is the author&apos;s address, a sign-in link has been sent. It can take a minute. Open the link on this phone or computer to sign in. The link works once and expires soon.
        </p>
        <button type="button" onClick={() => window.location.reload()} className="min-h-11 text-sm text-gold-deep underline">Use a different email or send a new link</button>
      </div>
    );
  }

  return (
    <form action={send} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Your email address</label>
        <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required className={input} />
      </div>
      {sent.error ? <p role="alert" className="text-sm text-red-700">{sent.error}</p> : null}
      <button type="submit" disabled={sending} className={button}>{sending ? "Sending…" : "Email me a sign-in link"}</button>
    </form>
  );
}
