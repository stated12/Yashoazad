"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { analyticsAllowed, CONSENT_EVENT, CONSENT_MODE, OPEN_EVENT, readConsent, writeConsent } from "@/lib/consent";

export default function ConsentManager() {
  const [ready, setReady] = useState(false);
  const [banner, setBanner] = useState(false);
  const [panel, setPanel] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setReady(true);
    setBanner(readConsent() === null);
    setAnalytics(analyticsAllowed());
    const open = () => {
      opener.current = document.activeElement as HTMLElement | null;
      setAnalytics(analyticsAllowed());
      setPanel(true);
    };
    const sync = () => setAnalytics(analyticsAllowed());
    window.addEventListener(OPEN_EVENT, open);
    window.addEventListener(CONSENT_EVENT, sync);
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      window.removeEventListener(CONSENT_EVENT, sync);
    };
  }, []);

  useEffect(() => {
    if (!panel) return;
    dialogRef.current?.querySelector<HTMLElement>("input,button,a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialogRef.current) {
        const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("input,button,a[href]"));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panel]);

  function close() {
    setPanel(false);
    opener.current?.focus?.();
  }
  function choose(value: boolean) {
    writeConsent(value);
    setBanner(false);
  }
  function save() {
    writeConsent(analytics);
    setBanner(false);
    close();
  }

  if (!ready) return null;

  const btn = "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors";
  const solid = `${btn} bg-navy text-white hover:bg-navy-deep`;
  const outline = `${btn} border border-line bg-white text-navy hover:border-gold`;

  return (
    <>
      {banner && !panel ? (
        <div role="region" aria-label="Privacy notice" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-white p-4 shadow-[0_20px_50px_-20px_rgba(31,47,77,0.45)]">
          <p className="text-sm leading-relaxed text-body">
            {CONSENT_MODE === "opt-in"
              ? "May we use privacy-friendly analytics to count visits to this site? It does not use advertising cookies."
              : "This site uses privacy-friendly analytics to count visits. It does not use advertising cookies, and you can switch it off at any time."}{" "}
            <Link href="/cookies" className="text-gold-deep underline">Cookie Policy</Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CONSENT_MODE === "opt-in" ? (
              <>
                <button type="button" className={solid} onClick={() => choose(true)}>Allow analytics</button>
                <button type="button" className={outline} onClick={() => choose(false)}>No thanks</button>
              </>
            ) : (
              <>
                <button type="button" className={solid} onClick={() => choose(true)}>OK</button>
                <button type="button" className={outline} onClick={() => choose(false)}>Turn off analytics</button>
              </>
            )}
            <button
              type="button"
              className={`${btn} text-navy underline`}
              onClick={() => { opener.current = document.activeElement as HTMLElement; setPanel(true); }}
            >
              Settings
            </button>
          </div>
        </div>
      ) : null}

      {panel ? (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-navy-deep/40 p-3" onClick={close}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="cookie-title" className="font-serif text-2xl text-navy-deep">Cookie and privacy settings</h2>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Choose whether this site may count visits. You can change this at any time from the footer.
            </p>

            <div className="mt-5 rounded-xl border border-line p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">Essential</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">Remembers this choice on your device. This site does not set any other cookies at present.</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-gold-deep">Always on</span>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-line p-4">
              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <span>
                  <span className="block text-sm font-semibold text-ink">Analytics</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    Vercel Web Analytics counts page views and referrers without third-party cookies. No advertising or cross-site tracking.
                  </span>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#2f4468]"
                  aria-label="Allow analytics"
                />
              </label>
            </div>

            <p className="mt-4 text-xs text-muted">
              More detail: <Link href="/cookies" className="text-gold-deep underline" onClick={close}>Cookie Policy</Link> and{" "}
              <Link href="/privacy" className="text-gold-deep underline" onClick={close}>Privacy Policy</Link>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className={solid} onClick={save}>Save settings</button>
              <button type="button" className={outline} onClick={close}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
