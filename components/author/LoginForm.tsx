"use client";

import { useActionState } from "react";
import { requestCode, verifyCode, type LoginState } from "@/app/author/actions";

const input = "w-full rounded-lg border border-line bg-white px-4 py-3 text-base focus:border-gold focus:outline-none";
const button = "w-full min-h-12 rounded-lg bg-navy px-5 text-base font-semibold text-white hover:bg-navy-deep disabled:opacity-60";

export default function LoginForm() {
  const init: LoginState = { ok: false };
  const [sent, send, sending] = useActionState(requestCode, init);
  const [checked, verify, verifying] = useActionState(verifyCode, init);
  const email = sent.ok ? sent.email : undefined;

  if (!email) {
    return (
      <form action={send} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Your email address</label>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required className={input} />
        </div>
        {sent.error ? <p role="alert" className="text-sm text-red-700">{sent.error}</p> : null}
        <button type="submit" disabled={sending} className={button}>{sending ? "Sending…" : "Email me a sign-in code"}</button>
      </form>
    );
  }

  return (
    <form action={verify} className="space-y-4">
      <input type="hidden" name="email" value={email} />
      <p className="text-sm text-body">If <strong>{email}</strong> is the author&apos;s address, a code has been sent. It can take a minute.</p>
      <div>
        <label htmlFor="code" className="mb-1 block text-sm font-medium text-ink">Code from the email</label>
        <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]*" required className={`${input} tracking-[0.3em]`} />
      </div>
      {checked.error ? <p role="alert" className="text-sm text-red-700">{checked.error}</p> : null}
      <button type="submit" disabled={verifying} className={button}>{verifying ? "Checking…" : "Sign in"}</button>
      <button type="button" onClick={() => window.location.reload()} className="w-full min-h-11 text-sm text-gold-deep underline">Use a different email or send a new code</button>
    </form>
  );
}
