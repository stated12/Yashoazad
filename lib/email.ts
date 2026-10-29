import type { FormDef } from "./forms";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function sendEnquiryEmail(def: FormDef, values: Record<string, string>): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const to = process.env.ENQUIRY_TO_EMAIL || "yashoazad@ymail.com";
  const from = process.env.ENQUIRY_FROM_EMAIL || "Website <onboarding@resend.dev>";
  const rows = def.fields
    .filter((f) => values[f.name])
    .map((f) => `<tr><td style="padding:6px 12px 6px 0;color:#6b7689;vertical-align:top">${esc(f.label)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(values[f.name])}</td></tr>`)
    .join("");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email || undefined,
        subject: `[Website] ${def.title}${values.name ? " from " + values.name : ""}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;color:#1f2f4d"><h3>${esc(def.title)}</h3><table>${rows}</table><p style="color:#6b7689;font-size:12px">Sent from the website enquiry form. Reply to this email to answer the sender.</p></div>`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
