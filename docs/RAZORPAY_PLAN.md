# Razorpay phase (last)

1. Create a Razorpay account for the correct legal entity and complete KYC. Confirm with a chartered accountant how GST applies to his services.
2. Subscriptions: start with annual and monthly passes bought once and renewed manually. Add Razorpay Subscriptions (auto-renew) only if the account is eligible.
3. Run `supabase/02_membership_reserved.sql`.
4. Add Supabase Auth (email link sign-in) for members.
5. Server routes to add: create order (price read from the server, in paise), verify signature, webhook (verified, idempotent), then update `members`.
6. Implement `hasExclusiveAccess()` in `lib/entitlement.ts` to check for an active, unexpired member.
7. Add paid products: consultation sessions (confirm a time, then pay), masterclasses, workshops.
8. Publish privacy, terms, cancellation and refund pages before taking money. Payments must be tested in Razorpay test mode first.
