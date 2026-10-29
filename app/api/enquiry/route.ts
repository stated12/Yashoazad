import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { FORMS } from "@/lib/forms";
import { db } from "@/lib/supabase";
import { sendEnquiryEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const def = FORMS[String(body?.type || "")];
  if (!def) return NextResponse.json({ error: "Unknown form." }, { status: 400 });

  // Honeypot: real visitors never fill this field. Pretend success so bots move on.
  if (typeof body.website === "string" && body.website.trim() !== "") return NextResponse.json({ ok: true });

  // Validate against the shared definition. Never trust the browser.
  const values: Record<string, string> = {};
  for (const f of def.fields) {
    let v = body.values?.[f.name];
    v = typeof v === "string" ? v.trim() : v === true ? "Yes" : "";
    if (f.required && !v) return NextResponse.json({ error: `Please complete: ${f.label.replace(/\.$/, "").slice(0, 60)}` }, { status: 400 });
    if (!v) continue;
    if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return NextResponse.json({ error: "That email address looks invalid." }, { status: 400 });
    if (f.type === "select" && f.options && !f.options.includes(v)) return NextResponse.json({ error: `Please choose a valid option for ${f.label}.` }, { status: 400 });
    values[f.name] = v.slice(0, f.max ?? 500);
  }

  const secret = process.env.ENQUIRY_SECRET || "";
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const ipHash = createHash("sha256").update(ip + secret).digest("hex");

  const supabase = db();
  let stored = false;

  if (supabase) {
    // Rate limit: 6 submissions per IP per hour
    const since = new Date(Date.now() - 3600 * 1000).toISOString();
    const { count } = await supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if ((count ?? 0) >= 6) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });

    const { error } = await supabase.from("enquiries").insert({
      type: def.type,
      name: values.name || null,
      email: values.email || null,
      details: values,
      ip_hash: ipHash,
    });
    stored = !error;
  }

  const emailed = def.notify ? await sendEnquiryEmail(def, values) : false;

  // Success only if the enquiry was saved or delivered by email.
  if (!stored && !emailed) {
    return NextResponse.json({ error: "We could not send your message right now. Please try again shortly." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, message: def.success });
}
