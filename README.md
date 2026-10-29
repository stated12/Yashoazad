# yashoazad.in: website for Yashovardhan Jha Azad

Next.js 16 + Supabase + Vercel + Resend. Razorpay is reserved for the last phase.

## What is already built
Home, About and Career, Insights (articles with free and exclusive access), Exclusive Insights, Book page, Students and Learning, Speaking, Consult (booking requests), Media, Contact.
All forms are saved in Supabase **and** emailed to the inbox set in `ENQUIRY_TO_EMAIL`.
Exclusive articles are protected on the server: the text is never sent to a reader who is not entitled to it.

## Set-up, in this order

### 1. GitHub
Create a new repository, for example `yashoazad-site`, and add the files (see the unpack instructions given with the zip).

### 2. Supabase: a NEW project, separate from Stated
1. supabase.com, New project, name `yashoazad-site`, region Mumbai (ap-south-1), save the database password.
2. SQL Editor, paste all of `supabase/01_schema.sql`, Run.
3. Project Settings, API: copy the **Project URL** and the **service_role** key.
   The service_role key is a secret. It goes only into Vercel, never into the code.
   (Do not run `02_membership_reserved.sql` yet. It is for the Razorpay phase.)

### 3. Resend (email)
1. resend.com, add the domain `yashoazad.in`, add the DNS records it shows at his domain registrar, wait for Verified.
2. Create an API key.
3. Until the domain is verified, Resend only delivers to the email the Resend account was created with. To test earlier, create the Resend account with `yashoazad@ymail.com`.
4. Set the sender to an address on the verified domain, for example `enquiries@yashoazad.in`.

### 4. Vercel: a NEW project
1. vercel.com, Add New, Project, import the repository. Framework: Next.js (automatic).
2. Settings, Environment Variables (Production and Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `ENQUIRY_FROM_EMAIL` e.g. `Yashovardhan Azad Website <enquiries@yashoazad.in>`
   - `ENQUIRY_TO_EMAIL` = `yashoazad@ymail.com`
   - `ENQUIRY_SECRET` = any long random string
   - `NEXT_PUBLIC_SITE_URL` = `https://yashoazad.in`
3. Deploy.
4. Settings, Domains: add `yashoazad.in` and `www.yashoazad.in`, then set the records Vercel shows at the registrar.
   Confirm with the client that he controls the domain before changing its DNS. The current one-page site will be replaced.

### 5. Test before launch
Submit each form once (contact, speaking, consult, exclusive, learning, newsletter). Check that the email arrives (also in spam) and that a row appears in Supabase, Table Editor, `enquiries`.

## Editing content
- **Profile, timeline, honours, book**: edit `lib/profile.ts` (comments marked VERIFY need his confirmation). Sensitive career items are hidden until `SHOW_SENSITIVE_DETAILS` is set to `true`.
- **Articles**: Supabase, Table Editor, `articles`, Insert row. Write `body` in Markdown. `topic` must be one of the six topics in `lib/site.ts`. Set `access` to `free` or `exclusive` and `status` to `published`.
- **Media**: Table Editor, `media_items`.
- **Enquiries**: Table Editor, `enquiries`. Change `status` as you work through them.

## Razorpay phase (not built yet)
See `docs/RAZORPAY_PLAN.md`. The places it plugs in are already reserved: `lib/entitlement.ts`, `supabase/02_membership_reserved.sql`, and the Consult and Learn pages.

## Photographs
Only the portrait from his own profile PDF and the book cover are used. Press and stock-agency photographs need a licence or the photographer's permission before they are published.
