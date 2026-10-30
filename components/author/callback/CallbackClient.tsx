"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { completeSignIn } from "@/app/author/actions";

// The magic link brings the visitor here with the sign-in token in the address after "#".
// That part never reaches a server, so this page reads it and hands it to completeSignIn.
export default function CallbackClient() {
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    // Remove the token from the address bar and history straight away.
    window.history.replaceState(null, "", window.location.pathname);
    const problem = params.get("error_description") || params.get("error");
    const token = params.get("access_token");
    if (problem) {
      setError(/expired|invalid/i.test(problem) ? "This sign-in link has expired or was already used. Request a new one." : problem.replace(/\+/g, " "));
      return;
    }
    if (!token) {
      setError("This sign-in link is not valid. Request a new one.");
      return;
    }
    completeSignIn(token)
      .then((r) => {
        if (r.ok) window.location.replace("/author");
        else setError(r.error || "Could not sign in. Request a new link.");
      })
      .catch(() => setError("Could not sign in. Check your connection and request a new link."));
  }, []);

  if (error) {
    return (
      <div role="alert" className="space-y-4">
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>
        <Link href="/author" className="inline-flex min-h-12 items-center rounded-lg bg-navy px-5 text-base font-semibold text-white no-underline">Back to sign-in</Link>
      </div>
    );
  }
  return <p role="status" className="text-sm text-body">Signing you in…</p>;
}
