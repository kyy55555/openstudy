# OpenStudy

OpenStudy indexes verified public university courses and builds prerequisite-aware self-study paths.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional free cloud sync

The site works without cloud configuration: guest progress and saved courses stay in the browser. To enable email accounts and cross-device sync with a free Supabase project:

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor. This creates the progress table and user-only Row Level Security policies.
3. Copy `.env.example` to `.env.local` and enter the project URL and publishable key. Never expose a secret or service-role key.
4. Set `NEXT_PUBLIC_SITE_URL` to the public Beta URL.
5. In Supabase Authentication URL Configuration, set the Site URL to the public Beta URL. Add both the public Beta URL and its `/account` page to Redirect URLs so confirmation and password-recovery emails return to OpenStudy.
6. Keep email confirmation enabled, restart the app, and use `/account` to register.

Only authenticated users write to Supabase. Guest and account records remain separate and are never merged automatically. The cloud record contains course progress, completed resource links, saved course IDs, the account ID, and an update timestamp; course content remains on official university websites.

Anonymous and authenticated visitors can submit Beta feedback, but cannot read feedback rows. The SQL script is safe to run again when policies change.

## Beta deployment checklist

- Configure the three environment variables from `.env.example` in the host.
- Run `supabase/schema.sql` and verify Row Level Security is enabled on both tables.
- Confirm a new account by email, then verify progress on a second browser.
- Send a password-reset email and verify that its link opens `/account` and accepts a new password.
- Verify that guest progress does not appear inside the account after sign-in.
- Download a learning-record backup from `/dashboard` and confirm that it contains no email or password.
- Run all checks below and review any link warnings manually.
- Use a custom domain only after the preview deployment passes these checks.

## Checks

```bash
npm run check:beta
```

Or run the individual checks:

```bash
npm test
npm run lint
npm run build
npm run check:links
```
