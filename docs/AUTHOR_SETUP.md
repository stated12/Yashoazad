# Author Publishing System: setup

## 1. Database (Supabase > SQL Editor)
Run `supabase/03_author.sql` once. It adds Hindi, SEO and image columns to `articles`, lets English be optional, and creates the public `article-media` storage bucket. Existing articles are not changed.

## 2. Sign-in (Supabase > Authentication)
Sign-in uses Supabase's standard Magic Link email. The email template does not need to be edited.
1. Users > Add user > enter Sir's email, tick "Auto confirm user". No password is needed.
2. Turn OFF "Allow new users to sign up".
3. URL Configuration: set **Site URL** to `https://yashoazad.in` and add `https://yashoazad.in/author/callback` under **Redirect URLs**. Without this, the link will not return to the dashboard.
4. (Recommended) Project Settings > Authentication > SMTP: use Resend SMTP (host smtp.resend.com, port 465, user `resend`, password = your Resend API key, sender on your verified domain). Without this, Supabase's built-in sender allows only a few emails per hour.
5. Project Settings > API: copy the `anon` / public key.

## 3. Vercel environment variables (then redeploy)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the anon/public key (safe to be public)
- `AUTHOR_EMAIL` = Sir's email, exactly as added in step 2.1
- `AUTHOR_SESSION_SECRET` = any long random text, 16+ characters (optional; `ENQUIRY_SECRET` is used if empty)

## 4. First test (do this yourself before handing over)
1. Open yashoazad.in/author on a phone. Enter the email, open the emailed link on the same phone, and you land on the dashboard.
2. Write a short test article in English and Hindi. Add a photo. Press Preview.
3. Publish. Check /insights, the article page, the English/हिन्दी switch, and Share.
4. Unpublish, then Delete the test article.
5. Check a wrong email receives no email, and /author while signed out shows only the sign-in form.

## Behaviour to know
- Drafts autosave about 4 seconds after typing stops. Live articles change only when "Update live" is pressed.
- A language is shown to readers only if its title, summary and text are all filled in.
- Photos are shrunk on the phone before upload. Videos: up to 50 MB uploaded directly (no progress bar; keep the page open). Longer videos: upload to YouTube and use "Add YouTube link". iPhone .mov files may not play in non-Safari browsers.
- Videos from YouTube/Vimeo load only after the reader presses play.
- Delete is permanent. Uploaded photos stay in storage after an article is deleted.
- Not tested yet: nothing here was built or run (the sandbox cannot install packages). The first Vercel preview build is the real test.

- Open the sign-in link on the device you will write on. The link works once. Some email apps pre-open links to scan them, which can use it up; if you see "link expired", request a new one and open it from the email app's own browser or copy it into your main browser.
