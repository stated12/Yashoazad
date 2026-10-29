// RESERVED FOR THE RAZORPAY PHASE.
// Decides whether the current visitor may read exclusive articles.
// Today nobody is a member, so exclusive articles show a summary and a request-access panel.
// When memberships go live: read the signed-in Supabase user, look up an active row in
// `members` (see supabase/02_membership_reserved.sql), and return true if it has not expired.
export async function hasExclusiveAccess(): Promise<boolean> {
  return false;
}
