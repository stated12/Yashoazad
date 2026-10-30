import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

// Author sign-in. Supabase Auth checks the emailed code; after that this site issues its own
// signed, httpOnly cookie that is valid only for the one address in AUTHOR_EMAIL.
const NAME = "ya_author";
const PATH = "/author";
const DAYS = 30;

function secret(): string {
  return process.env.AUTHOR_SESSION_SECRET || process.env.ENQUIRY_SECRET || "";
}
export function authorEmail(): string {
  return (process.env.AUTHOR_EMAIL || "").trim().toLowerCase();
}
export function authConfigured(): boolean {
  return !!(secret().length >= 16 && authorEmail() && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export async function startSession(email: string): Promise<void> {
  const exp = Date.now() + DAYS * 86400_000;
  const payload = Buffer.from(JSON.stringify({ e: email.toLowerCase(), x: exp })).toString("base64url");
  (await cookies()).set(NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: PATH,
    maxAge: DAYS * 86400,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete({ name: NAME, path: PATH });
}

// Returns the author's email if a valid session exists, else null.
export async function currentAuthor(): Promise<string | null> {
  if (!authConfigured()) return null;
  const raw = (await cookies()).get(NAME)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const good = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(good);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { e: string; x: number };
    if (typeof e !== "string" || typeof x !== "number" || x < Date.now()) return null;
    return e === authorEmail() ? e : null;
  } catch {
    return null;
  }
}
