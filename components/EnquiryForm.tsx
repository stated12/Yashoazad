"use client";

import { useState } from "react";
import { FORMS } from "@/lib/forms";

export default function EnquiryForm({ type, compact = false }: { type: keyof typeof FORMS; compact?: boolean }) {
  const def = FORMS[type];
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const values: Record<string, string | boolean> = {};
    for (const field of def.fields) {
      const v = f.get(field.name);
      values[field.name] = field.type === "checkbox" ? v === "on" : typeof v === "string" ? v : "";
    }
    setState("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: def.type, values, website: f.get("website") }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error || "Something went wrong.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Network error. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-xl border border-gold/40 bg-gold-soft px-5 py-6 text-sm text-ink">
        {def.success}
      </div>
    );
  }

  const input = "w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-gold";

  return (
    <form onSubmit={onSubmit} className={compact ? "flex flex-col sm:flex-row gap-2" : "space-y-4"} noValidate={false}>
      {def.fields.map((f) => (
        <div key={f.name} className={compact ? "flex-1" : ""}>
          {f.type === "checkbox" ? (
            <label className="flex items-start gap-3 text-sm text-body">
              <input type="checkbox" name={f.name} required={f.required} className="mt-1" />
              <span>{f.label}</span>
            </label>
          ) : (
            <>
              <label htmlFor={`${def.type}-${f.name}`} className={compact ? "sr-only" : "block text-xs font-medium text-muted mb-1.5"}>
                {f.label}{f.required ? " *" : ""}
              </label>
              {f.type === "textarea" ? (
                <textarea id={`${def.type}-${f.name}`} name={f.name} required={f.required} maxLength={f.max} rows={5} className={input} />
              ) : f.type === "select" ? (
                <select id={`${def.type}-${f.name}`} name={f.name} required={f.required} defaultValue="" className={input}>
                  <option value="" disabled>Select</option>
                  {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  id={`${def.type}-${f.name}`}
                  name={f.name}
                  required={f.required}
                  maxLength={f.max}
                  placeholder={compact ? "Your email address" : undefined}
                  type={f.type === "datetime" ? "datetime-local" : f.type}
                  className={input}
                />
              )}
              {f.help ? <p className="text-xs text-muted mt-1">{f.help}</p> : null}
            </>
          )}
        </div>
      ))}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center justify-center rounded-lg bg-navy hover:bg-navy-deep disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 transition-colors"
      >
        {state === "sending" ? "Sending..." : def.submit}
      </button>
    </form>
  );
}
